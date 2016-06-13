(function() {
	'use strict';

	angular
		.module('app')
		.controller('LoginController', ['$rootScope', '$scope', '$location', '$localStorage', 'Main',
			function($rootScope, $scope, $location, $localStorage, Main) {
				$scope.signin = function() {
					$scope.dataLoading = true;
					var formData = {
						email: $scope.email,
						password: $scope.password
					}

					Main.signin(formData, function(res) {
						if (res.data.token) {
							$localStorage.token = res.data.token;
							$location.path('/account');

						} else {
							$scope.error = res.data;
							$scope.dataLoading = false;
						}
					}, function() {
						$rootScope.error = 'Failed to signin';
						$scope.dataLoading = false;
					})
				};
			}
		])
})();
