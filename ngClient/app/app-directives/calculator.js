/* Calculatro Directive */
(function() {
	'use strict';

	angular
		.module('app')
		.directive('calculator', function() {
			var template = '<div class="calculator"> <div class="display">{{ value }}</div>' +
				'<div class="controlss"><div class="rowc"> <button ng-click="clear()">C</button>' +
				'<button ng-click="negate()">+/-</button><button ng-click="op(' + "'/'" + ')">/</button>' +
				'<button ng-click="op(' + "'*'" + ')">*</button></div><div class="rowc">' +
				'<button ng-click="num(' + "'7'" + ')">7</button><button ng-click="num(' + "'8'" + ')">8</button>' +
				'<button ng-click="num(' + "'9'" + ')">9</button><button ng-click="op(' + "'-'" + ')">-</button>' +
				'</div><div class="rowc"><button ng-click="num(' + "'4'" + ')">4</button>' +
				'<button ng-click="num(' + "'5'" + ')">5</button><button ng-click="num(' + "'6'" + ')">6</button>' +
				'<button ng-click="op(' + "'+'" + ')">+</button></div><div class="rowc double">' +
				'<button class="tall right" ng-click="compute()">=</button>' +
				'<div><button ng-click="num(' + "'1'" + ')">1</button><button ng-click="num(' + "'2'" + ')">2</button>' +
				'<button ng-click="num(' + "'3'" + ')">3</button></div><div>' +
				'<button class="wide" ng-click="num(' + "'0'" + ')">0</button><button ng-click="num(' + "'.'" + ')">.</button>' +
				'</div></div></div></div>';
			return {
				restrict: 'EA',
				scope: true,
				template: template,
				link: function(scope, element, attr) {
					var buffer = '';
					var cmd;

					scope.value = '';

					scope.num = function(num) {
						if (cmd) {
							buffer += num;
						} else {
							scope.value += num;
						}
					};

					scope.negate = function() {
						var neg = function(val) {
							return '' + (-1 * val);
						};
						if (buffer) {
							buffer = neg(buffer);
						} else {
							scope.value = neg(scope.value);
						}
					};

					scope.op = function(op) {
						if (cmd) {
							scope.compute();
						}
						if (op === '+') cmd = function(x, y) {
							return x + y;
						} else if (op === '-') cmd = function(x, y) {
							return x - y;
						} else if (op === '/') cmd = function(x, y) {
							return x / y;
						} else if (op === '*') cmd = function(x, y) {
							return x * y;
						}
					};

					scope.clear = function() {
						scope.value = '';
						buffer = '';
					};

					scope.compute = function() {
						if (cmd) {
							scope.value = cmd(1 * scope.value, 1 * buffer);
							buffer = '';
							cmd = undefined;
						}
					};
				}
			}
		});

})();
