var google = require('googleapis');
var fs = require('fs');
var config = require('../config.js');

var oauth = google.auth.OAuth2;
var client = new oauth(config.YOUTUBE_CLIENT_ID, config.YOUTUBE_CLIENT_SECRET, config.YOUTUBE_REDIRECT_URL);
var refreshToken = config.YOUTUBE_REFRESH_TOKEN;

exports.refresh = function(next) {
   client.setCredentials({
      refresh_token: refreshToken
   });

   client.refreshAccessToken(function(err, tokens) {
      if(!err) {
         client.setCredentials(tokens);
         console.log('Access token refreshed.');

         if(next) {
            next();
         }
      }
   });
};

exports.upload = function(title, description, file, next) {
   var youtube = google.youtube({version: 'v3', auth: client});
   youtube.videos.insert({
      part: 'status,snippet',
      resource: {
         snippet: {
            title: title,
            description: description,
            categoryId: 20 // Category may change depending on region https://developers.google.com/youtube/v3/docs/videoCategories/list
         },
         status: {
            privacyStatus: 'public'
         }
      },
      media: {
         body: fs.createReadStream(file)
      }
   }, function(err, data) {
      if(err) {
         next(err, null);
      } else {
         next(null, data);
      }
   });
};