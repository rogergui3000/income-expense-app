// Required Modules
var express = require("express");
var morgan = require("morgan");
var app = express();
var favicon = require('serve-favicon');

var port = process.env.PORT || 8081;

app.use(morgan("dev"));
app.use(express.static("./app"));

app.get("/", function(req, res) {
	res.sendFile("./app/index.html");
});

app.post('/', function(req, res, next) {
	// Handle the post for this route
});

// Start Server
app.listen(port, function() {
	console.log("Express server listening on port " + port);
});
