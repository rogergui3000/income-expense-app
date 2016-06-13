(function() {
	'use strict';

	angular
		.module('app')
		.controller('TransactionController', ['$rootScope', '$scope', '$location', 'Main', '$interval',
			function($rootScope, $scope, $location, Main, $interval) {
				$scope.today = new Date();
				$scope.getClass = function(path) {
					return ($location.path().substr(0, path.length) === path) ? 'active' : '';
				}

				$scope.myDetails = [], $scope.account = [];
				$scope.processForm = function() {
					// execute something
					$scope.showTheForm = false;
					$scope.modalShown = !$scope.modalShown;
					$scope.errorMessage = "to be continue. ";
					$scope.successMessage =false;
				}

				$scope.myDetails = [];
				Main.me(function(res) {
					$scope.myDetails = res.data;

					Main.transaction(function(res) {

						if (res.type == true) {
							$scope.account = res.data;
						} else {}

					}, function() {});


					Main.xtransaction(data, function(res) {

						if (res.type == true) {
							$scope.accounts = res.data;
						} else {}

					}, function() {});

				}, function() {
					$rootScope.error = 'Failed to fetch User details';
				});
			}
		])
})();
