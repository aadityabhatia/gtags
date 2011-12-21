var http = require('http');

var everyauth = require("./node_modules/everyauth");
var express = require("./node_modules/express");
var db = require("./db.js");

var app = express.createServer();

var path = __dirname;
app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		secret : 'helloworld'
	}));
	app.use(express.static(path + '/public')); // Before router to enable dynamic routing
	app.use(everyauth.middleware());
	app.use(app.router);

	app.error(function(err, req, res) {
	    console.log(err)
		res.render('500', {
			error : err,
			layout: false
		});
	});

	app.use(function(req, res) {
		res.render('404', {
		    layout: false
		});
	});
	
	app.set('view engine', 'jade');
});

everyauth.helpExpress(app);

require ('./routes.js')(app);
app.listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');
