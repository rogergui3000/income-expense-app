// Load required modules
var express = require('express');

// route to authenticate a user
var router = express.Router();

// get an instance of sanitizer to sanitize input 
var sanitizer = require('sanitizer');

// get an instance of postgret connection data pooling 
var db = require("../models/database")();

// used to create, sign, and verify tokens
var jwt = require("jsonwebtoken");

// API ROUTES -------------------

// route to register a user
router.post('/register', function(req, res) {

	// Grab data from http request.Body then sanitize
	var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!req.body.name || !req.body.password || !req.body.email || !emailRegExp.test(req.body.email))
		return res.send();
	else if (req.body.name && req.body.password && req.body.email) {
		var name = req.body.name,
			password = req.body.password,
			email = req.body.email;
		name = sanitizer.escape(name);
		password = sanitizer.sanitize(password); // sanitize input
		email = sanitizer.normalizeRCData(email);

		// Chech if the  user exist
		db.CheckUser(name, email, function(user) {
			// Stream results back
			if (user.email == email) {
				res.json({ // return the information  as JSON
					type: false,
					data: "User already exists!"
				});
			} else {
				// create a sample user
				// sign with default (HMAC SHA256) from JWT
				var token = jwt.sign({
					secret: name
				}, 'shhhhh');
				db.SignUp(name, email, password, token, function(user1) {
					res.json({ // return the information  as JSON
						type: true,
						data: user1,
						token: user1.token
					});
				});
			}
		});
	}
});

// route to authenticate a user
router.post('/authenticate', function(req, res) {

	// Grab data from http request.Body then sanizatize
	var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!req.body.password || !req.body.email || !emailRegExp.test(req.body.email))
		return res.send();
	else if (req.body.password && req.body.email) {
		var password = req.body.password,
			email = req.body.email;
		password = sanitizer.sanitize(password);
		email = sanitizer.normalizeRCData(email); // sanitize input
		db.IsUser(email, password, function(user) { // find the user
			// check if password matches and email
			if (user.email == email && user.password == password) {
				res.json({ // return the information including token as JSON
					type: true,
					data: user,
					token: user.token
				});
			} else {
				res.json({ // return the information including token as JSON
					type: false,
					data: "Incorrect email/password"
				});
			}
		});
	}
});

/*
 *This function, request headers are intercepted and the authorization header is
 *extracted. If a bearer token exists in this header, that token is assigned to req.token in order
 *to be used throughout the request, and the request can be continued by using next(). If a token does not
 *exist, you will get a 403 (Forbidden) response. Let's go back to the handler /me, and use req.token
 *to fetch user data with this token.
 */

function ensureAuthorized(req, res, next) {

	var bearerToken;
	var bearerHeader = req.headers["authorization"];
	if (typeof bearerHeader !== 'undefined') {
		var bearer = bearerHeader.split(" ");
		bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.send(403);
	}
}

/* This func escape user input  rst so that malicious input, 
 * such as the alert() function, cannot be executed.
 */

function htmEntities(str) {

	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// route to authenticated  user home page
router.get('/me', ensureAuthorized, function(req, res) {
	// check header or url parameters or post parameters for token
	var token = htmEntities(req.token);
	// verifies secret and checks exp

	db.Authenticate(token, function(user) {
		if (user.token != token) {
			// if everything is bad
			res.json({ // return the information including token as JSON
				type: false,
				data: "Error occured: token auth does no exist"
			});

		} else { // if everything is good, save to request for use in other routes
			res.json({ // return the information including token as JSON
				type: true,
				data: user
			});
		}
	});
});

// route to get user account info (banking account)
router.get('/account/:id', ensureAuthorized, function(req, res) {
	// check header or url parameters or post parameters for token
	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		if (!userdetail.id) {
			return res.send();
		} else {
			var send_data = req.params.id;
			send_data = htmEntities(send_data);
			db.Account(send_data, function(data) {
				res.json({
					type: true,
					data: data
				});
			});
		}
	});
});

