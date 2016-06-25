var reddit = require('../index.js');

// reddit._addSimpleRequest = function(name, endpoint, method, args, constArgs, callback)
reddit._addSimpleRequest("del", "del", "POST", ["id"], null, "_noResponse");
reddit._addSimpleRequest("edit", "editusertext", "POST", ["thing_id", "text"], {"api_type": "json"}, "_modifySingleItem");
reddit._addSimpleRequest("inboxReplies", "sendreplies", "POST", ["id", "state"], null, "_noResponse");
reddit._addLiveRequest("liveDelete", "delete_update", "POST", ["id"], {"api_type": "json"}, "_multipleErrors");
reddit._addLiveRequest("liveStrike", "strike_update", "POST", ["id"], {"api_type": "json"}, "_multipleErrors");