(function() {
	'use strict';

	angular
		.module('app')
		.controller('CathegoriesController', ['$rootScope', '$scope', '$location', 'Main', '$interval', '$timeout',
			function($rootScope, $scope, $location, Main, $interval, $timeout) {
				$scope.today = new Date();
				$scope.getClass = function(path) {
					return ($location.path().substr(0, path.length) === path) ? 'active' : '';
				}
				$scope.myDetails = [];
				Main.me(function(res) {
					$scope.myDetails = res.data;
					$scope.id = $scope.myDetails.id;
					Main.cathegorie(function(res) {
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

				$scope.options = [{
					id: 1,
					name: 'Expenses'
				}, {
					id: 2,
					name: 'Income'
				}];
				$scope.changed = function() {
					console.log($scope.types.name);
				};

				$scope.processForm = function() {
					// execute something

					$scope.dataLoading = true;
					var formData = {
						type: $scope.types.id,
						name: $scope.name
					};

					Main.add_cathegorie(formData, function(res) {
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
				};
				var a = [],
					b = [],
					c = [],
					d = [];
				$timeout(function() {


					for (var i = 0; i < $scope.account.length; i++) {
						if ($scope.account[i].catname) {

							if ($scope.account[i].type == 1) {
								a.push($scope.account[i].catname);
								b.push($scope.account[i].type);

							}

							if ($scope.account[i].type == 2) {
								c.push($scope.account[i].catname);
								d.push($scope.account[i].type);
							}

						}
					}

				}, 1000);


				$scope.labels = a;
				$scope.data = b;

				$scope.labelss = c;
				$scope.datas = d;

				$scope.DelCathFunc = function(id) {
					Main.remove_cathegorie(id, function(res) {
						if (res.type == true) {
							console.log("id" + id);
							$scope.account = res.data;

						} else {
							$scope.errorMessage = "An error please ensure all inputs are correct.";

						}

					});
				}


			}
		])
})();
