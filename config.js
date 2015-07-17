// Reddit - https://www.reddit.com/r/rawjs/wiki/documentation / https://github.com/reddit/reddit/wiki/OAuth2
exports.REDDIT_SUBREDDIT = ''; // Use "+" for multiple subreddits (ex. funny+videos+pics)
exports.REDDIT_FETCH_LIMIT = 5; // Maximum number of posts per request (max: 100)
exports.REDDIT_CLIENT_ID = '';
exports.REDDIT_CLIENT_SECRET = '';
exports.REDDIT_REDIRECT_URL = ''; // Optional and never used
exports.REDDIT_USERNAME = '';
exports.REDDIT_PASSWORD = '';

// YouTube - https://github.com/google/google-api-nodejs-client / https://developers.google.com/youtube/registering_an_application
exports.YOUTUBE_CLIENT_ID = '';
exports.YOUTUBE_CLIENT_SECRET = '';
exports.YOUTUBE_REDIRECT_URL = ''; // Optional and never used
exports.YOUTUBE_REFRESH_TOKEN = ''; // client.generateAuthUrl(), client.getToken() https://github.com/google/google-api-nodejs-client/#authorizing-and-authenticating

// Database - http://docs.sequelizejs.com/en/latest/docs/getting-started/
exports.DB_DATABASE = '';
exports.DB_USERNAME = '';
exports.DB_PASSWORD = '';
exports.DB_HOST = '';
exports.DB_PORT = 3306;
exports.DB_DIALECT = 'mysql';