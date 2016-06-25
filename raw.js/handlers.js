var reddit = require('./index.js');

reddit.prototype._modifySingleItem = function(err, body, callback) {
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
	} else if(json.json.errors.length == 1) {
		callback(json.json.errors[0]);
	} else if(json.json.errors.length > 1) {
		callback(json.json.errors);
	} else {
		callback(null, json.json.data.things[0]);
	}
}

reddit.prototype._noResponse = function(err, body, callback) {
	if(!callback) {
		return;
	}
	
	if(err) {
		callback(err);
		return;
	}
	
	var json;
	try {
		var json = JSON.parse(body);
	} catch(e) {
		callback("reddit API returned invalid response: " + e);
		return;
	}
	
	if(json.error) {
		callback(json.error);
	} else {
		callback(null);
	}
};

reddit.prototype._rawJSON = function(err, body, callback) {
	if(!callback) {
		return;
	}
	
	if(err) {
		callback(err);
		return;
	}
	
	var json;
	try {
		var json = JSON.parse(body);
	} catch(e) {
		callback("reddit API returned invalid response: " + e);
		return;
	}
	
	if(json.error) {
		callback(json.error);
	} else {
		callback(null, json);
	}
};

reddit.prototype._listing = function(err, body, callback) {
	if(!callback) {
		return;
	}
	
	if(err) {
		callback(err);
		return;
	}
	
	var json;
	try {
		var json = JSON.parse(body);
	} catch(e) {
		callback("reddit API returned invalid response: " + e);
		return;
	}
	
	if(json.error) {
		callback(json.error);
	} else {
		callback(null, json.data);
	}
};

reddit.prototype._things = function(err, body, callback) {
	if(!callback) {
		return;
	}
	
	if(err) {
		callback(err);
		return;
	}
	
	var json;
	try {
		var json = JSON.parse(body);
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
		callback(null, json.json.data.things);
	}
};

reddit.prototype._multipleErrors = function(err, body, callback) {
	if(!callback) {
		return;
	}
	
	if(err) {
		callback(err);
		return;
	}
	
	var json;
	try {
		var json = JSON.parse(body);
	} catch(e) {
		callback("reddit API returned invalid response: " + e);
		return;
	}
	
	if(json.error) {
		callback(json.error);
	} else if(json.json.errors.length == 1) {
		if(json.json.errors[0].length) {
			callback(json.json.errors[0][0]);
		} else {
			callback(json.json.errors[0]);
		}
	} else if(json.json.errors.length > 1) {
		callback(json.json.errors);
	} else {
		callback(null);
	}
};