// route to save the user account information such as amount
router.post('/addaccount', ensureAuthorized, function(req, res) {
	// check header or url parameters or post parameters for token
	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		// Grab data from http request
		var send_data = JSON.stringify(req.body),
			data = req.body;
		for (var i in data) {
			data[i] = sanitizer.sanitize(data[i]);
		}
		delete data._id;
		db.Addaccount(data, userdetail.id, function(result) {
			res.json({ // return the information including token as JSON
				type: true,
				data: result
			});
		});
	});
});

// route to retrive income of user
router.get('/income/:id', ensureAuthorized, function(req, res) {
	// check header or url parameters or post parameters for token
	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		if (!userdetail.id) {
			return res.send();
		} else {
			var send_data = req.params.id;
			send_data = htmEntities(send_data);
			db.Income(send_data, function(data) {
				res.json({ // return the information including token as JSON
					type: true,
					data: data
				});
			});
		}
	});
});

// route to add income of the user
router.post('/addincome', ensureAuthorized, function(req, res) {
	// check header or url parameters or post parameters for token
	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		// Grab data from http request
		var send_data = JSON.stringify(req.body),
			data = req.body;
		for (var i in data) {
			data[i] = sanitizer.sanitize(data[i]);
		}
		delete data._id;
		db.Addincome(data, userdetail.id, function(result) {
			res.json({ // return the information including token as JSON
				type: true,
				data: result
			});
		});
	});
});

// route to this play cathegory
router.get('/cathegorie', ensureAuthorized, function(req, res) {
	// check header or url parameters or post parameters for token
	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		if (!userdetail.id) {
			return res.send();
		} else {
			var send_data = req.params.id;
			send_data = htmEntities(send_data);
			db.Cathegory(function(data) {
				res.json({ // return the information including token as JSON
					type: true,
					data: data
				});
			});
		}
	});
});

// route to add cathegory
router.post('/add_cath', ensureAuthorized, function(req, res) {
	// check header or url parameters or post parameters for token
	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		// Grab data from http request
		var send_data = JSON.stringify(req.body),
			data = req.body;
		for (var i in data) {
			data[i] = sanitizer.sanitize(data[i]);
		}
		delete data._id;
		db.AddCategory(data, userdetail.id, function(result) {
			res.json({ // return the information including token as JSON
				type: true,
				data: result
			});
		});
	});
});

// save the sample userDelete cathehory
router.get('/deletecath/:id', ensureAuthorized, function(req, res) {

	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		if (!userdetail.id) {
			return res.send();
		} else {
			var send_data = req.params.id;
			send_data = htmEntities(req.params.id);
			db.DeleteCath(send_data, function(data) {
				res.json({
					type: true,
					data: data
				});
			});
		}
	});
});

// route retrieve budget(income)
router.get('/budget', ensureAuthorized, function(req, res) {

	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		if (!userdetail.id) {
			return res.send();
		} else {
			db.Budget(userdetail.id, function(data) {
				res.json({
					type: true,
					data: data
				});
			});
		}
	});
});

// route retrieve budget(expenseincome)
router.get('/xbudget', ensureAuthorized, function(req, res) {

	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		if (!userdetail.id) {
			return res.send();
		} else {
			db.xBudget(userdetail.id, function(data) {
				res.json({
					type: true,
					data: data
				});
			});
		}
	});
});

// route add budget
router.post('/addbudget', ensureAuthorized, function(req, res) {});

// route retrieve expense transaction
router.get('/transaction', ensureAuthorized, function(req, res) {

	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		if (!userdetail.id) {
			return res.send();
		} else {
			db.Transaction(userdetail.id, function(data) {
				res.json({
					type: true,
					data: data
				});
			});
		}
	});
});

// route retrieve income transaction
router.get('/xtransaction', ensureAuthorized, function(req, res) {

	var token = req.token;
	db.Authenticate(token, function(userdetail) {
		if (!userdetail.id) {
			return res.send();
		} else {
			db.xTransaction(userdetail.id, function(data) {
				res.json({
					type: true,
					data: data
				});
			});
		}
	});
});


router.post('/addtransaction', ensureAuthorized, function(req, res) {});


module.exports = router;
