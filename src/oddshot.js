var Promise = require('bluebird');
var request = require('request-promise');

exports.getInfo = function (url) { // Can be replaced by an API in the future
   return new Promise(function (resolve, reject) {
      request(url)
         .then(function (body) {
            if (body.indexOf('Shot is pending...') >= 0 || body.indexOf('Shot processing...') >= 0) resolve({ready: false});

            var mp4 = body.match('source src=(?:"|\')(.*?)(?:"|\') type=(?:"|\')video/mp4(?:"|\')')[1];
            var channel = body.match('<span id="streamerID">(.*?)</span>')[1];

            resolve({ready: true, twitch: channel, shot: url, mp4: mp4});
         })
         .catch(function (err) {
            reject(err);
         });
   });

   /*
    { ready: true,
    twitch: 'ESL_CSGO',
    shot: 'http://oddshot.tv/shot/esl-csgo-2015080617615878',
    mp4: 'https://d301dinc95ec5f.cloudfront.net/capture/esl-csgo-2015080617615878.shot.mp4' }
    */
};