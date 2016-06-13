(function() {
	'use strict';

	angular
		.module('app')
		.controller('RegisterController', ['$rootScope', '$scope', '$location', '$localStorage', 'Main',
			function($rootScope, $scope, $location, $localStorage, Main) {
				$scope.signup = function() {
					$scope.dataLoading = true;
					// check to make sure the form is completely valid
					if ($scope.loginForm.$valid) {
						var formData = {
							name: $scope.name,
							email: $scope.email,
							password: $scope.password
						}
						Main.save(formData, function(res) {
							if (res.data.token) {
								$localStorage.token = res.data.token;
								$location.path('/account');

							} else {
								$scope.error = res.data;
								$scope.dataLoading = false;
							}

						}, function() {
							$scope.error = 'Failed to signup';
							$scope.dataLoading = false;
						})
					}
				};
			}
		])
})();
