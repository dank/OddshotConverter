var Promise = require('bluebird');

var gapi = require('googleapis');
var fs = require('fs');

var config = require('../config.json');

var OAuth2 = gapi.auth.OAuth2;
var client = Promise.promisifyAll(new OAuth2(config.youtube.clientId, config.youtube.clientSecret, config.youtube.redirectUrl));

var refreshToken = config.youtube.refreshToken;

exports.refresh = function () {
   return new Promise(function (resolve, reject) {
      client.setCredentials({
         refresh_token: refreshToken
      });

      client.refreshAccessTokenAsync()
         .then(function (token) {
            client.setCredentials(token);

            resolve();
         })
         .catch(function (err) {
            reject(err);
         });
   });
};

exports.upload = function (title, desc, tags, file) {
   return new Promise(function (resolve, reject) {
      var youtube = Promise.promisifyAll(gapi.youtube({version: 'v3', auth: client}).videos);

      youtube.insertAsync(
         {
            part: 'status,snippet',
            resource: {
               snippet: {
                  title: title,
                  description: desc,
                  tags: tags,
                  categoryId: 20 // Category may change depending on region https://developers.google.com/youtube/v3/docs/videoCategories/list
               },
               status: {
                  privacyStatus: 'public'
               }
            },
            media: {
               body: fs.createReadStream(file)
            }
         })
         .then(function (data) {
            resolve(data);
         })
         .catch(function (err) {
            reject(err);
         });
   });
};