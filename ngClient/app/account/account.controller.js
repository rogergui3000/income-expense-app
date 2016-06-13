/* Controller */
(function() {
	'use strict';

	angular
		.module('app')
		.controller('AccountController', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', '$interval', '$timeout',
			function($rootScope, $scope, $location, $localStorage, Main, $interval, $timeout) {
				$scope.today = new Date();
				$scope.getClass = function(path) {
					return ($location.path().substr(0, path.length) === path) ? 'active' : '';
				}
				$scope.myDetails = [], $scope.account = [];


				Main.me(function(res) {
					$scope.myDetails = res.data;
					$scope.id = $scope.myDetails.id;
					Main.account($scope.id, function(res) {
						console.log(res.data);
						if (res.type == true) {
							$scope.account = res.data;
						} else {
							//$scope.modalShown = !$scope.modalShown;
							//$scope.errorMessage = "An error as occur: getApplication.";
						}

					}, function() {
						//$scope.modalShown = !$scope.modalShown;
						//$scope.errorMessage = "An error : getApplication.";
					});
				}, function() {
					$rootScope.error = 'Failed to fetch User details';
				});


				$scope.processForm = function() {
					// execute something
					$scope.dataLoading = true;
					var formData = {
						types: $scope.Types,
						amount: $scope.Amount,
						duedate: $scope.duedate
					};

					Main.addaccount(formData, function(res) {
						if (res.type == true) {
							$scope.dataLoading = false;
							$scope.account = res.data;
							$scope.showTheForm = false;
						} else {
							$scope.errorMessage = "An error please ensure all inputs are correct.";
							$scope.dataLoading = false;
						}

					});
					//$scope.showTheForm = false;
				}


				$timeout(function() {

					var a = [],
						b = [];
					for (var i = 0; i < $scope.account.length; i++) {
						if ($scope.account[i].type) {
							a.push($scope.account[i].type);
							b.push($scope.account[i].amount);
						}
					}

					$scope.labels = a;
					$scope.data = b;

				}, 1000);




			}
		])
})();
