var Promise = require('bluebird');

var request = require('request-promise');
var fs = require('fs');

var db = require('./database');
var shot = require('./oddshot');
var youtube = require('./youtube');
var facebook = require('./facebook');
var config = require('../config.json');

var Reddit = require('../raw.js'); // Modified version of raw.js
var reddit = exports.reddit = Promise.promisifyAll(new Reddit('OddshotFeed by oddshot.tv (rel-1.0.0)'));

var queue = [];

exports.startFetch = function (limit, subreddits) {
   if (!fs.existsSync('./tmp/')) fs.mkdirSync('./tmp/'); // Async is better

   setInterval(function () {
      reddit.hotAsync({domain: 'oddshot.tv', limit: limit})
         .then(function (res) {
            res.children.forEach(function (item) {
               addQueue({
                  id: item.data.id,
                  name: item.data.name,
                  title: item.data.title,
                  subreddit: item.data.subreddit.toLowerCase(),
                  url: item.data.url.toLowerCase(),
                  score: item.data.score,
                  nsfw: item.data.over_18
               })
            });
         })
         .then(function () {
            setTimeout(function () {
               reddit.hotAsync({r: subreddits.join('+'), limit: limit})
                  .then(function (res) {
                     res.children.forEach(function (item) {
                        if (item.data.is_self) {
                           var hash = /https?:\/\/(?:www\.)?oddshot.tv\/shot\/([a-z0-9_-]+)/ig;
                           var groups = item.data.selftext.match(hash);

                           if (groups && groups.length == 1) {
                              addQueue({
                                 id: item.data.id,
                                 name: item.data.name,
                                 title: item.data.title,
                                 subreddit: item.data.subreddit.toLowerCase(),
                                 url: groups[0].toLowerCase(),
                                 score: item.data.score,
                                 nsfw: item.data.over_18
                              })
                           }
                        }
                     });
                  })
                  .catch(function (err) {
                     console.error(getCurrentTime() + err);
                  });
            }, 2000);
         })
         .catch(function (err) {
            console.error(getCurrentTime() + err);
         });
   }, 60000);
};

var addQueue = function (data) {
   //{ id: '3z0w6l',
   //   name: 't3_3z0w6l',
   //   title: 'meme machine',
   //   subreddit: 'OddshotBotTest',
   //   url: 'http://oddshot.tv/shot/kqly-20160101153221169',
   //   score: 1,
   //   nsfw: false }

   db.redis.get(data.name)
      .then(function (res) {
         if (res != null) throw {name: 'AlreadyDone', message: 'Job already completed.'};

         db.redis.set(data.name, JSON.stringify(data));
         db.redis.expireat(data.name, parseInt((+new Date) / 1000) + 86400);

         return db.posts.count({where: {postUrl: data.url}});
      })
      .then(function (count) {
         if (count > 0) throw {name: 'AlreadyDone', message: 'Job already completed.'};
         if (data.score < 5 || data.nsfw) throw {
            name: 'LowQualityPost',
            message: 'Not converting low quality content.'
         };

         queue.push(data);
      })
      .catch(function (err) {
         if (err.name != 'AlreadyDone') db.redis.del(data.name);
         //console.error(err); // Too much spam!!!
      });
};

var nextQueue = exports.nextQueue = function () {
   if (queue.length > 0) {
      var thread = queue[0];
      queue.shift();
      console.log(getCurrentTime() + 'Job found. %s', thread.url);

      var data = {};

      shot.getInfo(thread.url)
         .then(function (info) {
            if (config.blacklists.channels.indexOf(info.twitch) >= 0 || config.blacklists.subreddits.indexOf(thread.subreddit) >= 0) throw {
               name: 'Break',
               message: 'Channel/Subreddit has been blacklisted.'
            };
            if (info.ready == false) throw {name: 'Continue', message: 'Shot is not ready.'};

            data.source = info.mp4;
            data.dir = './tmp/' + thread.name + '.mp4';
            return downloadFile(data.source, data.dir);
         })
         .then(function () {
            return facebook.upload(thread.title, thread.title, data.source);
         })
         .then(function () {
            var tags = ['Oddshot', 'OddshotFeed', 'OddshotBot', thread.subreddit];

            var game = config.games[thread.subreddit];
            tags = tags.concat((game == undefined) ? [] : [game.title, game.short]);

            return youtube.upload(thread.title.length > 95 ? thread.title.substring(0, 95) + '...' : thread.title, 'This action was completed by a bot. More information can be found below.\n\n\nOriginal Shot: ' + thread.url + '\n\nTwitter: https://twitter.com/OddshotFeed\nFacebook: https://www.facebook.com/OddshotFeed-561692363981104\nReddit: https://reddit.com/u/OddshotFeed\n\nFAQ: https://redd.it/3vue7d\n\nhttp://oddshot.tv', tags, data.dir);
         })
         .then(function (upload) {
            data.mirror = 'https://youtu.be/' + upload.id;
            //return reddit.commentAsync(thread.name, '[YouTube Mirror](' + data.mirror + ') \n****\n ^[social](https://np.reddit.com/r/OddshotFeed/comments/3w8u15/social_media_links/) ^- ^[faq](https://np.reddit.com/r/OddshotFeed/comments/3vue7d/frequently_asked_questions/) ^- ^[oddshot.tv](http://oddshot.tv)');
            return reddit.commentAsync(thread.name, '[YouTube Mirror](' + data.mirror + ') \n****\n ^[faq](https://np.reddit.com/r/OddshotFeed/comments/3vue7d/frequently_asked_questions/) ^- ^[report](https://www.reddit.com/message/compose/?to=/r/OddshotFeed&subject=Report&message=Post:%20' + thread.id + '%0A%0AReason%20(optional\\):%20)');
         })
         .then(function (comment) {
            fs.unlinkSync(data.dir);

            db.posts.create({
               postId: thread.id,
               postUrl: thread.url,
               mirror: data.mirror,
               commentId: comment.data.id
            });

            console.log(getCurrentTime() + 'Job complete. %s => %s', thread.id, comment.data.id);
            nextQueue();
         })
         .catch(function (err) {
            console.error(getCurrentTime() + err);
            if (err.name != 'Break') db.redis.del(thread.name);
            nextQueue();
         });
   } else {
      setTimeout(nextQueue, 2000);
   }
};

var downloadFile = function (url, dir) {
   return new Promise(function (resolve, reject) {
      request(url)
         .pipe(fs.createWriteStream(dir))
         .on('close', function (err) {
            if (err) reject(err);
            resolve();
         });
   });
};

var getCurrentTime = function() {
   var date = new Date();
   return '[' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2) + ':' + ("0" + date.getSeconds()).slice(-2) + '] ';
};