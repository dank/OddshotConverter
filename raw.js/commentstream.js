var reddit = require('./index.js');
var request = require('request');

reddit.CommentStream = CommentStream;

require('util').inherits(CommentStream, require('events').EventEmitter);

function CommentStream(options) {
	options = options || {};
	
	var defaultOptions = {
		"subreddit": null,
		"interval": 1000,
		"run": true
	};
	
	for(var i in defaultOptions) {
		if(typeof options[i] == 'undefined') {
			options[i] = defaultOptions[i];
		}
	}
	
	if(options.interval < 1000) {
		options.interval = 1000;
	}
	
	this._options = options;
	
	if(this._options.run) {
		this._running = true;
		this._poll();
	} else {
		this._running = false;
	}
}

CommentStream.prototype._poll = function() {
	var self = this;
	
	var qs = {"limit": 500};
	if(self._options.subreddit) {
		qs.subreddit = self._options.subreddit;
	}
	
	if(self._newestID) {
		qs.before = self._newestID;
	}
	
	request({"uri": "http://api.redditanalytics.com/getRecent.php", "qs": qs}, function(err, response, body) {
		if(err) {
			self.emit('api-error', err);
			setTimeout(function() {
				self._poll();
			}, self._options.interval);
			return;
		}
		
		var json;
		try {
			json = JSON.parse(body);
		} catch(e) {
			self.emit('api-error', e);
			setTimeout(function() {
				self._poll();
			}, self._options.interval);
			return;
		}
		
		if(json.Error) {
			self.emit('error', json.Error);
		} else if(!json.data) {
			self.emit('api-error', "No data property.");
		} else {
			for(var i = 0; i < json.data.length; i++) {
				self.emit('comment', json.data[i]);
			}
			
			self._newestID = json.metadata.newest_id;
		}
		
		setTimeout(function() {
			self._poll();
		}, self._options.interval);
	});
};

CommentStream.prototype.start = function() {
	if(this._timeout) {
		return false;
	}
	
	this._poll();
	return true;
};

CommentStream.prototype.stop = function() {
	if(!this._timeout) {
		return false;
	}
	
	clearTimeout(this._timeout);
	this._timeout = null;
	return true;
};