var reddit = require('../index.js');

// reddit._addListingRequest = function(name, endpoint, path, args, cb)
reddit._addListingRequest("userLinks", "submitted.json", null, ['sort', 't']);
reddit._addListingRequest("userComments", "comments.json", null, ['sort', 't']);
reddit._addListingRequest("userLiked", "liked.json", null, ['sort', 't']);
reddit._addListingRequest("userDisliked", "disliked.json", null, ['sort', 't']);
reddit._addListingRequest("userHidden", "hidden.json", null, ['sort', 't']);
reddit._addListingRequest("userSaved", "saved.json", null, ['sort', 't']);
reddit._addListingRequest("userGilded", "gilded.json", null, ['sort', 't']);