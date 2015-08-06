var request = require('request');
var fs = require('fs');
var rawjs = require('raw.js');
var youtube =  require('./youtube');
var models = require('./sequelize');
var helper = require('./helper');

var reddit = exports.reddit =  new rawjs('Oddshot Converter by /u/iEyepawd (rel-1.1.3)'); // Descriptive user agent

exports.fetch = function(subreddit, limit) {
   reddit.new({r: subreddit, limit: limit}, function(err, res) {
      if(err) {
         helper.errorHandler('Error fetching posts. Error: ' + err);
      } else {
         res.children.forEach(function(data) {
            if(data.kind == 't3' && data.data.over_18 == false && data.data.domain == 'oddshot.tv') {
               models.posts.count({where: {postUrl: data.data.url.toLowerCase()}}).then(function(c) {
                  if(c === 0) {
                     models.posts.create({postId: data.data.id, postUrl: data.data.url.toLowerCase(), mirror: 'pending', commentId: 'pending'}).then(function(post) {
                        fetchOnce(data, post);
                     });
                  }
               });
            }
         });
      }
   });
};

var fetchOnce = exports.fetchOnce = function(data, post) {
   request(data.data.url, function (err , res, body) {
      if(err) {
         helper.errorHandler('Request error. Error: ' + err);
      } else if(res.statusCode != 200) {
         helper.errorHandler('Request error. Error: Status Code ' + res.statusCode);
      } else {
         if(body.indexOf('Shot is pending...') < 0 && body.indexOf('Shot processing...') < 0) {
            var url = body.match('source src=(?:"|\')(.*?)(?:"|\') type=(?:"|\')video/mp4(?:"|\')')[1];
            var dir = './tmp/' + data.data.id + '.mp4';

            if (!fs.existsSync('./tmp/')) { // TODO: Apparently this is bad practice (?)
               fs.mkdirSync('./tmp/');
            }

            request(url).pipe(fs.createWriteStream(dir)).on('close', function () {
               var desc = 'I am a bot. Please report any bugs to me, my contact info can be found below.\nOriginal video: ' + data.data.url + '\nReddit: http://redd.it/' + data.data.id + '\n\nGitHub: https://github.com/nicememe/oddshotconverter\nContact: https://keybase.io/pawd\nFAQ: https://np.reddit.com/r/OddshotBot/wiki/faq\n\nI am not affiliated with Oddshot.tv or Reddit in anyway, all copyrights reserved to their respective owners.';

               if(data.data.subreddit == 'leagueoflegends') {
                  var desc = 'I am a bot. Please report any bugs to me, my contact info can be found below.\nOriginal video: ' + data.data.url + '\n\nGitHub: https://github.com/nicememe/oddshotconverter\nContact: https://keybase.io/pawd\nFAQ: https://np.reddit.com/r/OddshotBot/wiki/faq\n\nI am not affiliated with Oddshot.tv or Reddit in anyway, all copyrights reserved to their respective owners.';
               }

               youtube.upload(data.data.title, desc, dir, function (err, up) {
                  if (err) {
                     helper.errorHandler('Upload error. Error: ' + err);
                     post.updateAttributes({mirror: err, commentId: 'error'});
                  } else {
                     var ytUrl = 'https://youtu.be/' + up.id;
                     post.updateAttributes({mirror: ytUrl});

                     reddit.comment(data.data.name, '[YouTube Mirror](' + ytUrl + ')\n****\n^I ^am ^a ^bot. ^Feel ^free ^to ^send ^me ^any ^bugs/suggestions/comments!  \n^[github](https://github.com/nicememe/oddshotconverter) ^- ^[contact](https://keybase.io/pawd) ^- ^[faq](https://np.reddit.com/r/OddshotBot/wiki/faq)', function (err, comment) {
                        if (err) {
                           helper.errorHandler('Failed to comment. Error: ' + err);
                           post.updateAttributes({commentId: err});
                        } else {
                           post.updateAttributes({commentId: comment.data.id});
                           console.log('Successfully converted ' + data.data.id + ' to ' + comment.data.id + '(' + up.id + ').');

                           fs.unlink(dir, function (err) {
                              if (err) {
                                 helper.errorHandler('Error removing file. Error: ' + err);
                              }
                           })
                        }
                     });
                  }
               });
            });
         } else {
            console.error('Unable to convert ' + data.data.id + ' retrying in 10 seconds.');
            setTimeout(fetchOnce, 10000, data, post);
         }
      }
   });
};