var config = require('../config.json');

var Redis = require('ioredis');
exports.redis = new Redis();

var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
   host: config.mysql.host,
   port: config.mysql.port,
   logging: false,
   pool: {
      max: 5,
      min: 1,
      idle: 10000
   }
});

console.log('Connected to database.');

exports.posts = sequelize.define('posts', {
   postId: {type: Sequelize.TEXT, allowNull: false},
   postUrl: {type: Sequelize.TEXT, allowNull: false},
   mirror: {type: Sequelize.TEXT, allowNull: false},
   commentId: {type: Sequelize.TEXT, allowNull: false}
});

sequelize.sync();