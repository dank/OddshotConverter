var reddit = require('./index.js');

reddit._addSimpleRequest = function(name, endpoint, method, args, constArgs, callback) {
	reddit.prototype[name] = function() {
		var form;
		if(args.length > 0 || constArgs) {
			form = {};
		}
		
		for(var i = 0; i < args.length; i++) {
			form[args[i]] = arguments[i];
		}
		
		for(var i in constArgs) {
			form[i] = constArgs[i];
		}
		
		var userCallback = arguments[arguments.length - 1];
		if(typeof userCallback != 'function') {
			userCallback = null;
		}
		
		var req = {"method": method};
		if(method == "GET") {
			req.qs = form;
		} else {
			req.form = form;
		}
		
		var self = this;
		this._apiRequest(endpoint, req, function(err, response, body) {
			self[callback](err, body, userCallback);
		});
	};
};

reddit._addLiveRequest = function(name, endpoint, method, args, constArgs, callback) {
	reddit.prototype[name] = function() {
		var threadID = arguments[0];
		
		var form;
		if(args.length > 0 || constArgs) {
			form = {};
		}
		
		for(var i = 0; i < args.length; i++) {
			form[args[i]] = arguments[i + 1]; // argument 0 is reserved for the thread ID
		}
		
		for(var i in constArgs) {
			form[i] = constArgs[i];
		}
		
		var userCallback = arguments[arguments.length - 1];
		if(typeof userCallback != 'function') {
			userCallback = null;
		}
		
		var req = {"method": method};
		if(method == "GET") {
			req.qs = form;
		} else {
			req.form = form;
		}
		
		var self = this;
		this._apiRequest("live/" + threadID + "/" + endpoint, req, function(err, response, body) {
			self[callback](err, body, userCallback);
		});
	};
};

reddit._addListingRequest = function(name, endpoint, path, args, cb) {
	reddit.prototype[name] = function() {
		var options;
		var callback;
		if(arguments.length == 0) {
			options = {};
			callback = null;
		} else if(arguments.length == 1 && typeof arguments[0] == 'object') {
			options = arguments[0];
			callback = null;
		} else if(arguments.length == 1 && typeof arguments[0] == 'function') {
			options = {};
			callback = arguments[0];
		} else {
			options = arguments[0];
			callback = arguments[1];
		}
		
		var requestPath = '';
		if(options && options.r) {
			requestPath = "/r/" + options.r;
		}
		
		if(options && options.user) {
			requestPath = "/user/" + options.user;
		}
		
		if(options && options.live) {
			requestPath = "/live/" + options.live;
		}

      if(options && options.domain) {
         requestPath = "/domain/" + options.domain;
      }
		
		if(path) {
			requestPath += path;
		}
		
		var qs = {};
		qs.after = options.after;
		qs.before = options.before;
		qs.limit = options.limit;
		qs.count = options.count;
		qs.show = (options.all) ? "all" : undefined;
		
		if(args && options) {
			for(var i = 0; i < args.length; i++) {
				qs[args[i]] = options[args[i]];
			}
			
			if(args.indexOf("restrict_sr") != -1) {
				qs.restrict_sr = !!options.r;
			}
		}
		
		if(!cb) {
			cb = "_listing";
		}
		
		var self = this;
		this._apiRequest(endpoint, {"path": requestPath, "qs": qs}, function(err, response, body) {
			self[cb](err, body, callback);
		});
	};
};

reddit._addSubredditUnfriendRequest = function(name, type) {
	reddit.prototype[name] = function(subreddit, username, callback) {
		var self = this;
		this._apiRequest("unfriend", {"path": "/r/" + subreddit + "/api", "method": "POST", "form": {
			"type": type,
			"name": username
		}}, function(err, response, body) {
			self._noResponse(err, body, callback);
		});
	};
};