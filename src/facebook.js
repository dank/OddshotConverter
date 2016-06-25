var Promise = require('bluebird');

var facebook = require('fb');

var config = require('../config.json');

facebook.setAccessToken(config.facebook.accessToken);

exports.upload = function (title, desc, url) {
   return new Promise(function (resolve, reject) {
      facebook.api(config.facebook.pageId + '/videos', 'post',
         {
            file_url: url,
            title: title,
            description: desc
         }, function(res) { // Since Facebook hates standards and res.error means errors. lol.
            if(!res || res.error) reject(!res ? 'error' : res.error);

            resolve(res.id);
         });
   });
};