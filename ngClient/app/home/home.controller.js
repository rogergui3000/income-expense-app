(function() {
	'use strict';

	angular
		.module('app')
		.controller('HomeController', ['$rootScope', '$scope', '$location', 'Main', '$interval',
			function($rootScope, $scope, $location, Main, $interval) {
				$scope.getClass = function (path) {
				  return ($location.path().substr(0, path.length) === path) ? 'active' : '';
				}
				$scope.myDetails = [];
				Main.me(function(res) {
					$scope.myDetails = res.data;
					localStorage.setItem('name', $scope.myDetails.name);
				}, function() {
					$rootScope.error = 'Failed to fetch User details';
				});
			}
		])
})();

