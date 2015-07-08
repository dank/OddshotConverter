var google = require('googleapis');
var fs = require('fs');

var oauth = google.auth.OAuth2;
var client = new oauth('CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI'); // REDIRECT_URI optional, never used. https://developers.google.com/youtube/registering_an_application

var refreshToken = 'REFRESH_TOKEN'; // client.generateAuthUrl(), client.getToken() https://github.com/google/google-api-nodejs-client/#authorizing-and-authenticating

exports.refresh = function(next) {
   client.setCredentials({
      refresh_token: refreshToken
   });

   client.refreshAccessToken(function(err, tokens) {
      if(!err) {
         client.setCredentials(tokens);
         console.log('Access token refreshed.');

         next();
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