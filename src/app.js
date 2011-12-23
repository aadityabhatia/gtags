var http = require('http');
var everyauth = require("everyauth")
var express = require("express");
var conf = require('./conf.js');
var User = require("./models/user.js");

var app = express.createServer();

everyauth.everymodule.findUserById(function(id, callback) {
	console.log('everymodule.findUserById: ' + id);
	User.findById(id, callback);
});

everyauth.google
	.appId(conf.google.clientId)
	.appSecret(conf.google.clientSecret)
	.scope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/plus.me')
	.findOrCreateUser( function(session, accessToken, accessTokenExtra, userMetadata) {
		session.user = session.user || {};
		session.user.id = userMetadata.email
		userMetadata['accessToken'] = accessToken;
		userMetadata['accessTokenExtra'] = accessTokenExtra;
		// console.log(userMetadata);
		var user = new User()
		user.findOrCreate(userMetadata)
		return user
	})
	.fetchOAuthUser( function (accessToken) {
		var promise = this.Promise();
		rest = require('everyauth/node_modules/restler');
		rest.get('https://www.googleapis.com/oauth2/v1/userinfo', {
			query: { oauth_token: accessToken, alt: 'json' }
		}).on('success', function (data, res) {
			promise.fulfill(data);
		}).on('error', function (data, res) {
			promise.fail(data);
		});
		return promise;
	})
	.redirectPath('/')

var path = __dirname;
app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	var MongoStore = require('connect-mongo');
	app.use(express.session({
		secret : conf.session.secret,
		store: new MongoStore({db: conf.db.name, host: conf.db.host})
	}));
	app.use(express.static(path + '/public')); // Before router to enable dynamic routing
	app.use(everyauth.middleware());
	app.use(app.router);

	app.error(function(err, req, res) {
		console.log(err)
		res.render('500', {
			error : err,
		});
	});

	app.use(function(req, res) {
		res.render('404', {
			req: req
		});
	});

	app.set('view engine', 'jade');
	app.set('view options', { layout: false });
});

everyauth.helpExpress(app);

//everyauth.debug = true;

require ('./routes.js')(app);

app.listen(conf.http.port, conf.http.listenIp);
console.log('Server running at http://127.0.0.1:%d/', conf.http.port);
