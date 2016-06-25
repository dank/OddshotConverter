var reddit = require('../index.js');

// reddit._addSimpleRequest = function(name, endpoint, method, args, constArgs, callback)

reddit._addSimpleRequest("captchaNeeded", "needs_captcha.json", "GET", [], null, "_rawJSON");

reddit.prototype.captcha = function(callback) {
	var self = this;
	this._apiRequest("new_captcha", {"method": "POST", "form": {"api_type": "json"}}, function(err, response, body) {
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
		} else if(json.json.errors.length == 1) {
			callback(json.json.errors[0]);
		} else if(json.json.errors.length > 1) {
			callback(json.json.errors);
		} else {
			self._captchaIdent = json.json.data.iden;
			callback(null, "http://www.reddit.com/captcha/" + json.json.data.iden);
		}
	});
};