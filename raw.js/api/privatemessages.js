var reddit = require('../index.js');

// reddit._addSimpleRequest = function(name, endpoint, method, args, constArgs, callback)
// reddit._addListingRequest = function(name, endpoint, path, args, cb)

reddit._addSimpleRequest("block", "block", "POST", ["id"], null, "_noResponse");

reddit.prototype.message = function(options, callback) {
	var self = this;
	this._apiRequest("compose", {"method": "POST", "form": {
		"api_type": "json",
		"iden": (options.captcha) ? self._captchaIdent : undefined,
		"captcha": options.captcha,
		"to": options.to,
		"subject": options.subject,
		"text": options.text
	}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit.prototype.markRead = function(ids, callback) {
	if(typeof ids == 'object') {
		ids = ids.join(',');
	}
	
	var self = this;
	this._apiRequest("read_message", {"method": "POST", "form": {"id": ids}}, function(err, response, body) {
		self._noResponse(err, body, callback);
	});
};

reddit.prototype.markUnread = function(ids, callback) {
	if(typeof ids == 'object') {
		ids = ids.join(',');
	}
	
	var self = this;
	this._apiRequest("unread_message", {"method": "POST", "form": {"id": ids}}, function(err, response, body) {
		self._noResponse(err, body, callback);
	});
};

reddit._addListingRequest("inbox", "inbox.json", "/message", ["mark", "mid"]);
reddit._addListingRequest("unread", "unread.json", "/message", ["mark", "mid"]);
reddit._addListingRequest("sent", "sent.json", "/message", ["mark", "mid"]);
reddit._addListingRequest("messages", "messages.json", "/message", ["mark", "mid"]);
reddit._addListingRequest("commentReplies", "comments.json", "/message", ["mark", "mid"]);
reddit._addListingRequest("postReplies", "selfreply.json", "/message", ["mark", "mid"]);
reddit._addListingRequest("mentions", "mentions.json", "/message", ["mark", "mid"]);