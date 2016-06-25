var reddit = require('../index.js');

reddit.prototype.changeModeratorInvitePermissions = function(subreddit, username, permissions, callback) {
	if(typeof permissions === 'function') {
		callback = permissions;
		permissions = null;
	}
	
	changePerms(this, subreddit, username, permissions, "moderator_invite", callback);
};

reddit.prototype.changeModeratorPermissions = function(subreddit, username, permissions, callback) {
	if(typeof permissions === 'function') {
		callback = permissions;
		permissions = null;
	}
	
	changePerms(this, subreddit, username, permissions, "moderator", callback);
};

function resolvePermissions(permissions) {
	if(!permissions) {
		return "+all";
	}
	
	var permissionString = '-all';
	["access", "config", "flair", "mail", "posts", "wiki"].forEach(function(perm) {
		permissionString += ',';
		if(permissions.indexOf(perm) != -1) {
			permissionString += '+';
		} else {
			permissionString += '-';
		}
		
		permissionString += perm;
	});
	
	return permissionString;
}

function changePerms(self, sr, user, perms, type, callback) {
	self._apiRequest("setpermissions", {"path": "/r/" + sr + "/api", "method": "POST", "form": {
		"api_type": "json",
		"name": user,
		"permissions": resolvePermissions(perms),
		"type": type
	}}, function(err, response, body) {
		self._multipleErrors(err, body, callback)
	});
}

reddit.prototype.inviteModerator = function(subreddit, username, permissions, callback) {
	if(typeof permissions === 'function') {
		callback = permissions;
		permissions = null;
	}
	
	var self = this;
	this._apiRequest("friend", {"path": "/r/" + subreddit + "/api", "method": "POST", "form": {
		"api_type": "json",
		"name": username,
		"permissions": resolvePermissions(permissions),
		"type": "moderator_invite"
	}}, function(err, response, body) {
		self._multipleErrors(err, body, callback);
	});
};

reddit._addSubredditUnfriendRequest("revokeModeratorInvite", "moderator_invite");
reddit._addSubredditUnfriendRequest("removeModerator", "moderator");