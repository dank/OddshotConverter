var reddit = require('../index.js');

// reddit._addSimpleRequest = function(name, endpoint, method, args, constArgs, callback)

reddit._addSimpleRequest("hide", "hide", "POST", ["id"], null, "_noResponse");
reddit._addSimpleRequest("unhide", "unhide", "POST", ["id"], null, "_noResponse");
reddit._addSimpleRequest("report", "report", "POST", ["id"], null, "_noResponse");
reddit._addLiveRequest("reportLiveThread", "report", "POST", ["type"], {"api_type": "json"}, "_multipleErrors"); // _multipleErrors is just a guess since I didn't want to actually report a thread to test this