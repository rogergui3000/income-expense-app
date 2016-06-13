(function() {
	'use strict';

	angular
		.module('app')
		.controller('BudgetController', ['$rootScope', '$scope', '$location', 'Main', '$interval',
			function($rootScope, $scope, $location, Main, $interval) {
				$scope.today = new Date();
				$scope.getClass = function (path) {
				  return ($location.path().substr(0, path.length) === path) ? 'active' : '';
				}
				
				$scope.Details = [], $scope.account =[];
			
					Main.budget(function(res) {
						
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
					
					
					Main.xbudget(function(res) {
						
						if (res.type == true) {
							$scope.Details = res.data;
						} else {
							//$scope.modalShown = !$scope.modalShown;
							//$scope.errorMessage = "An error as occur: getApplication.";
						}

					}, function() {
						//$scope.modalShown = !$scope.modalShown;
						//$scope.errorMessage = "An error : getApplication.";
					});
					
				    
					$scope.submitForm = function(index) {
					    console.log($scope.amount);
					  };
					  
  					$scope.submitForm2 = function(index) {
  					    console.log($scope);
  					 }

			}
		])
})();
