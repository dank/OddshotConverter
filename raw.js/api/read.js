var reddit = require('../index.js');

// reddit._addSimpleRequest = function(name, endpoint, method, args, constArgs, callback)
// reddit._addListingRequest = function(name, endpoint, path, args, cb)

reddit._addSimpleRequest("moreComments", "morechildren", "POST", ["link_id", "children", "sort"], {"api_type": "json"}, "_things");

reddit.prototype.multis = function(callback) {
	var self = this;
	this._apiRequest("mine", {"path": "/api/multi"}, function(err, response, body) {
		self._rawJSON(err, body, callback);
	});
};

reddit.prototype.multiInfo = function(user, multi, callback) {
	var self = this;
	this._apiRequest(multi, {"path": "/api/multi/user/" + user + "/m"}, function(err, response, body) {
		self._rawJSON(err, body, callback);
	});
};

reddit.prototype.multiDescription = function(user, multi, callback) {
	var self = this;
	this._apiRequest("description", {"path": "/api/multi/user/" + user + "/m/" + multi}, function(err, response, body) {
		self._rawJSON(err, body, callback);
	});
};

reddit.prototype.recommended = function(sr, omit, callback) {
	if(typeof omit == 'function') {
		callback = omit;
		omit = [];
	}
	
	var self = this;
	this._apiRequest(sr.join(','), {"path": "/api/recommend/sr", "qs": {"omit": omit.join(',')}}, function(err, response, body) {
		self._rawJSON(err, body, callback);
	});
};

reddit._addSimpleRequest("searchSubredditNames", "search_reddit_names.json", "POST", ["query", "include_over_18"], null, "_rawJSON");
reddit._addSimpleRequest("searchSubredditTopics", "subreddits_by_topic.json", "GET", ["query"], null, "_rawJSON");

reddit.prototype.userTrophies = function(user, callback) {
	var self = this;
	this._apiRequest("trophies", {"path": "/api/v1/user/" + user}, function(err, response, body) {
		self._listing(err, body, callback);
	});
};

reddit.prototype.comments = function(options, callback) {
	if(typeof options == 'function') {
		callback = options;
		options = {};
	}
	
	var path = '';
	if(options.r) {
		path = "/r/" + options.r;
	}
	
	if(options.link) {
		path += "/comments";
	}
	
	var qs = {
		"comment": options.comment,
		"context": options.context,
		"after": options.after,
		"before": options.before,
		"depth": options.depth,
		"limit": options.limit,
		"sort": options.sort
	};
	
	var self = this;
	this._apiRequest(((options.link) ? options.link : "comments") + ".json", {"path": path, "qs": qs}, function(err, response, data) {
		if(err) {
			callback(err);
			return;
		}
		
		var json;
		try {
			json = JSON.parse(data);
		} catch(e) {
			callback("reddit API returned invalid response: " + e);
			return;
		}
		
		if(json.error) {
			callback(json.error);
		} else if(options.link) {
			callback(null, json[1], json[0]);
		} else {
			callback(null, json);
		}
	});
};

reddit._addListingRequest("hot", "hot.json");
reddit._addListingRequest("new", "new.json");
reddit._addListingRequest("top", "top.json", null, ["t"]);
reddit._addListingRequest("controversial", "controversial.json", null, ["t"]);

reddit.prototype.random = function(r, callback) {
	if(typeof r == 'function') {
		callback = r;
		r = null;
	}
	
	var path = '';
	if(r) {
		path = "/r/" + r;
	}
	
	this._apiRequest("random.json", {"path": path}, function(err, response, body) {
		if(!callback) {
			return;
		}
		
		if(err) {
			callback(err);
			return;
		}
		
		var json;
		try {
			json = JSON.parse(body);
		} catch(e) {
			callback("reddit API returned invalid response: " + e);
			return;
		}
		
		if(json.error) {
			callback(json.error);
			return;
		}
		
		callback(null, json[0].data.children[0]);
	});
};

reddit.prototype.subredditInfo = function(r, callback) {
	var self = this;
	this._apiRequest("about.json", {"path": "/r/" + r}, function(err, response, body) {
		self._rawJSON(err, body, callback);
	});
};

reddit._addListingRequest("search", "search.json", null, ["t", "q", "sort"]);
reddit._addListingRequest("searchSubreddits", "subreddits/search.json");
reddit._addListingRequest("popularSubreddits", "subreddits/popular.json");
reddit._addListingRequest("newSubreddits", "subreddits/new.json");

reddit.prototype.user = function(user, callback) {
	var self = this;
	this._apiRequest("about.json", {"path": "/user/" + user}, function(err, response, body) {
		self._rawJSON(err, body, callback);
	});
};

reddit._addListingRequest("banned", "banned.json", "/about", ["user"]);
reddit._addListingRequest("wikiBanned", "wikibanned.json", "/about", ["user"]);
reddit._addListingRequest("approvedSubmitters", "contributors.json", "/about", ["user"]);
reddit._addListingRequest("wikiContributors", "wikicontributors.json", "/about", ["user"]);
reddit._addListingRequest("moderators", "moderators.json", "/about", ["user"]);

reddit._addListingRequest("reports", "reports.json", "/about", ["only"]);
reddit._addListingRequest("spam", "spam.json", "/about", ["only"]);
reddit._addListingRequest("modqueue", "modqueue.json", "/about", ["only"]);
reddit._addListingRequest("unmoderated", "unmoderated.json", "/about", ["only"]);

reddit._addListingRequest("liveUpdates", ".json");
reddit._addListingRequest("liveThreadInfo", "about.json");
reddit._addListingRequest("liveThreadContributors", "contributors.json");
reddit._addListingRequest("liveDiscussions", "discussions.json");