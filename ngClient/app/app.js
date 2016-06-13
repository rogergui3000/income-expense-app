'use strict';

angular.module('app', [
	'ngStorage',
	'ngRoute',
	'angular-loading-bar',
	'chart.js',
	'ui.bootstrap'
])
	.config(['$routeProvider', '$httpProvider',
		function($routeProvider, $httpProvider) {

			$routeProvider
				.when('/login', {
					controller: 'LoginController',
					templateUrl: 'login/login.view.html'
				})
				.when('/register', {
					controller: 'RegisterController',
					templateUrl: 'register/register.view.html'
				})
				.when('/account', {
					controller: 'AccountController',
					templateUrl: 'account/account.view.html'
				})
				.when('/home', {
					controller: 'HomeController',
					templateUrl: 'home/home.view.html'
				})
				.when('/logout', {
					controller: 'LogoutController',
					templateUrl: 'logout/logout.view.html'
				})
				.when('/Income', {
					controller: 'IncomeController',
					templateUrl: 'income/income.view.html'
				})
				.when('/Budget', {
					controller: 'BudgetController',
					templateUrl: 'budget/budget.view.html'
				})
				.when('/Transaction', {
					controller: 'TransactionController',
					templateUrl: 'transaction/transaction.view.html'
				})
				.when('/Cathegories', {
					controller: 'CathegoriesController',
					templateUrl: 'cathegories/cathegories.view.html'
				})
				.otherwise({
					redirectTo: '/login'
				});

			$httpProvider.interceptors.push(['$q', '$location', '$localStorage',
				function($q, $location, $localStorage) {
					return {
						'request': function(config) {
							config.headers = config.headers || {};
							if ($localStorage.token) {
								config.headers.Authorization = 'Bearer ' + $localStorage.token;
							}
							return config;
						},
						'responseError': function(response) {
							if (response.status === 401 || response.status === 403) {
								$location.path('/login');
							}
							return $q.reject(response);
						}
					};
				}
			]);

		}
	]);
