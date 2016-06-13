'use strict';
/* Service */
angular.module('app')
	.factory('Main', ['$http', '$localStorage',
		function($http, $localStorage) {
			var baseUrl = "http://localhost:3000";

			function changeUser(user) {
				angular.extend(currentUser, user);
			}

			function urlBase64Decode(str) {
				var output = str.replace('-', '+').replace('_', '/');
				switch (output.length % 4) {
					case 0:
						break;
					case 2:
						output += '==';
						break;
					case 3:
						output += '=';
						break;
					default:
						throw 'Illegal base64url string!';
				}
				return window.atob(output);
			}

			function getUserFromToken() {
				var token = $localStorage.token;
				var user = {};
				if (typeof token !== 'undefined') {
					var encoded = token.split('.')[1];
					user = JSON.parse(urlBase64Decode(encoded));
				}
				return user;
			}

			var currentUser = getUserFromToken();

			return {
				save: function(data, success, error) {
					$http.post(baseUrl + '/register', data).success(success).error(error);
				},
				signin: function(data, success, error) {
					$http.post(baseUrl + '/authenticate', data).success(success).error(error)
				},
				me: function(success, error) {
					$http.get(baseUrl + '/me/').success(success).error(error)
				},
				logout: function(success) {
					changeUser({});
					delete $localStorage.token;
					success();
				},
				account: function(id, success, error) {
					$http.get(baseUrl + '/account/' + id).success(success).error(error)
				},
				addaccount: function(data, success, error) {
					$http.post(baseUrl + '/addaccount/', data).success(success).error(error)
				},
				income: function(id, success, error) {
					$http.get(baseUrl + '/income/'+ id).success(success).error(error);
				},
				addincome: function(data, success, error) {
					$http.post(baseUrl + '/addincome', data).success(success).error(error);
				},
				cathegorie: function(success, error) {
					$http.get(baseUrl + '/cathegorie/').success(success).error(error)
				},
				add_cathegorie: function(data, success, error) {
					$http.post(baseUrl + '/add_cath/', data).success(success).error(error)
				},
				remove_cathegorie: function(id, success, error) {
					$http.get(baseUrl + '/deletecath/'+id).success(success).error(error)
				},
				cathegories: function(id, success, error) {
					$http.get(baseUrl + '/cathegories/' + id).success(success).error(error);
				},
				budget: function( success, error) {
					$http.get(baseUrl + '/budget/' ).success(success).error(error);
				},
				xbudget: function( success, error) {
					$http.get(baseUrl + '/xbudget/' ).success(success).error(error);
				},
				
				add_budget: function(data, success, error) {
					$http.post(baseUrl + '/addbudget/', data).success(success).error(error);
				},
				transaction: function(success, error) {
					$http.get(baseUrl + '/transaction/').success(success).error(error);
				},
				xtransaction: function(success, error) {
					$http.get(baseUrl + '/xtransaction/').success(success).error(error);
				},
				add_transaction: function(data, success, error) {
					$http.post(baseUrl + '/addtransaction/', data).success(success).error(error);
				}
			};
		}
	]);

