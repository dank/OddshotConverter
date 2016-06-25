var reddit = require('../index.js');

// Approved submitters
reddit.prototype.addContributor = function(subreddit, username, callback) {
	var self = this;
	self._apiRequest("friend", {"path": "/r/" + subreddit + "/api", "method": "POST", "form": {
		"api_type": "json",
		"name": username,
		"type": "contributor"
	}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit._addSubredditUnfriendRequest("removeContributor", "contributor");

// Banned users
reddit.prototype.ban = function(subreddit, username, options, callback) {
	if(typeof options === 'function') {
		callback = options;
		options = {};
	}
	
	options = options || {};
	
	var self = this;
	self._apiRequest("friend", {"path": "/r/" + subreddit + "/api", "method": "POST", "form": {
		"api_type": "json",
		"name": username,
		"duration": options.duration,
		"ban_message": options.message,
		"note": options.note,
		"type": "banned"
	}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit._addSubredditUnfriendRequest("unban", "banned");