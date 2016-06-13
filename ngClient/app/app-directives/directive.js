(function() {
	'use strict';

	angular
		.module('app')
		.directive('modalDialog', function() {
			return {
				restrict: 'E',
				scope: {
					show: '='
				},
				replace: false, // Replace with the template below
				transclude: true, // we want to insert custom content inside the directive
				link: function(scope, element, attrs) {
					scope.dialogStyle = {};
					if (attrs.width)
						scope.dialogStyle.width = attrs.width;
					if (attrs.height)
						scope.dialogStyle.height = attrs.height;
					scope.hideModal = function() {
						scope.show = false;
					};
				},
				template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
			};
		})
		.directive('navigation', function() {
		  return {
		    templateUrl: '/home/nav.view.html'
		  };
		})
		
		.directive("myCurrentTime", function(dateFilter){
		    return function(scope, element, attrs){
		        var format = 'MMM d, yyyy h:mm:ss a';
  
		        updateTime();
		        
        
		        function updateTime(){
		            var dt = dateFilter(new Date(), format);
		            element.text(dt);
		        }
        
		        function updateLater() {
		            setTimeout(function() {
		              updateTime(); // update DOM
		              updateLater(); // schedule another update
		            }, 1000);
		        }
        
		        updateLater();
		    }
		})
		
})();
