var reddit = require('../index.js');

// reddit._addSimpleRequest = function(name, endpoint, method, args, constArgs, callback)
// reddit._addListingRequest = function(name, endpoint, path)

reddit.prototype.clearUserFlairTemplates = function(r, callback) {
	var self = this;
	this._apiRequest("clearflairtemplates", {"path": "/r/" + r + "/api", "method": "POST", "form": {"api_type": "json", "flair_type": "USER_FLAIR"}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit.prototype.clearLinkFlairTemplates = function(r, callback) {
	var self = this;
	this._apiRequest("clearflairtemplates", {"path": "/r/" + r + "/api", "method": "POST", "form": {"api_type": "json", "flair_type": "LINK_FLAIR"}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit.prototype.deleteUserFlair = function(r, user, callback) {
	var self = this;
	this._apiRequest("deleteflair", {"path": "/r/" + r + "/api", "method": "POST", "form": {"api_type": "json", "name": user}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit.prototype.deleteFlairTemplate = function(r, id, callback) {
	var self = this;
	this._apiRequest("deleteflairtemplate", {"path": "/r/" + r + "/api", "method": "POST", "form": {"api_type": "json", "flair_template_id": id}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit.prototype.userFlair = function(r, user, text, cssClass, callback) {
	var self = this;
	this._apiRequest("flair", {"path": "/r/" + r + "/api", "method": "POST", "form": {"api_type": "json", "css_class": cssClass, "name": user, "text": text}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit.prototype.linkFlair = function(r, link, text, cssClass, callback) {
	var self = this;
	this._apiRequest("flair", {"path": "/r/" + r + "/api", "method": "POST", "form": {"api_type": "json", "css_class": cssClass, "link": link, "text": text}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit.prototype.flairSettings = function(r, settings, callback) {
	var self = this;
	settings.api_type = "json";
	this._apiRequest("flairconfig", {"path": "/r/" + r + "/api", "method": "POST", "form": settings}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit._addListingRequest("flairList", "flairlist.json", "/api", ["name"], "_rawJSON");

reddit.prototype.userFlairTemplate = function(r, text, editable, cssClass, id, callback) {
	if(typeof id == 'function') {
		callback = id;
		id = undefined;
	}
	
	var self = this;
	this._apiRequest("flairtemplate", {"path": "/r/" + r + "/api", "method": "POST", "form": {"api_type": "json", "css_class": cssClass, "flair_template_id": id, "flair_type": "USER_FLAIR", "text": text, "text_editable": editable}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit.prototype.linkFlairTemplate = function(r, text, editable, cssClass, id, callback) {
	if(typeof id == 'function') {
		callback = id;
		id = undefined;
	}
	
	var self = this;
	this._apiRequest("flairtemplate", {"path": "/r/" + r + "/api", "method": "POST", "form": {"api_type": "json", "css_class": cssClass, "flair_template_id": id, "flair_type": "LINK_FLAIR", "text": text, "text_editable": editable}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};