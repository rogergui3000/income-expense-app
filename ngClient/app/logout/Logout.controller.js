(function() {
	'use strict';

	angular
		.module('app')
		.controller('LogoutController', ['$rootScope', '$scope', '$location', '$localStorage', 'Main',
			function($rootScope, $scope, $location, $localStorage, Main) {
					Main.logout(function() {
						$location.path('/');
					}, function() {
						$rootScope.error = 'Failed to logout';
					});
			}
		])
})();