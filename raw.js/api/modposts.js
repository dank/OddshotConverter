var reddit = require('../index.js');

// reddit._addSimpleRequest = function(name, endpoint, method, args, constArgs, callback)

reddit._addSimpleRequest("approve", "approve", "POST", ["id"], null, "_noResponse");
reddit._addSimpleRequest("ignoreReports", "ignore_reports", "POST", ["id"], null, "_noResponse");
reddit._addSimpleRequest("unignoreReports", "unignore_reports", "POST", ["id"], null, "_noResponse");
reddit._addSimpleRequest("nsfw", "marknsfw", "POST", ["id"], null, "_noResponse");
reddit._addSimpleRequest("unnsfw", "unmarknsfw", "POST", ["id"], null, "_noResponse");
reddit._addSimpleRequest("remove", "remove", "POST", ["id"], {"spam": false}, "_noResponse");
reddit._addSimpleRequest("spam", "remove", "POST", ["id"], {"spam": true}, "_noResponse");
reddit._addSimpleRequest("contestMode", "set_contest_mode", "POST", ["id", "state"], {"api_type": "json"}, "_noResponse");
reddit._addSimpleRequest("sticky", "set_subreddit_sticky", "POST", ["id", "state"], {"api_type": "json"}, "_noResponse");

reddit.prototype.distinguish = function(thing, distinguish, callback) {
	if(distinguish === true) {
		distinguish = 'yes';
	} else if(distinguish === false) {
		distinguish = 'no';
	}
	
	var self = this;
	this._apiRequest("distinguish", {"method": "POST", "form": {
		"api_type": "json",
		"how": distinguish,
		"id": thing
	}}, function(err, response, body) {
		self._modifySingleItem(err, body, callback);
	});
};