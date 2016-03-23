(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["logger"] = factory();
	else
		root["logger"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.LoggerStream = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _chalk = __webpack_require__(2);
	
	var _chalk2 = _interopRequireDefault(_chalk);
	
	var _ansiToBrowser = __webpack_require__(14);
	
	var _ansiToBrowser2 = _interopRequireDefault(_ansiToBrowser);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	_chalk2.default.enabled = true;
	
	var inBrowser = !(process && process.stdout);
	var colorFunctions = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'gray'].map(function (c) {
	  return _chalk2.default[c];
	});
	
	var LightStream = function () {
	  function LightStream(fn) {
	    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    var _ref$applied = _ref.applied;
	    var applied = _ref$applied === undefined ? false : _ref$applied;
	    var _ref$output = _ref.output;
	    var output = _ref$output === undefined ? 'ansi' : _ref$output;
	
	    _classCallCheck(this, LightStream);
	
	    this.applied = applied;
	    this.output = output;
	    if (applied) {
	      this.fn = function (args) {
	        return fn.apply(undefined, _toConsumableArray(args));
	      };
	      this.buff = [];
	    } else {
	      this.fn = fn;
	      this.buff = '';
	    }
	  }
	
	  _createClass(LightStream, [{
	    key: 'write',
	    value: function write(msg) {
	      var payload = this.output === 'browser' ? (0, _ansiToBrowser2.default)(msg) : msg;
	      if (this.applied) {
	        this.buff.push(payload);
	      } else {
	        this.buff += payload;
	      }
	
	      this.flush();
	    }
	  }, {
	    key: 'flush',
	    value: function flush() {
	      var _this = this;
	
	      if (this.applied) {
	        return this.buff.forEach(this.fn);
	      }
	      var split = this.buff.split('\n');
	      this.buff = split.pop();
	      split.forEach(function (s) {
	        return _this.fn(s || '');
	      });
	    }
	  }]);
	
	  return LightStream;
	}();
	
	var stdout = void 0;
	var stderr = void 0;
	
	if (!inBrowser) {
	  stdout = process.stdout;
	  stderr = process.stderr;
	} else {
	  stdout = new LightStream(console.log.bind(console), { applied: true, output: 'browser' });
	  stderr = new LightStream(console.error.bind(console), { applied: true, output: 'browser' });
	}
	
	var templateRegex = /(\%(.)(((\.[\w]*))*))/g;
	
	function timeStamp() {
	  var d = new Date();
	  // convert number to two digit string
	  var two = function two(num) {
	    return ('0' + num).slice(-2);
	  };
	  return two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds());
	}
	
	var LoggerStream = exports.LoggerStream = function () {
	  function LoggerStream(stream) {
	    var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    var type = _ref2.type;
	    var template = _ref2.template;
	    var namespace = _ref2.namespace;
	
	    _classCallCheck(this, LoggerStream);
	
	    this.stream = stream;
	    this.type = type;
	    this.template = template;
	    this.namespace = namespace;
	  }
	
	  _createClass(LoggerStream, [{
	    key: 'write',
	    value: function write(line) {
	      var templatedLine = LoggerStream.templateLine(this.template, { line: line });
	      var formattedNamespace = '';
	      if (this.namespace) {
	        var colorIndex = hashCode(this.namespace) % colorFunctions.length;
	        var colorFunction = colorFunctions[colorIndex] || function (id) {
	          return id;
	        };
	        formattedNamespace = '[' + colorFunction(this.namespace) + '] ';
	      }
	      var namespacedLine = '' + formattedNamespace + templatedLine;
	      this.stream.write(namespacedLine + '\n');
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      if (this._template) {
	        return this._template;
	      } else if (inBrowser && LoggerStream.BrowserTemplates[this.type]) {
	        return LoggerStream.BrowserTemplates[this.type];
	      } else if (!inBrowser && LoggerStream.CLITemplates[this.type]) {
	        return LoggerStream.CLITemplates[this.type];
	      } else if (LoggerStream.Templates[this.type]) {
	        return LoggerStream.Templates[this.type];
	      } else {
	        return LoggerStream.DefaultTemplate;
	      }
	    },
	    set: function set(template) {
	      this._template = template;
	    }
	  }], [{
	    key: 'templateLine',
	    value: function templateLine(template, data) {
	      var matches = [];
	      for (var match = templateRegex.exec(template); match; match = templateRegex.exec(template)) {
	        matches.push(match);
	      }
	
	      return matches.reduce(function (logString, match) {
	        return logString.replace(match[0], LoggerStream.convertSpecification(match, data));
	      }, template);
	    }
	  }, {
	    key: 'convertSpecification',
	    value: function convertSpecification(specification, _ref3) {
	      var line = _ref3.line;
	
	      var character = specification[2];
	      var text = character === 't' ? timeStamp() : character === 'm' ? line : specification[0];
	
	      var modifyString = specification[3];
	      var id = function id(s) {
	        return s;
	      };
	      var modify = modifyString.split('.').reduce(function (modify, modifierString) {
	        if (_chalk2.default[modifierString]) {
	          // compose new modifier onto old
	          return function (s) {
	            return _chalk2.default[modifierString](modify(s));
	          };
	        }
	
	        // throw out unknown modifiers
	        return modify;
	      }, id);
	
	      return modify(text);
	    }
	  }]);
	
	  return LoggerStream;
	}();
	
	LoggerStream.Type = {};
	['ERROR', 'LOG'].forEach(function (type) {
	  LoggerStream.Type[type] = type;
	});
	
	LoggerStream.DefaultTemplate = '[%t.dim.grey] %m';
	LoggerStream.Templates = {};
	LoggerStream.CLITemplates = {};
	LoggerStream.BrowserTemplates = {};
	
	LoggerStream.CLITemplates[LoggerStream.Type.ERROR] = '[%t.dim.grey] ' + _chalk2.default.red('(✗)') + ' %m.red';
	
	var Logger = function () {
	  function Logger() {
	    var _ref4 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref4$name = _ref4.name;
	    var name = _ref4$name === undefined ? '' : _ref4$name;
	    var _ref4$stream = _ref4.stream;
	    var stream = _ref4$stream === undefined ? stdout : _ref4$stream;
	    var _ref4$errorStream = _ref4.errorStream;
	    var errorStream = _ref4$errorStream === undefined ? stderr : _ref4$errorStream;
	    var template = _ref4.template;
	    var errorTemplate = _ref4.errorTemplate;
	    var namespace = _ref4.namespace;
	
	    _classCallCheck(this, Logger);
	
	    this.log = this.log.bind(this);
	    this.error = this.error.bind(this);
	    this.tap = this.tap.bind(this);
	    this.tapError = this.tapError.bind(this);
	    this.namespace = namespace;
	    this.errorTemplate = errorTemplate;
	
	    this.template = template;
	    this.addStream(stream, { template: template });
	    this.addErrorStream(errorStream, { template: errorTemplate || template });
	    this.history = {
	      errors: [],
	      log: []
	    };
	
	    this.accumulators = {};
	    this._resetAccumulators();
	    this.paused = false;
	  }
	
	  _createClass(Logger, [{
	    key: 'addStream',
	    value: function addStream(stream) {
	      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	      var template = options.type === LoggerStream.Type.ERROR ? this.errorTemplate || this.template : this.template;
	      var loggerStream = new LoggerStream(stream, Object.assign({
	        type: LoggerStream.Type.LOG,
	        namespace: this.namespace,
	        template: template
	      }, options));
	
	      switch (options.type) {
	        case LoggerStream.Type.ERROR:
	          this.errorStreams.push(loggerStream);
	          break;
	        case LoggerStream.Type.LOG:
	        default:
	          this.streams.push(loggerStream);
	          break;
	      }
	    }
	  }, {
	    key: 'removeAllStreams',
	    value: function removeAllStreams() {
	      this._streams = [];
	      this._errorStreams = [];
	    }
	  }, {
	    key: 'addErrorStream',
	    value: function addErrorStream(stream, options) {
	      this.addStream(stream, Object.assign({ type: LoggerStream.Type.ERROR }, options));
	    }
	  }, {
	    key: 'log',
	    value: function log(str) {
	      this.history.log.push(str);
	      if (this.silenced) {
	        return;
	      }
	
	      if (this.paused) {
	        return this.accumulators.logs.push(str);
	      }
	
	      this.streams.forEach(function (s) {
	        return s.write(str);
	      });
	    }
	  }, {
	    key: 'error',
	    value: function error(str) {
	      this.history.errors.push(str);
	      if (this.silenced) {
	        return;
	      }
	
	      if (this.paused) {
	        return this.accumulators.errors.push(str);
	      }
	
	      this.errorStreams.forEach(function (s) {
	        return s.write(str);
	      });
	    }
	  }, {
	    key: 'silence',
	    value: function silence() {
	      this.silenced = true;
	    }
	  }, {
	    key: 'unsilence',
	    value: function unsilence() {
	      this.silenced = false;
	    }
	  }, {
	    key: 'pause',
	    value: function pause() {
	      this._paused = true;
	      this._resetAccumulators();
	    }
	  }, {
	    key: 'resume',
	    value: function resume() {
	      this._paused = false;
	      this.accumulators.logs.forEach(this.log);
	      this.accumulators.errors.forEach(this.error);
	    }
	  }, {
	    key: 'dump',
	    value: function dump() {
	      this._resetAccumulators();
	      this.resume();
	    }
	  }, {
	    key: 'tap',
	    value: function tap() {
	      var _this2 = this;
	
	      var message = arguments.length <= 0 || arguments[0] === undefined ? '%0' : arguments[0];
	
	      return function (val) {
	        var finalMessage = message.includes('%0') ? message.replace('%0', val) : message + ': ' + val;
	        _this2.log(finalMessage);
	        return Promise.resolve(val);
	      };
	    }
	  }, {
	    key: 'tapError',
	    value: function tapError() {
	      var _this3 = this;
	
	      var message = arguments.length <= 0 || arguments[0] === undefined ? '%0' : arguments[0];
	
	      return function (val) {
	        var finalMessage = message.includes('%0') ? message.replace('%0', val) : message + ': ' + val;
	        _this3.error(finalMessage);
	        return Promise.reject(val);
	      };
	    }
	  }, {
	    key: '_resetAccumulators',
	    value: function _resetAccumulators() {
	      this.accumulators.logs = [];
	      this.accumulators.errors = [];
	    }
	  }, {
	    key: 'streams',
	    get: function get() {
	      return this._streams = this._streams || [];
	    }
	  }, {
	    key: 'errorStreams',
	    get: function get() {
	      return this._errorStreams = this._errorStreams || [];
	    }
	  }, {
	    key: 'namespace',
	    set: function set(newNamespace) {
	      this._namespace = newNamespace;
	      var changeNamespace = function changeNamespace(s) {
	        return s.namespace = newNamespace;
	      };
	      this.streams.forEach(changeNamespace);
	      this.errorStreams.forEach(changeNamespace);
	    },
	    get: function get() {
	      return this._namespace;
	    }
	  }, {
	    key: 'template',
	    set: function set(newTemplate) {
	      this._template = newTemplate;
	      var changeTemplate = function changeTemplate(s) {
	        return s.template = newTemplate;
	      };
	      this.streams.forEach(changeTemplate);
	      if (!this.errorTemplate) {
	        this.errorStreams.forEach(changeTemplate);
	      }
	    },
	    get: function get() {
	      return this._template;
	    }
	  }, {
	    key: 'errorTemplate',
	    set: function set(newTemplate) {
	      this._errorTemplate = newTemplate;
	      this.errorStreams.forEach(function (s) {
	        return s.template = newTemplate;
	      });
	    },
	    get: function get() {
	      return this._errorTemplate;
	    }
	  }, {
	    key: 'paused',
	    get: function get() {
	      return this._paused;
	    },
	    set: function set(newPaused) {
	      if (newPaused) {
	        this.pause();
	      } else {
	        this.resume();
	      }
	      return this.paused;
	    }
	  }], [{
	    key: 'instance',
	    value: function instance(namespace) {
	      var create = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	
	      if (!this._instances) {
	        this._instances = {};
	      }
	
	      if (!this._instances[namespace] && create) {
	        this._instances[namespace] = new Logger({ namespace: namespace });
	      }
	
	      return this._instances[namespace];
	    }
	  }, {
	    key: 'setInstance',
	    value: function setInstance(namespace, logger) {
	      this._instances[namespace] = logger;
	    }
	  }]);
	
	  return Logger;
	}();
	
	exports.default = Logger;
	
	
	function hashCode(s) {
	  if (s.length === 0) {
	    return hash;
	  }
	  var hash = 0;
	  for (var i = 0; i < s.length; ++i) {
	    var chr = s.charCodeAt(i);
	    hash = (hash << 5) - hash + chr | 0;
	  }
	  return hash;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var escapeStringRegexp = __webpack_require__(3);
	var ansiStyles = __webpack_require__(4);
	var stripAnsi = __webpack_require__(10);
	var hasAnsi = __webpack_require__(12);
	var supportsColor = __webpack_require__(13);
	var defineProps = Object.defineProperties;
	var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);
	
	function Chalk(options) {
		// detect mode if not set manually
		this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
	}
	
	// use bright blue on Windows as the normal blue color is illegible
	if (isSimpleWindowsTerm) {
		ansiStyles.blue.open = '\u001b[94m';
	}
	
	var styles = (function () {
		var ret = {};
	
		Object.keys(ansiStyles).forEach(function (key) {
			ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
	
			ret[key] = {
				get: function () {
					return build.call(this, this._styles.concat(key));
				}
			};
		});
	
		return ret;
	})();
	
	var proto = defineProps(function chalk() {}, styles);
	
	function build(_styles) {
		var builder = function () {
			return applyStyle.apply(builder, arguments);
		};
	
		builder._styles = _styles;
		builder.enabled = this.enabled;
		// __proto__ is used because we must return a function, but there is
		// no way to create a function with a different prototype.
		/* eslint-disable no-proto */
		builder.__proto__ = proto;
	
		return builder;
	}
	
	function applyStyle() {
		// support varags, but simply cast to string in case there's only one arg
		var args = arguments;
		var argsLen = args.length;
		var str = argsLen !== 0 && String(arguments[0]);
	
		if (argsLen > 1) {
			// don't slice `arguments`, it prevents v8 optimizations
			for (var a = 1; a < argsLen; a++) {
				str += ' ' + args[a];
			}
		}
	
		if (!this.enabled || !str) {
			return str;
		}
	
		var nestedStyles = this._styles;
		var i = nestedStyles.length;
	
		// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
		// see https://github.com/chalk/chalk/issues/58
		// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
		var originalDim = ansiStyles.dim.open;
		if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
			ansiStyles.dim.open = '';
		}
	
		while (i--) {
			var code = ansiStyles[nestedStyles[i]];
	
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			str = code.open + str.replace(code.closeRe, code.open) + code.close;
		}
	
		// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
		ansiStyles.dim.open = originalDim;
	
		return str;
	}
	
	function init() {
		var ret = {};
	
		Object.keys(styles).forEach(function (name) {
			ret[name] = {
				get: function () {
					return build.call(this, [name]);
				}
			};
		});
	
		return ret;
	}
	
	defineProps(Chalk.prototype, init());
	
	module.exports = new Chalk();
	module.exports.styles = ansiStyles;
	module.exports.hasColor = hasAnsi;
	module.exports.stripColor = stripAnsi;
	module.exports.supportsColor = supportsColor;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
	
	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}
	
		return str.replace(matchOperatorsRe, '\\$&');
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';
	var colorConvert = __webpack_require__(6);
	
	function wrapAnsi16(fn, offset) {
		return function () {
			var code = fn.apply(colorConvert, arguments);
			return '\u001b[' + (code + offset) + 'm';
		};
	}
	
	function wrapAnsi256(fn, offset) {
		return function () {
			var code = fn.apply(colorConvert, arguments);
			return '\u001b[' + (38 + offset) + ';5;' + code + 'm';
		};
	}
	
	function wrapAnsi16m(fn, offset) {
		return function () {
			var rgb = fn.apply(colorConvert, arguments);
			return '\u001b[' + (38 + offset) + ';2;' +
				rgb[0] + ';' + rgb[1] + ';' + rgb[2] + 'm';
		};
	}
	
	function assembleStyles() {
		var styles = {
			modifier: {
				reset: [0, 0],
				// 21 isn't widely supported and 22 does the same thing
				bold: [1, 22],
				dim: [2, 22],
				italic: [3, 23],
				underline: [4, 24],
				inverse: [7, 27],
				hidden: [8, 28],
				strikethrough: [9, 29]
			},
			color: {
				black: [30, 39],
				red: [31, 39],
				green: [32, 39],
				yellow: [33, 39],
				blue: [34, 39],
				magenta: [35, 39],
				cyan: [36, 39],
				white: [37, 39],
				gray: [90, 39]
			},
			bgColor: {
				bgBlack: [40, 49],
				bgRed: [41, 49],
				bgGreen: [42, 49],
				bgYellow: [43, 49],
				bgBlue: [44, 49],
				bgMagenta: [45, 49],
				bgCyan: [46, 49],
				bgWhite: [47, 49]
			}
		};
	
		// fix humans
		styles.color.grey = styles.color.gray;
	
		Object.keys(styles).forEach(function (groupName) {
			var group = styles[groupName];
	
			Object.keys(group).forEach(function (styleName) {
				var style = group[styleName];
	
				styles[styleName] = group[styleName] = {
					open: '\u001b[' + style[0] + 'm',
					close: '\u001b[' + style[1] + 'm'
				};
			});
	
			Object.defineProperty(styles, groupName, {
				value: group,
				enumerable: false
			});
		});
	
		function rgb2rgb(r, g, b) {
			return [r, g, b];
		}
	
		styles.color.close = '\u001b[39m';
		styles.bgColor.close = '\u001b[49m';
	
		styles.color.ansi = {};
		styles.color.ansi256 = {};
		styles.color.ansi16m = {
			rgb: wrapAnsi16m(rgb2rgb, 0)
		};
	
		styles.bgColor.ansi = {};
		styles.bgColor.ansi256 = {};
		styles.bgColor.ansi16m = {
			rgb: wrapAnsi16m(rgb2rgb, 10)
		};
	
		for (var key in colorConvert) {
			if (!colorConvert.hasOwnProperty(key) || typeof colorConvert[key] !== 'object') {
				continue;
			}
	
			var suite = colorConvert[key];
	
			if ('ansi16' in suite) {
				styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
				styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
			}
	
			if ('ansi256' in suite) {
				styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
				styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
			}
	
			if ('rgb' in suite) {
				styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
				styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
			}
		}
	
		return styles;
	}
	
	Object.defineProperty(module, 'exports', {
		enumerable: true,
		get: assembleStyles
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var conversions = __webpack_require__(7);
	var route = __webpack_require__(9);
	
	var convert = {};
	
	var models = Object.keys(conversions);
	
	function wrapRaw(fn) {
		var wrappedFn = function (args) {
			if (args === undefined || args === null) {
				return args;
			}
	
			if (arguments.length > 1) {
				args = Array.prototype.slice.call(arguments);
			}
	
			return fn(args);
		};
	
		// preserve .conversion property if there is one
		if ('conversion' in fn) {
			wrappedFn.conversion = fn.conversion;
		}
	
		return wrappedFn;
	}
	
	function wrapRounded(fn) {
		var wrappedFn = function (args) {
			if (args === undefined || args === null) {
				return args;
			}
	
			if (arguments.length > 1) {
				args = Array.prototype.slice.call(arguments);
			}
	
			var result = fn(args);
	
			// we're assuming the result is an array here.
			// see notice in conversions.js; don't use box types
			// in conversion functions.
			if (typeof result === 'object') {
				for (var len = result.length, i = 0; i < len; i++) {
					result[i] = Math.round(result[i]);
				}
			}
	
			return result;
		};
	
		// preserve .conversion property if there is one
		if ('conversion' in fn) {
			wrappedFn.conversion = fn.conversion;
		}
	
		return wrappedFn;
	}
	
	models.forEach(function (fromModel) {
		convert[fromModel] = {};
	
		var routes = route(fromModel);
		var routeModels = Object.keys(routes);
	
		routeModels.forEach(function (toModel) {
			var fn = routes[toModel];
	
			convert[fromModel][toModel] = wrapRounded(fn);
			convert[fromModel][toModel].raw = wrapRaw(fn);
		});
	});
	
	module.exports = convert;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* MIT license */
	var cssKeywords = __webpack_require__(8);
	
	// NOTE: conversions should only return primitive values (i.e. arrays, or
	//       values that give correct `typeof` results).
	//       do not use box values types (i.e. Number(), String(), etc.)
	
	var reverseKeywords = {};
	for (var key in cssKeywords) {
		if (cssKeywords.hasOwnProperty(key)) {
			reverseKeywords[cssKeywords[key].join()] = key;
		}
	}
	
	var convert = module.exports = {
		rgb: {},
		hsl: {},
		hsv: {},
		hwb: {},
		cmyk: {},
		xyz: {},
		lab: {},
		lch: {},
		hex: {},
		keyword: {},
		ansi16: {},
		ansi256: {}
	};
	
	convert.rgb.hsl = function (rgb) {
		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;
		var min = Math.min(r, g, b);
		var max = Math.max(r, g, b);
		var delta = max - min;
		var h;
		var s;
		var l;
	
		if (max === min) {
			h = 0;
		} else if (r === max) {
			h = (g - b) / delta;
		} else if (g === max) {
			h = 2 + (b - r) / delta;
		} else if (b === max) {
			h = 4 + (r - g) / delta;
		}
	
		h = Math.min(h * 60, 360);
	
		if (h < 0) {
			h += 360;
		}
	
		l = (min + max) / 2;
	
		if (max === min) {
			s = 0;
		} else if (l <= 0.5) {
			s = delta / (max + min);
		} else {
			s = delta / (2 - max - min);
		}
	
		return [h, s * 100, l * 100];
	};
	
	convert.rgb.hsv = function (rgb) {
		var r = rgb[0];
		var g = rgb[1];
		var b = rgb[2];
		var min = Math.min(r, g, b);
		var max = Math.max(r, g, b);
		var delta = max - min;
		var h;
		var s;
		var v;
	
		if (max === 0) {
			s = 0;
		} else {
			s = (delta / max * 1000) / 10;
		}
	
		if (max === min) {
			h = 0;
		} else if (r === max) {
			h = (g - b) / delta;
		} else if (g === max) {
			h = 2 + (b - r) / delta;
		} else if (b === max) {
			h = 4 + (r - g) / delta;
		}
	
		h = Math.min(h * 60, 360);
	
		if (h < 0) {
			h += 360;
		}
	
		v = ((max / 255) * 1000) / 10;
	
		return [h, s, v];
	};
	
	convert.rgb.hwb = function (rgb) {
		var r = rgb[0];
		var g = rgb[1];
		var b = rgb[2];
		var h = convert.rgb.hsl(rgb)[0];
		var w = 1 / 255 * Math.min(r, Math.min(g, b));
	
		b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
	
		return [h, w * 100, b * 100];
	};
	
	convert.rgb.cmyk = function (rgb) {
		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;
		var c;
		var m;
		var y;
		var k;
	
		k = Math.min(1 - r, 1 - g, 1 - b);
		c = (1 - r - k) / (1 - k) || 0;
		m = (1 - g - k) / (1 - k) || 0;
		y = (1 - b - k) / (1 - k) || 0;
	
		return [c * 100, m * 100, y * 100, k * 100];
	};
	
	convert.rgb.keyword = function (rgb) {
		return reverseKeywords[rgb.join()];
	};
	
	convert.keyword.rgb = function (keyword) {
		return cssKeywords[keyword];
	};
	
	convert.rgb.xyz = function (rgb) {
		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;
	
		// assume sRGB
		r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
		g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
		b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);
	
		var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
		var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
		var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);
	
		return [x * 100, y * 100, z * 100];
	};
	
	convert.rgb.lab = function (rgb) {
		var xyz = convert.rgb.xyz(rgb);
		var x = xyz[0];
		var y = xyz[1];
		var z = xyz[2];
		var l;
		var a;
		var b;
	
		x /= 95.047;
		y /= 100;
		z /= 108.883;
	
		x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
		y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
		z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);
	
		l = (116 * y) - 16;
		a = 500 * (x - y);
		b = 200 * (y - z);
	
		return [l, a, b];
	};
	
	convert.hsl.rgb = function (hsl) {
		var h = hsl[0] / 360;
		var s = hsl[1] / 100;
		var l = hsl[2] / 100;
		var t1;
		var t2;
		var t3;
		var rgb;
		var val;
	
		if (s === 0) {
			val = l * 255;
			return [val, val, val];
		}
	
		if (l < 0.5) {
			t2 = l * (1 + s);
		} else {
			t2 = l + s - l * s;
		}
	
		t1 = 2 * l - t2;
	
		rgb = [0, 0, 0];
		for (var i = 0; i < 3; i++) {
			t3 = h + 1 / 3 * -(i - 1);
			if (t3 < 0) {
				t3++;
			}
			if (t3 > 1) {
				t3--;
			}
	
			if (6 * t3 < 1) {
				val = t1 + (t2 - t1) * 6 * t3;
			} else if (2 * t3 < 1) {
				val = t2;
			} else if (3 * t3 < 2) {
				val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
			} else {
				val = t1;
			}
	
			rgb[i] = val * 255;
		}
	
		return rgb;
	};
	
	convert.hsl.hsv = function (hsl) {
		var h = hsl[0];
		var s = hsl[1] / 100;
		var l = hsl[2] / 100;
		var sv;
		var v;
	
		if (l === 0) {
			// no need to do calc on black
			// also avoids divide by 0 error
			return [0, 0, 0];
		}
	
		l *= 2;
		s *= (l <= 1) ? l : 2 - l;
		v = (l + s) / 2;
		sv = (2 * s) / (l + s);
	
		return [h, sv * 100, v * 100];
	};
	
	convert.hsv.rgb = function (hsv) {
		var h = hsv[0] / 60;
		var s = hsv[1] / 100;
		var v = hsv[2] / 100;
		var hi = Math.floor(h) % 6;
	
		var f = h - Math.floor(h);
		var p = 255 * v * (1 - s);
		var q = 255 * v * (1 - (s * f));
		var t = 255 * v * (1 - (s * (1 - f)));
		v *= 255;
	
		switch (hi) {
			case 0:
				return [v, t, p];
			case 1:
				return [q, v, p];
			case 2:
				return [p, v, t];
			case 3:
				return [p, q, v];
			case 4:
				return [t, p, v];
			case 5:
				return [v, p, q];
		}
	};
	
	convert.hsv.hsl = function (hsv) {
		var h = hsv[0];
		var s = hsv[1] / 100;
		var v = hsv[2] / 100;
		var sl;
		var l;
	
		l = (2 - s) * v;
		sl = s * v;
		sl /= (l <= 1) ? l : 2 - l;
		sl = sl || 0;
		l /= 2;
	
		return [h, sl * 100, l * 100];
	};
	
	// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
	convert.hwb.rgb = function (hwb) {
		var h = hwb[0] / 360;
		var wh = hwb[1] / 100;
		var bl = hwb[2] / 100;
		var ratio = wh + bl;
		var i;
		var v;
		var f;
		var n;
	
		// wh + bl cant be > 1
		if (ratio > 1) {
			wh /= ratio;
			bl /= ratio;
		}
	
		i = Math.floor(6 * h);
		v = 1 - bl;
		f = 6 * h - i;
	
		if ((i & 0x01) !== 0) {
			f = 1 - f;
		}
	
		n = wh + f * (v - wh); // linear interpolation
	
		var r;
		var g;
		var b;
		switch (i) {
			default:
			case 6:
			case 0: r = v; g = n; b = wh; break;
			case 1: r = n; g = v; b = wh; break;
			case 2: r = wh; g = v; b = n; break;
			case 3: r = wh; g = n; b = v; break;
			case 4: r = n; g = wh; b = v; break;
			case 5: r = v; g = wh; b = n; break;
		}
	
		return [r * 255, g * 255, b * 255];
	};
	
	convert.cmyk.rgb = function (cmyk) {
		var c = cmyk[0] / 100;
		var m = cmyk[1] / 100;
		var y = cmyk[2] / 100;
		var k = cmyk[3] / 100;
		var r;
		var g;
		var b;
	
		r = 1 - Math.min(1, c * (1 - k) + k);
		g = 1 - Math.min(1, m * (1 - k) + k);
		b = 1 - Math.min(1, y * (1 - k) + k);
	
		return [r * 255, g * 255, b * 255];
	};
	
	convert.xyz.rgb = function (xyz) {
		var x = xyz[0] / 100;
		var y = xyz[1] / 100;
		var z = xyz[2] / 100;
		var r;
		var g;
		var b;
	
		r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
		g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
		b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);
	
		// assume sRGB
		r = r > 0.0031308
			? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
			: r *= 12.92;
	
		g = g > 0.0031308
			? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
			: g *= 12.92;
	
		b = b > 0.0031308
			? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
			: b *= 12.92;
	
		r = Math.min(Math.max(0, r), 1);
		g = Math.min(Math.max(0, g), 1);
		b = Math.min(Math.max(0, b), 1);
	
		return [r * 255, g * 255, b * 255];
	};
	
	convert.xyz.lab = function (xyz) {
		var x = xyz[0];
		var y = xyz[1];
		var z = xyz[2];
		var l;
		var a;
		var b;
	
		x /= 95.047;
		y /= 100;
		z /= 108.883;
	
		x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
		y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
		z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);
	
		l = (116 * y) - 16;
		a = 500 * (x - y);
		b = 200 * (y - z);
	
		return [l, a, b];
	};
	
	convert.lab.xyz = function (lab) {
		var l = lab[0];
		var a = lab[1];
		var b = lab[2];
		var x;
		var y;
		var z;
		var y2;
	
		if (l <= 8) {
			y = (l * 100) / 903.3;
			y2 = (7.787 * (y / 100)) + (16 / 116);
		} else {
			y = 100 * Math.pow((l + 16) / 116, 3);
			y2 = Math.pow(y / 100, 1 / 3);
		}
	
		x = x / 95.047 <= 0.008856
			? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787
			: 95.047 * Math.pow((a / 500) + y2, 3);
		z = z / 108.883 <= 0.008859
			? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787
			: 108.883 * Math.pow(y2 - (b / 200), 3);
	
		return [x, y, z];
	};
	
	convert.lab.lch = function (lab) {
		var l = lab[0];
		var a = lab[1];
		var b = lab[2];
		var hr;
		var h;
		var c;
	
		hr = Math.atan2(b, a);
		h = hr * 360 / 2 / Math.PI;
	
		if (h < 0) {
			h += 360;
		}
	
		c = Math.sqrt(a * a + b * b);
	
		return [l, c, h];
	};
	
	convert.lch.lab = function (lch) {
		var l = lch[0];
		var c = lch[1];
		var h = lch[2];
		var a;
		var b;
		var hr;
	
		hr = h / 360 * 2 * Math.PI;
		a = c * Math.cos(hr);
		b = c * Math.sin(hr);
	
		return [l, a, b];
	};
	
	convert.rgb.ansi16 = function (args) {
		var r = args[0];
		var g = args[1];
		var b = args[2];
		var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization
	
		value = Math.round(value / 50);
	
		if (value === 0) {
			return 30;
		}
	
		var ansi = 30
			+ ((Math.round(b / 255) << 2)
			| (Math.round(g / 255) << 1)
			| Math.round(r / 255));
	
		if (value === 2) {
			ansi += 60;
		}
	
		return ansi;
	};
	
	convert.hsv.ansi16 = function (args) {
		// optimization here; we already know the value and don't need to get
		// it converted for us.
		return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
	};
	
	convert.rgb.ansi256 = function (args) {
		var r = args[0];
		var g = args[1];
		var b = args[2];
	
		// we use the extended greyscale palette here, with the exception of
		// black and white. normal palette only has 4 greyscale shades.
		if (r === g && g === b) {
			if (r < 8) {
				return 16;
			}
	
			if (r > 248) {
				return 231;
			}
	
			return Math.round(((r - 8) / 247) * 24) + 232;
		}
	
		var ansi = 16
			+ (36 * Math.round(r / 255 * 5))
			+ (6 * Math.round(g / 255 * 5))
			+ Math.round(b / 255 * 5);
	
		return ansi;
	};
	
	convert.ansi16.rgb = function (args) {
		var color = args % 10;
	
		// handle greyscale
		if (color === 0 || color === 7) {
			if (args > 50) {
				color += 3.5;
			}
	
			color = color / 10.5 * 255;
	
			return [color, color, color];
		}
	
		var mult = (~~(args > 50) + 1) * 0.5;
		var r = ((color & 1) * mult) * 255;
		var g = (((color >> 1) & 1) * mult) * 255;
		var b = (((color >> 2) & 1) * mult) * 255;
	
		return [r, g, b];
	};
	
	convert.ansi256.rgb = function (args) {
		// handle greyscale
		if (args >= 232) {
			var c = (args - 232) * 10 + 8;
			return [c, c, c];
		}
	
		args -= 16;
	
		var rem;
		var r = Math.floor(args / 36) / 5 * 255;
		var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
		var b = (rem % 6) / 5 * 255;
	
		return [r, g, b];
	};
	
	convert.rgb.hex = function (args) {
		var integer = ((Math.round(args[0]) & 0xFF) << 16)
			+ ((Math.round(args[1]) & 0xFF) << 8)
			+ (Math.round(args[2]) & 0xFF);
	
		var string = integer.toString(16).toUpperCase();
		return '000000'.substring(string.length) + string;
	};
	
	convert.hex.rgb = function (args) {
		var match = args.toString(16).match(/[a-f0-9]{6}/i);
		if (!match) {
			return [0, 0, 0];
		}
	
		var integer = parseInt(match[0], 16);
		var r = (integer >> 16) & 0xFF;
		var g = (integer >> 8) & 0xFF;
		var b = integer & 0xFF;
	
		return [r, g, b];
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = {
		aliceblue: [240, 248, 255],
		antiquewhite: [250, 235, 215],
		aqua: [0, 255, 255],
		aquamarine: [127, 255, 212],
		azure: [240, 255, 255],
		beige: [245, 245, 220],
		bisque: [255, 228, 196],
		black: [0, 0, 0],
		blanchedalmond: [255, 235, 205],
		blue: [0, 0, 255],
		blueviolet: [138, 43, 226],
		brown: [165, 42, 42],
		burlywood: [222, 184, 135],
		cadetblue: [95, 158, 160],
		chartreuse: [127, 255, 0],
		chocolate: [210, 105, 30],
		coral: [255, 127, 80],
		cornflowerblue: [100, 149, 237],
		cornsilk: [255, 248, 220],
		crimson: [220, 20, 60],
		cyan: [0, 255, 255],
		darkblue: [0, 0, 139],
		darkcyan: [0, 139, 139],
		darkgoldenrod: [184, 134, 11],
		darkgray: [169, 169, 169],
		darkgreen: [0, 100, 0],
		darkgrey: [169, 169, 169],
		darkkhaki: [189, 183, 107],
		darkmagenta: [139, 0, 139],
		darkolivegreen: [85, 107, 47],
		darkorange: [255, 140, 0],
		darkorchid: [153, 50, 204],
		darkred: [139, 0, 0],
		darksalmon: [233, 150, 122],
		darkseagreen: [143, 188, 143],
		darkslateblue: [72, 61, 139],
		darkslategray: [47, 79, 79],
		darkslategrey: [47, 79, 79],
		darkturquoise: [0, 206, 209],
		darkviolet: [148, 0, 211],
		deeppink: [255, 20, 147],
		deepskyblue: [0, 191, 255],
		dimgray: [105, 105, 105],
		dimgrey: [105, 105, 105],
		dodgerblue: [30, 144, 255],
		firebrick: [178, 34, 34],
		floralwhite: [255, 250, 240],
		forestgreen: [34, 139, 34],
		fuchsia: [255, 0, 255],
		gainsboro: [220, 220, 220],
		ghostwhite: [248, 248, 255],
		gold: [255, 215, 0],
		goldenrod: [218, 165, 32],
		gray: [128, 128, 128],
		green: [0, 128, 0],
		greenyellow: [173, 255, 47],
		grey: [128, 128, 128],
		honeydew: [240, 255, 240],
		hotpink: [255, 105, 180],
		indianred: [205, 92, 92],
		indigo: [75, 0, 130],
		ivory: [255, 255, 240],
		khaki: [240, 230, 140],
		lavender: [230, 230, 250],
		lavenderblush: [255, 240, 245],
		lawngreen: [124, 252, 0],
		lemonchiffon: [255, 250, 205],
		lightblue: [173, 216, 230],
		lightcoral: [240, 128, 128],
		lightcyan: [224, 255, 255],
		lightgoldenrodyellow: [250, 250, 210],
		lightgray: [211, 211, 211],
		lightgreen: [144, 238, 144],
		lightgrey: [211, 211, 211],
		lightpink: [255, 182, 193],
		lightsalmon: [255, 160, 122],
		lightseagreen: [32, 178, 170],
		lightskyblue: [135, 206, 250],
		lightslategray: [119, 136, 153],
		lightslategrey: [119, 136, 153],
		lightsteelblue: [176, 196, 222],
		lightyellow: [255, 255, 224],
		lime: [0, 255, 0],
		limegreen: [50, 205, 50],
		linen: [250, 240, 230],
		magenta: [255, 0, 255],
		maroon: [128, 0, 0],
		mediumaquamarine: [102, 205, 170],
		mediumblue: [0, 0, 205],
		mediumorchid: [186, 85, 211],
		mediumpurple: [147, 112, 219],
		mediumseagreen: [60, 179, 113],
		mediumslateblue: [123, 104, 238],
		mediumspringgreen: [0, 250, 154],
		mediumturquoise: [72, 209, 204],
		mediumvioletred: [199, 21, 133],
		midnightblue: [25, 25, 112],
		mintcream: [245, 255, 250],
		mistyrose: [255, 228, 225],
		moccasin: [255, 228, 181],
		navajowhite: [255, 222, 173],
		navy: [0, 0, 128],
		oldlace: [253, 245, 230],
		olive: [128, 128, 0],
		olivedrab: [107, 142, 35],
		orange: [255, 165, 0],
		orangered: [255, 69, 0],
		orchid: [218, 112, 214],
		palegoldenrod: [238, 232, 170],
		palegreen: [152, 251, 152],
		paleturquoise: [175, 238, 238],
		palevioletred: [219, 112, 147],
		papayawhip: [255, 239, 213],
		peachpuff: [255, 218, 185],
		peru: [205, 133, 63],
		pink: [255, 192, 203],
		plum: [221, 160, 221],
		powderblue: [176, 224, 230],
		purple: [128, 0, 128],
		rebeccapurple: [102, 51, 153],
		red: [255, 0, 0],
		rosybrown: [188, 143, 143],
		royalblue: [65, 105, 225],
		saddlebrown: [139, 69, 19],
		salmon: [250, 128, 114],
		sandybrown: [244, 164, 96],
		seagreen: [46, 139, 87],
		seashell: [255, 245, 238],
		sienna: [160, 82, 45],
		silver: [192, 192, 192],
		skyblue: [135, 206, 235],
		slateblue: [106, 90, 205],
		slategray: [112, 128, 144],
		slategrey: [112, 128, 144],
		snow: [255, 250, 250],
		springgreen: [0, 255, 127],
		steelblue: [70, 130, 180],
		tan: [210, 180, 140],
		teal: [0, 128, 128],
		thistle: [216, 191, 216],
		tomato: [255, 99, 71],
		turquoise: [64, 224, 208],
		violet: [238, 130, 238],
		wheat: [245, 222, 179],
		white: [255, 255, 255],
		whitesmoke: [245, 245, 245],
		yellow: [255, 255, 0],
		yellowgreen: [154, 205, 50]
	};
	


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var conversions = __webpack_require__(7);
	
	/*
		this function routes a model to all other models.
	
		all functions that are routed have a property `.conversion` attached
		to the returned synthetic function. This property is an array
		of strings, each with the steps in between the 'from' and 'to'
		color models (inclusive).
	
		conversions that are not possible simply are not included.
	*/
	
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	var models = Object.keys(conversions);
	
	function buildGraph() {
		var graph = {};
	
		for (var len = models.length, i = 0; i < len; i++) {
			graph[models[i]] = {
				// http://jsperf.com/1-vs-infinity
				// micro-opt, but this is simple.
				distance: -1,
				parent: null
			};
		}
	
		return graph;
	}
	
	// https://en.wikipedia.org/wiki/Breadth-first_search
	function deriveBFS(fromModel) {
		var graph = buildGraph();
		var queue = [fromModel]; // unshift -> queue -> pop
	
		graph[fromModel].distance = 0;
	
		while (queue.length) {
			var current = queue.pop();
			var adjacents = Object.keys(conversions[current]);
	
			for (var len = adjacents.length, i = 0; i < len; i++) {
				var adjacent = adjacents[i];
				var node = graph[adjacent];
	
				if (node.distance === -1) {
					node.distance = graph[current].distance + 1;
					node.parent = current;
					queue.unshift(adjacent);
				}
			}
		}
	
		return graph;
	}
	
	function link(from, to) {
		return function (args) {
			return to(from(args));
		};
	}
	
	function wrapConversion(toModel, graph) {
		var path = [graph[toModel].parent, toModel];
		var fn = conversions[graph[toModel].parent][toModel];
	
		var cur = graph[toModel].parent;
		while (graph[cur].parent) {
			path.unshift(graph[cur].parent);
			fn = link(conversions[graph[cur].parent][cur], fn);
			cur = graph[cur].parent;
		}
	
		fn.conversion = path;
		return fn;
	}
	
	module.exports = function (fromModel) {
		var graph = deriveBFS(fromModel);
		var conversion = {};
	
		var models = Object.keys(graph);
		for (var len = models.length, i = 0; i < len; i++) {
			var toModel = models[i];
			var node = graph[toModel];
	
			if (node.parent === null) {
				// no possible conversion, or this node is the source model.
				continue;
			}
	
			conversion[toModel] = wrapConversion(toModel, graph);
		}
	
		return conversion;
	};
	


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(11)();
	
	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(11);
	var re = new RegExp(ansiRegex().source); // remove the `g` flag
	module.exports = re.test.bind(re);


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var argv = process.argv;
	
	var terminator = argv.indexOf('--');
	var hasFlag = function (flag) {
		flag = '--' + flag;
		var pos = argv.indexOf(flag);
		return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
	};
	
	module.exports = (function () {
		if ('FORCE_COLOR' in process.env) {
			return true;
		}
	
		if (hasFlag('no-color') ||
			hasFlag('no-colors') ||
			hasFlag('color=false')) {
			return false;
		}
	
		if (hasFlag('color') ||
			hasFlag('colors') ||
			hasFlag('color=true') ||
			hasFlag('color=always')) {
			return true;
		}
	
		if (process.stdout && !process.stdout.isTTY) {
			return false;
		}
	
		if (process.platform === 'win32') {
			return true;
		}
	
		if ('COLORTERM' in process.env) {
			return true;
		}
	
		if (process.env.TERM === 'dumb') {
			return false;
		}
	
		if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
			return true;
		}
	
		return false;
	})();
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = ansiToBrowser;
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
	
	var testRegex = /(\u001b\[[^m]+m)/;
	var infoRegex = /\u001b\[([^m]+)m/;
	
	/**
	 * @function
	 * @name ansiToBrowser converts ANSI colored strings to chrome console argument lists
	 *
	 * @param {String} ansiEncodedString the ANSI colored string
	 * @return {Array<String>} an argument list that can be applied to chrome's console
	 */
	function ansiToBrowser(ansiEncodedString) {
	  var splits = ansiEncodedString.split(testRegex).filter(function (s) {
	    return s.length > 0;
	  });
	  var initialState = {
	    segments: [''],
	    styles: {
	      color: '',
	      backgroundColor: '',
	      fontWeight: '',
	      textDecoration: '',
	      opacity: ''
	    }
	  };
	
	  var _splits$reduce = splits.reduce(function (state, piece) {
	    var action = testRegex.test(piece) ? escapeCodeToAction(piece) : stringToAction(piece);
	    var newState = action(state);
	    return newState;
	  }, initialState);
	
	  var segments = _splits$reduce.segments;
	
	
	  return segments;
	}
	
	function allMatches(regex, string) {
	  // copy regex with global flag (just in case)
	  var flags = 'g' + (regex.ignoreCase ? 'i' : '') + (regex.multiline ? 'm' : '');
	
	  var globalRegex = new RegExp(regex.source, flags);
	  var matches = [];
	  var match = void 0;
	  while (match = globalRegex.exec(string)) {
	    matches.push(match);
	  }
	
	  return matches;
	}
	
	/**
	 * @name stringToAction converts a string into an action
	 *
	 * @param {string} piece the new piece of string
	 * @return {Function} the function to evolve the state
	 */
	function stringToAction(piece) {
	  return function (state) {
	    var _state$segments = _toArray(state.segments);
	
	    var string = _state$segments[0];
	
	    var styles = _state$segments.slice(1);
	
	    var newCSS = cssFromStyles(state.styles);
	    var segments = void 0;
	    // first string, unstyled
	    if (styles.length === 0 && newCSS.length === 0) {
	      segments = ['' + string + piece];
	    } else {
	      segments = [string + '%c' + piece].concat(_toConsumableArray(styles), [newCSS]);
	    }
	    return Object.assign({}, state, { segments: segments });
	  };
	}
	
	/**
	 * @name escapeCodeToAction converts an escape code to a color string
	 *
	 * @param {string} code the escape code
	 * @return {Function} the function to evolve the state
	 */
	function escapeCodeToAction(code) {
	  var codes = infoRegex.exec(code)[1].split(';').map(function (n) {
	    return parseInt(n);
	  });
	  var newStyles = codes.map(numberToStyles);
	  return function (state) {
	    var oldStyles = state.styles;
	    var segments = state.segments;
	
	    var styles = Object.assign.apply(Object, [{}, oldStyles].concat(_toConsumableArray(newStyles)));
	    return Object.assign({}, state, {
	      styles: styles
	    });
	  };
	}
	
	function normalizedCSSProperty(propName) {
	  switch (propName) {
	    case 'textDecoration':
	      return 'text-decoration';
	    case 'fontWeight':
	      return 'font-weight';
	    case 'backgroundColor':
	      return 'background-color';
	    default:
	      return propName;
	  }
	}
	
	function cssFromStyles(styles) {
	  return Object.keys(styles).map(function (property) {
	    var value = styles[property];
	    if (value.length > 0) {
	      return normalizedCSSProperty(property) + ': ' + value + ';';
	    }
	
	    return '';
	  }).filter(function (s) {
	    return s.length > 0;
	  }).join(' ');
	}
	
	/**
	 * @name numberToAction converts an escape number to an action
	 *
	 * @param {number} number the number that gets nestled inside an escape code
	 * @return {Object} the tranformative action to apply to styles
	 */
	function numberToStyles(number) {
	  switch (number) {
	    case 0:
	      return { fontWeight: '', textDecoration: '' };
	    case 1:
	      return { fontWeight: 'bold' };
	    case 4:
	      return { textDecoration: 'underline' };
	    case 30:
	      return { color: 'black' };
	    case 31:
	      return { color: 'red' };
	    case 32:
	      return { color: 'green' };
	    case 33:
	      return { color: 'yellow' };
	    case 34:
	      return { color: 'blue' };
	    case 35:
	      return { color: 'magenta' };
	    case 36:
	      return { color: 'cyan' };
	    case 37:
	      return { color: 'white' };
	    case 39:
	      return { color: '', backgroundColor: '', fontWeight: '', textDecoration: '' };
	    case 40:
	      return { backgroundColor: 'black' };
	    case 41:
	      return { backgroundColor: 'red' };
	    case 42:
	      return { backgroundColor: 'green' };
	    case 43:
	      return { backgroundColor: 'yellow' };
	    case 44:
	      return { backgroundColor: 'blue' };
	    case 45:
	      return { backgroundColor: 'magenta' };
	    case 46:
	      return { backgroundColor: 'cyan' };
	    case 47:
	      return { backgroundColor: 'white' };
	    case 90:
	      return { color: 'gray' };
	    default:
	      return {};
	  }
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=logger.js.map