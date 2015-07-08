var Sequelize = require('sequelize');
var sequelize = new Sequelize('DATABASE', 'USERNAME', 'PASSWORD', { // MySQL info
   host: 'HOST',
   port: 3306,
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

exports.errors = sequelize.define('errors', {
   error: {type: Sequelize.TEXT, allowNull: false}
});

sequelize.sync();