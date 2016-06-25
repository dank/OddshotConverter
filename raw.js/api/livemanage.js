var reddit = require('../index.js');

reddit.prototype.inviteLiveContributor = function(threadID, username, permissions, callback) {
	if(typeof permissions == 'function') {
		callback = permissions;
		permissions = null;
	}
	
	var permissionString = "+all";
	var possiblePermissions = ["close", "edit", "manage", "settings", "update"];
	
	if(permissions) {
		permissionString = '-all';
		for(var i = 0; i < possiblePermissions.length; i++) {
			permissionString += ',';
			if(permissions.indexOf(possiblePermissions[i]) != -1) {
				permissionString += '+' + possiblePermissions[i];
			} else {
				permissionString += '-' + possiblePermissions[i];
			}
		}
	}
	
	var self = this;
	this._apiRequest("invite_contributor", {"path": "/api/live/" + threadID, "method": "POST", "form": {
		"api_type": "json",
		"name": username,
		"permissions": permissionString,
		"type": "liveupdate_contributor_invite"
	}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

// reddit._addLiveRequest = function(name, endpoint, method, args, constArgs, callback)

reddit._addLiveRequest("acceptLiveContributorInvite", "accept_contributor_invite", "POST", [], {"api_type": "json"}, "_multipleErrors");
reddit._addLiveRequest("closeLiveThread", "close_thread", "POST", [], {"api_type": "json"}, "_multipleErrors");
reddit._addLiveRequest("editLiveThread", "edit", "POST", ["title", "description"], {"api_type": "json"}, "_multipleErrors");
reddit._addLiveRequest("leaveLiveContributor", "leave_contributor", "POST", [], {"api_type": "json"}, "_multipleErrors");
reddit._addLiveRequest("removeLiveContributor", "rm_contributor", "POST", ["id"], {"api_type": "json"}, "_multipleErrors");
reddit._addLiveRequest("removeLiveContributorInvite", "rm_contributor_invite", "POST", ["id"], {"api_type": "json"}, "_multipleErrors");

reddit.prototype.changeLiveContributorPermissions = function(threadID, username, permissions, callback) {
	if(typeof permissions == 'function') {
		callback = permissions;
		permissions = null;
	}
	
	var permissionString = "+all";
	var possiblePermissions = ["close", "edit", "manage", "settings", "update"];
	
	if(permissions) {
		permissionString = '-all';
		for(var i = 0; i < possiblePermissions.length; i++) {
			permissionString += ',';
			if(permissions.indexOf(possiblePermissions[i]) != -1) {
				permissionString += '+' + possiblePermissions[i];
			} else {
				permissionString += '-' + possiblePermissions[i];
			}
		}
	}
	
	var self = this;
	this._apiRequest("set_contributor_permissions", {"path": "/api/live/" + threadID, "method": "POST", "form": {
		"api_type": "json",
		"name": username,
		"permissions": permissionString,
		"type": "liveupdate_contributor"
	}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit.prototype.changeLiveContributorInvitePermissions = function(threadID, username, permissions, callback) {
	if(typeof permissions == 'function') {
		callback = permissions;
		permissions = null;
	}
	
	var permissionString = "+all";
	var possiblePermissions = ["close", "edit", "manage", "settings", "update"];
	
	if(permissions) {
		permissionString = '-all';
		for(var i = 0; i < possiblePermissions.length; i++) {
			permissionString += ',';
			if(permissions.indexOf(possiblePermissions[i]) != -1) {
				permissionString += '+' + possiblePermissions[i];
			} else {
				permissionString += '-' + possiblePermissions[i];
			}
		}
	}
	
	var self = this;
	this._apiRequest("set_contributor_permissions", {"path": "/api/live/" + threadID, "method": "POST", "form": {
		"api_type": "json",
		"name": username,
		"permissions": permissionString,
		"type": "liveupdate_contributor_invite"
	}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};