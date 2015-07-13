var request = require('request');
var rawjs = require('raw.js');
var reddit = new rawjs('Oddshot Converter by /u/iEyepawd (rel-1.0.6)');
var models = require('./src/sequelize');
var youtube = require('./src/youtube');
var fs = require('fs');

reddit.setupOAuth2('CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI'); // REDIRECT_URI is optional and never used. https://github.com/reddit/reddit/wiki/OAuth2
reddit.auth({username: 'USERNAME', password: 'PASSWORD'}, function(err) { // Reddit account username & password
   if(err) {
      error('Authentication failed. Error: ' + err);
   } else {
      console.log('Authentication complete.');

      youtube.refresh(function() {
         setInterval(fetch, 2000, 'OddshotBot'); // maximum 30 requests per minute https://github.com/reddit/reddit/wiki/API
         setInterval(youtube.refresh, 1800000); // YouTube access_token expires every 1 hour, refresh for a new token every 30 minutes.
         // TODO: Crontab might be more useful
      });
   }
});

var fetch = function(subreddit) {
   reddit.new({r: subreddit, limit: 5}, function(err, res) {
      if(err) {
         error('Error fetching posts. Error: ' + err);
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

var fetchOnce = function(data, post) {
   request(data.data.url, function (err , res, body) {
      if(err) {
         error('Request error. Error: ' + err);
      } else if(res.statusCode != 200) {
         error('Request error. Error: Status Code ' + res.statusCode);
      } else {
         if(body.indexOf('Shot is pending...') < 0 && body.indexOf('Shot processing...') < 0) {
            var url = body.match('source src=(?:"|\')(.*?)(?:"|\') type=(?:"|\')video/mp4(?:"|\')')[1];
            var dir = './tmp/' + data.data.id + '.mp4';

            if (!fs.existsSync('./tmp/')) { // TODO: Apparently this is bad practice (?)
               fs.mkdirSync('./tmp/');
            }

            request(url).pipe(fs.createWriteStream(dir)).on('close', function () {
               youtube.upload(data.data.title, 'I am a bot. Please report any bugs to me, my contact info can be found below.\nOriginal video: ' + data.data.url + '\n\nGitHub: https://github.com/nicememe/oddshotconverter\nContact: https://keybase.io/gay\nFAQ: https://www.reddit.com/r/OddshotBot/wiki/faq', dir, function (err, up) {
                  if (err) {
                     error('Upload error. Error: ' + err);
                     post.updateAttributes({mirror: err, commentId: 'error'});
                  } else {
                     var ytUrl = 'https://youtu.be/' + up.id;
                     post.updateAttributes({mirror: ytUrl});

                     reddit.comment(data.data.name, '[YouTube Mirror](' + ytUrl + ')\n****\n^I ^am ^a ^bot. ^Feel ^free ^to ^send ^me ^any ^bugs/suggestions/comments!  \n^[github](https://github.com/nicememe/oddshotconverter) ^- ^[contact](https://keybase.io/gay) ^- ^[faq](https://www.reddit.com/r/OddshotBot/wiki/faq)', function (err, comment) {
                        if (err) {
                           error('Failed to comment. Error: ' + err);
                           post.updateAttributes({commentId: err});
                        } else {
                           post.updateAttributes({commentId: comment.data.id});
                           console.log('Successfully converted ' + data.data.id + ' to ' + comment.data.id + '(' + up.id + ').');

                           fs.unlink(dir, function (err) {
                              if (err) {
                                 error('Error removing file. Error: ' + err);
                              }
                           })
                        }
                     });
                  }
               });
            });
         } else {
            console.log('Unable to convert ' + data.data.id + ' retrying in 10 seconds.');
            setTimeout(fetchOnce, 10000, data, post);
         }
      }
   });
}

var error = function(log){
   models.errors.create({error: log}).then(function() {
      console.log(log);
   })
};