/* connection */
var pg = require('pg');
var path = require('path');
var connectionString = require(path.join(__dirname, '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();

function insertInto(data_types, data_amount, data_duedate, id) {
	var sq = " SELECT COUNT(catName) FROM cathegory WHERE catName = " + "'" + data_types + "'" + "   ";
	var quer = client.query(sq);
	var array = [];
	// Stream results back one row at a time
	quer.on('row', function(row) {

		if (array[0] >= 1) {

			var sql2 = " SELECT * FROM cathegory WHERE catName = " + "'" + data_types + "'" + " ";
			var query2 = client.query(sql2);

			query2.on('row', function(row) {
				client.query("INSERT INTO income( name , amount, day_due, userid, payment, catId) values( " + "'" + data_types + "'" + ", " + data_amount + ", " + "'" + data_duedate + "'" + ", " + id + ", 1, " + row.id + ") LIMIT 1");

			});

		} else {
			client.query("INSERT INTO cathegory( catName , type) values( " + "'" + data_types + "'" + " , 2) LIMIT 1");

			var sql3 = " SELECT * FROM cathegory WHERE catName = " + "'" + data_types + "'" + " ";
			var query3 = client.query(sql3);

			query3.on('row', function(row) {
				client.query("INSERT INTO income( name , amount, day_due, userid, payment, catId) values( " + "'" + data_types + "'" + ", " + data_amount + ", " + "'" + data_duedate + "'" + ", " + id + ", 1, " + row.id + ") LIMIT 1");
			});

		}

	});
	quer.on('end', function(row) {
		console.log("query end");
	});
}

function insertIntoCath(data_type, data_name, id) {
	var sq = " SELECT COUNT(catName) FROM cathegory WHERE catName = " + "'" + data_name + "'" + "   ";
	var quer = client.query(sq);
	var array = [];
	// Stream results back one row at a time
	quer.on('row', function(row) {

		if (array[0] >= 1) {


		} else {
			client.query("INSERT INTO cathegory( catName , type) values( " + "'" + data_name + "'" + " ,  " + data_type + ") LIMIT 1");
			if (data_type == 1) {

				var sql2 = " SELECT * FROM cathegory WHERE catName = " + "'" + data_name + "'" + " ";
				var query2 = client.query(sql2);

				query2.on('row', function(row) {

					client.query("INSERT INTO expense( catId, userid) values(   " + row.id + ", " + id + ") LIMIT 1");
				});



			} else {

				var sql2 = " SELECT * FROM cathegory WHERE catName = " + "'" + data_name + "'" + " ";
				var query2 = client.query(sql2);

				query2.on('row', function(row) {

					client.query("INSERT INTO income( catId, userid) values(   " + row.id + ", " + id + ") LIMIT 1");
				});
			}


		}

	});
	quer.on('end', function(row) {
		console.log("query end");
	});
}


module.exports = function() {
	return {
		SignUp: function(name, email, password, token, callback) {
			var results = {};
			// SQL Query > Select Data
			client.query("INSERT INTO users(name, email, password, token) values($1, $2, $3, $4) LIMIT 1", [name, email, password, token]);

			// Stream results back one row at a time
			// SQL Query > Select Data
			var query = client.query("SELECT * FROM users WHERE email =($1) ", [email]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				results = row;
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				return callback(results);
			});
		},
		CheckUser: function(name, email, callback) {

			var results = {};
			// Get a Postgres client from the connection pool
			pg.connect(connectionString, function(err, client, done) {
				// Handle connection errors
				if (err) {
					done();
					return callback(json({
						success: false,
						data: err
					}));
				}

				// SQL Query > Select Data
				var query = client.query("SELECT * FROM users WHERE name=($1) OR email=($2) ", [name, email]);

				// Stream results back one row at a time
				query.on('row', function(row) {
					results = row;
				});

				// After all data is returned, close connection and return results
				query.on('end', function() {
					done();
					return callback(results);
				});
			});
		},
		Authenticate: function(token, callback) {

			var results = {};
			// Get a Postgres client from the connection pool
			pg.connect(connectionString, function(err, client, done) {
				// Handle connection errors
				if (err) {
					done();
					return callback(json({
						success: false,
						data: err
					}));
				}

				// SQL Query > Select Data
				var query = client.query("SELECT * FROM users WHERE token=($1) ", [token]);

				// Stream results back one row 
				query.on('row', function(row) {
					results = row;
				});

				// After all data is returned, close connection and return results
				query.on('end', function() {
					done();
					return callback(results);
				});
			});
		},
		IsUser: function(email, password, callback) {

			var results = {};
			// Get a Postgres client from the connection pool
			pg.connect(connectionString, function(err, client, done) {
				// Handle connection errors
				if (err) {
					done();
					return callback(json({
						success: false,
						data: err
					}));
				}

				// SQL Query > Select Data
				var query = client.query("SELECT * FROM users WHERE email=($1) AND password=($2) ", [email, password]);

				// Stream results back one row at a time
				query.on('row', function(row) {
					results = row;
				});

				// After all data is returned, close connection and return results
				query.on('end', function() {
					done();
					return callback(results);
				});
			});
		},
		Account: function(id, callback) {

			var results = {};
			// SQL Query > Select Data
			var sql = 'SELECT json_agg(t) FROM ( SELECT * FROM account WHERE userid = $1 )t ';
			var query = client.query(sql, [id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				results = row.json_agg;
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				return callback(results);
			});
		},
		Addaccount: function(data, id, callback) {

			var results = {};
			client.query("INSERT INTO account( type , amount, day_due, userid) values( " + "'" + data.types + "'" + ", " + data.amount + ", " + "'" + data.duedate + "'" + ", " + id + ") LIMIT 1");

			// SQL Query > Select Data
			var sql = 'SELECT json_agg(t) FROM ( SELECT * FROM account WHERE userid = $1 )t ';
			var query = client.query(sql, [id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				results = row.json_agg;
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				return callback(results);
			});
		},
		Income: function(id, callback) {

			var results = {};
			// SQL Query > Select Data
			var sql = 'SELECT json_agg(t) FROM ( SELECT * FROM income WHERE userid = $1 )t ';
			var query = client.query(sql, [id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				results = row.json_agg;
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				return callback(results);
			});
		},
		Addincome: function(data, id, callback) {

			insertInto(data.types, data.amount, data.duedate, id);

			setTimeout(function() {
				console.log('timeout completed');
				var results = {};
				// SQL Query > Select Data
				var sql = 'SELECT json_agg(t) FROM ( SELECT * FROM income WHERE userid = $1 )t ';
				var query = client.query(sql, [id]);

				// Stream results back one row at a time
				query.on('row', function(row) {
					results = row.json_agg;
				});

				// After all data is returned, close connection and return results
				query.on('end', function() {
					return callback(results);
				});
			}, 1000);


		},
		Cathegory: function(callback) {

			var results = {};
			// SQL Query > Select Data
			var sql = 'SELECT json_agg(t) FROM ( SELECT * FROM cathegory  )t ';
			var query = client.query(sql);

			// Stream results back one row at a time
			query.on('row', function(row) {
				results = row.json_agg;
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				return callback(results);
			});
		},
		AddCategory: function(data, id, callback) {
			insertIntoCath(data.type, data.name, id);

			setTimeout(function() {
				var results = {};
				// SQL Query > Select Data
				var sql = 'SELECT json_agg(t) FROM ( SELECT * FROM cathegory  )t ';
				var query = client.query(sql);

				// Stream results back one row at a time
				query.on('row', function(row) {
					results = row.json_agg;
				});

				// After all data is returned, close connection and return results
				query.on('end', function() {
					return callback(results);
				});
			}, 1000);
		},
		DeleteCath: function(id, callback) {

			client.query("UPDATE cathegory SET type=3 WHERE id= " + id + " ");

			var results = {};
			// SQL Query > Select Data
			var sql = 'SELECT json_agg(t) FROM ( SELECT * FROM cathegory  )t ';
			var query = client.query(sql);

			// Stream results back one row at a time
			query.on('row', function(row) {
				results = row.json_agg;
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				return callback(results);
			});



		},
		Budget: function(id, callback) {

			var results = {};
			// SQL Query > Select Data
			var sql = 'SELECT json_agg(t) FROM ( SELECT SUM(income.amount) as total_expense, cathegory.catName  , cathegory.amount,cathegory.id  FROM income  RIGHT  JOIN  cathegory ON (income.catId = cathegory.id) WHERE  income.userid=$1 GROUP BY  cathegory.catName, cathegory.amount, cathegory.id   )t ';
			var query = client.query(sql, [id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				console.log(row.json_agg);
				results = row.json_agg;
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				return callback(results);
			});


		},

		xBudget: function(id, callback) {

			var results = {};
			// SQL Query > Select Data
			var sql = 'SELECT json_agg(t) FROM ( SELECT SUM(expense.amount) as total_expense, cathegory.catName  , cathegory.amount,cathegory.id  FROM expense  RIGHT  JOIN  cathegory ON (expense.catId = cathegory.id) WHERE expense.userid=$1 GROUP BY  cathegory.catName, cathegory.amount, cathegory.id   )t ';
			var query = client.query(sql, [id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				console.log(row.json_agg);
				results = row.json_agg;
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				return callback(results);
			});


		},
		xTransaction: function(id, callback) {

			var results = {};
			// SQL Query > Select Data
			var sql = 'SELECT json_agg(t) FROM ( SELECT SUM(expense.amount) as total_expense, cathegory.catName  , cathegory.amount,cathegory.id, expense.day_due  FROM expense  INNER  JOIN  cathegory ON (expense.catId = cathegory.id) WHERE expense.userid=$1 AND expense.amount > 0 GROUP BY  cathegory.catName, cathegory.amount, cathegory.id, expense.day_due   )t ';
			var query = client.query(sql, [id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				console.log(row.json_agg);
				results = row.json_agg;
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				return callback(results);
			});
		},
		
		Transaction: function(id, callback) {

			var results = {};
			// SQL Query > Select Data
			var sql = 'SELECT json_agg(t) FROM ( SELECT SUM(income.amount) as total_expense, cathegory.catName  , cathegory.amount,cathegory.id , income.day_due FROM income  INNER  JOIN  cathegory ON (income.catId = cathegory.id) WHERE income.userid=$1 AND income.amount > 0 GROUP BY  cathegory.catName, cathegory.amount, cathegory.id,income.day_due   )t ';
			var query = client.query(sql, [id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				console.log(row.json_agg);
				results = row.json_agg;
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				return callback(results);
			});
		},
		
		AddTransaction: function(id, callback) {

		}
	}

}
