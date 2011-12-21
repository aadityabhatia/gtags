var mongo = require('mongoskin');

module.exports = mongo.db('localhost:27017/gtags?auto_reconnect');
