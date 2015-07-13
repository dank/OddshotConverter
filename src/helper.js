var models = require('./sequelize');

exports.errorHandler = function(err) {
   models.errors.create({error: err}).then(function () {
      console.error(err);
   });
};