var reddit = require('./index.js');
var WebSocket = require('ws');
var request = require('request');

reddit.LiveThreadReader = LiveThreadReader;

require('util').inherits(LiveThreadReader, require('events').EventEmitter);

function LiveThreadReader(id) {
	var self = this;
	request("http://www.reddit.com/live/" + id + "/about.json", function(err, response, body) {
		if(err) {
			self.emit("error", "Unable to get metadata for live thread " + id + ": " + err);
			return;
		}
		
		var json;
		try {
			json = JSON.parse(body);
		} catch(e) {
			self.emit("error", "Reddit returned invalid JSON: " + e);
			return;
		}
		
		if(!json.data.websocket_url) {
			self.emit("error", "Unable to get WebSocket URL for live thread " + id);
			return;
		}
		
		var socket = new WebSocket(json.data.websocket_url.replace(/&amp;/g, '&'));
		
		socket.on('open', function() {
			self.emit("connected");
		});
		
		socket.on('error', function(e) {
			self.emit("error", e);
		});
		
		socket.on('close', function() {
			self.emit("disconnected");
		});
		
		socket.on('message', function(msg) {
			var message;
			try {
				message = JSON.parse(msg);
			} catch(e) {
				self.emit("bad-data", e);
				return;
			}
			
			switch(message.type) {
				case 'update':
					self.emit("update", message.payload.data);
					break;
				case 'activity':
					self.emit("activity", message.payload.count, message.payload.fuzzed);
					break;
				case 'embeds_ready':
					self.emit("embeds", message.payload.liveupdate_id, message.payload.media_embeds);
					break;
				case 'settings':
					self.emit("settings", message.payload);
					break;
				case 'strike':
					self.emit("strike", message.payload);
					break;
				case 'delete':
					self.emit("delete", message.payload);
					break;
				case 'complete':
					self.emit("closed");
					break;
			}
		});
	});
}