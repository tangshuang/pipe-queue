'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require('stream');

var _pipeConcat = require('pipe-concat');

var _pipeConcat2 = _interopRequireDefault(_pipeConcat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var queue = [];
var finish;
var done;

var PipeQueue = function () {
	function PipeQueue() {
		_classCallCheck(this, PipeQueue);
	}

	_createClass(PipeQueue, [{
		key: 'when',
		value: function when(argument) {
			var _this = this;

			for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				streams[_key - 1] = arguments[_key];
			}

			// if the first argument is function
			if (typeof argument === 'function') {
				var factory = argument;
				factory(this.next.bind(this), _pipeConcat2.default);
				return this;
			}

			// if the arguments are all streams
			var streams = [argument].concat(_toConsumableArray(streams));
			(0, _pipeConcat2.default)(streams).on('end', function () {
				_this.next();
			});

			return this;
		}
	}, {
		key: 'then',
		value: function then(factory) {
			if (typeof factory === 'function') {
				queue.push(factory);
			}

			return this;
		}
	}, {
		key: 'end',
		value: function end(factory) {
			finish = factory;

			return this;
		}
	}, {
		key: 'next',
		value: function next() {
			if (queue.length > 0) {
				var factory = queue.shift();
				if (typeof factory === 'function') {
					factory(this.next.bind(this), _pipeConcat2.default);
				}
			} else {
				if (typeof finish === 'function') {
					finish();
				}
				if (typeof done === 'function') {
					done();
				}
			}
			return this;
		}
	}, {
		key: 'promise',
		value: function promise() {
			return new Promise(function (resolve, reject) {
				done = resolve;
			});
		}
	}]);

	return PipeQueue;
}();

exports.default = PipeQueue;


module.exports = PipeQueue;