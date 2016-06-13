// Load required modules
var fs = require('fs'),
	http = require('http'),
	express = require('express'),
	expressValidator = require('express-validator'),
	routes = require('./routes/index'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	sanitizer = require('sanitizer'),
	helmet = require('helmet'),
	path = require('path'),
	pg = require('pg');

// Create our Express application
app = express();

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});
app.set('port', process.env.PORT || 3000);
app.set('trust proxy', 1); // trust first proxy

// use morgan to log requests to the console
app.use(morgan("dev"));

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({
	extended: false
}));

// use body parser so we can get info from POST and/or URL parameters
// parse application/json 
app.use(bodyParser.json());
app.use(expressValidator());
app.use(helmet());


// =======================
// start the server ======
// =======================
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

// API ROUTEr -------------------
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});
