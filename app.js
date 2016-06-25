var main = require('./src/main');
var youtube = require('./src/youtube');
var config = require('./config.json');

main.reddit.setupOAuth2(config.reddit.clientId, config.reddit.clientSecret, config.reddit.redirectUrl);
main.reddit.authAsync({username: config.reddit.username, password: config.reddit.password})
   .then(function () {
      return youtube.refresh();
   })
   .then(function () {
      setInterval(youtube.refresh, 1800000);

      main.startFetch(config.reddit.fetchLimit, config.whitelists.subreddits);
      main.nextQueue();
   })
   .catch(function (err) {
      console.error(err);
   });