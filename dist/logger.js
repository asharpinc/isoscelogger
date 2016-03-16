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
	
	var _safe = __webpack_require__(2);
	
	var _safe2 = _interopRequireDefault(_safe);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	_safe2.default.enabled = true;
	
	var LightStream = function () {
	  function LightStream(fn) {
	    _classCallCheck(this, LightStream);
	
	    this.fn = fn;
	    this.buff = '';
	  }
	
	  _createClass(LightStream, [{
	    key: 'write',
	    value: function write(msg) {
	      this.buff += msg;
	      this.flush();
	    }
	  }, {
	    key: 'flush',
	    value: function flush() {
	      var _this = this;
	
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
	var inBrowser = void 0;
	
	if (process && process.stdout) {
	  stdout = process.stdout;
	  stderr = process.stderr;
	  inBrowser = false;
	} else {
	  stdout = new LightStream(console.log.bind(console));
	  stderr = new LightStream(console.error.bind(console));
	  inBrowser = true;
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
	    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    var type = _ref.type;
	    var template = _ref.template;
	
	    _classCallCheck(this, LoggerStream);
	
	    this.stream = stream;
	    this.type = type;
	    this.template = template;
	  }
	
	  _createClass(LoggerStream, [{
	    key: 'write',
	    value: function write(line) {
	      var templatedLine = LoggerStream.templateLine(this.template, { line: line });
	      this.stream.write(templatedLine + '\n');
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
	    value: function convertSpecification(specification, _ref2) {
	      var line = _ref2.line;
	
	      var character = specification[2];
	      var text = character === 't' ? timeStamp() : character === 'm' ? line : specification[0];
	
	      var modifyString = specification[3];
	      var id = function id(s) {
	        return s;
	      };
	      var modify = modifyString.split('.').reduce(function (modify, modifierString) {
	        if (_safe2.default[modifierString]) {
	          // compose new modifier onto old
	          return function (s) {
	            return _safe2.default[modifierString](modify(s));
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
	
	LoggerStream.CLITemplates[LoggerStream.Type.ERROR] = '[%t.dim.grey] ' + _safe2.default.red('(✗)') + ' %m.red';
	
	var Logger = function () {
	  function Logger() {
	    var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref3$name = _ref3.name;
	    var name = _ref3$name === undefined ? '' : _ref3$name;
	    var _ref3$stream = _ref3.stream;
	    var stream = _ref3$stream === undefined ? stdout : _ref3$stream;
	    var _ref3$errorStream = _ref3.errorStream;
	    var errorStream = _ref3$errorStream === undefined ? stderr : _ref3$errorStream;
	    var template = _ref3.template;
	    var errorTemplate = _ref3.errorTemplate;
	
	    _classCallCheck(this, Logger);
	
	    this.log = this.log.bind(this);
	    this.error = this.error.bind(this);
	    this.tap = this.tap.bind(this);
	    this.tapError = this.tapError.bind(this);
	
	    this.streams = [];
	    this.errorStreams = [];
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
	      var options = arguments.length <= 1 || arguments[1] === undefined ? { type: LoggerStream.Type.LOG } : arguments[1];
	
	      var loggerStream = new LoggerStream(stream, options);
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
	  }]);
	
	  return Logger;
	}();

	exports.default = Logger;
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

	/* WEBPACK VAR INJECTION */(function(module) {//
	// Remark: Requiring this file will use the "safe" colors API which will not touch String.prototype
	//
	//   var colors = require('colors/safe);
	//   colors.red("foo")
	//
	//
	var colors = __webpack_require__(4);
	module['exports'] = colors;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 3 */
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*
	
	The MIT License (MIT)
	
	Original Library 
	  - Copyright (c) Marak Squires
	
	Additional functionality
	 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	
	*/
	
	var colors = {};
	module['exports'] = colors;
	
	colors.themes = {};
	
	var ansiStyles = colors.styles = __webpack_require__(5);
	var defineProps = Object.defineProperties;
	
	colors.supportsColor = __webpack_require__(6);
	
	if (typeof colors.enabled === "undefined") {
	  colors.enabled = colors.supportsColor;
	}
	
	colors.stripColors = colors.strip = function(str){
	  return ("" + str).replace(/\x1B\[\d+m/g, '');
	};
	
	
	var stylize = colors.stylize = function stylize (str, style) {
	  if (!colors.enabled) {
	    return str+'';
	  }
	
	  return ansiStyles[style].open + str + ansiStyles[style].close;
	}
	
	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
	var escapeStringRegexp = function (str) {
	  if (typeof str !== 'string') {
	    throw new TypeError('Expected a string');
	  }
	  return str.replace(matchOperatorsRe,  '\\$&');
	}
	
	function build(_styles) {
	  var builder = function builder() {
	    return applyStyle.apply(builder, arguments);
	  };
	  builder._styles = _styles;
	  // __proto__ is used because we must return a function, but there is
	  // no way to create a function with a different prototype.
	  builder.__proto__ = proto;
	  return builder;
	}
	
	var styles = (function () {
	  var ret = {};
	  ansiStyles.grey = ansiStyles.gray;
	  Object.keys(ansiStyles).forEach(function (key) {
	    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
	    ret[key] = {
	      get: function () {
	        return build(this._styles.concat(key));
	      }
	    };
	  });
	  return ret;
	})();
	
	var proto = defineProps(function colors() {}, styles);
	
	function applyStyle() {
	  var args = arguments;
	  var argsLen = args.length;
	  var str = argsLen !== 0 && String(arguments[0]);
	  if (argsLen > 1) {
	    for (var a = 1; a < argsLen; a++) {
	      str += ' ' + args[a];
	    }
	  }
	
	  if (!colors.enabled || !str) {
	    return str;
	  }
	
	  var nestedStyles = this._styles;
	
	  var i = nestedStyles.length;
	  while (i--) {
	    var code = ansiStyles[nestedStyles[i]];
	    str = code.open + str.replace(code.closeRe, code.open) + code.close;
	  }
	
	  return str;
	}
	
	function applyTheme (theme) {
	  for (var style in theme) {
	    (function(style){
	      colors[style] = function(str){
	        if (typeof theme[style] === 'object'){
	          var out = str;
	          for (var i in theme[style]){
	            out = colors[theme[style][i]](out);
	          }
	          return out;
	        }
	        return colors[theme[style]](str);
	      };
	    })(style)
	  }
	}
	
	colors.setTheme = function (theme) {
	  if (typeof theme === 'string') {
	    try {
	      colors.themes[theme] = __webpack_require__(7)(theme);
	      applyTheme(colors.themes[theme]);
	      return colors.themes[theme];
	    } catch (err) {
	      console.log(err);
	      return err;
	    }
	  } else {
	    applyTheme(theme);
	  }
	};
	
	function init() {
	  var ret = {};
	  Object.keys(styles).forEach(function (name) {
	    ret[name] = {
	      get: function () {
	        return build([name]);
	      }
	    };
	  });
	  return ret;
	}
	
	var sequencer = function sequencer (map, str) {
	  var exploded = str.split(""), i = 0;
	  exploded = exploded.map(map);
	  return exploded.join("");
	};
	
	// custom formatter methods
	colors.trap = __webpack_require__(8);
	colors.zalgo = __webpack_require__(9);
	
	// maps
	colors.maps = {};
	colors.maps.america = __webpack_require__(12);
	colors.maps.zebra = __webpack_require__(15);
	colors.maps.rainbow = __webpack_require__(13);
	colors.maps.random = __webpack_require__(14)
	
	for (var map in colors.maps) {
	  (function(map){
	    colors[map] = function (str) {
	      return sequencer(colors.maps[map], str);
	    }
	  })(map)
	}
	
	defineProps(colors, init());
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*
	The MIT License (MIT)
	
	Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	
	*/
	
	var styles = {};
	module['exports'] = styles;
	
	var codes = {
	  reset: [0, 0],
	
	  bold: [1, 22],
	  dim: [2, 22],
	  italic: [3, 23],
	  underline: [4, 24],
	  inverse: [7, 27],
	  hidden: [8, 28],
	  strikethrough: [9, 29],
	
	  black: [30, 39],
	  red: [31, 39],
	  green: [32, 39],
	  yellow: [33, 39],
	  blue: [34, 39],
	  magenta: [35, 39],
	  cyan: [36, 39],
	  white: [37, 39],
	  gray: [90, 39],
	  grey: [90, 39],
	
	  bgBlack: [40, 49],
	  bgRed: [41, 49],
	  bgGreen: [42, 49],
	  bgYellow: [43, 49],
	  bgBlue: [44, 49],
	  bgMagenta: [45, 49],
	  bgCyan: [46, 49],
	  bgWhite: [47, 49],
	
	  // legacy styles for colors pre v1.0.0
	  blackBG: [40, 49],
	  redBG: [41, 49],
	  greenBG: [42, 49],
	  yellowBG: [43, 49],
	  blueBG: [44, 49],
	  magentaBG: [45, 49],
	  cyanBG: [46, 49],
	  whiteBG: [47, 49]
	
	};
	
	Object.keys(codes).forEach(function (key) {
	  var val = codes[key];
	  var style = styles[key] = [];
	  style.open = '\u001b[' + val[0] + 'm';
	  style.close = '\u001b[' + val[1] + 'm';
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/*
	The MIT License (MIT)
	
	Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	
	*/
	
	var argv = process.argv;
	
	module.exports = (function () {
	  if (argv.indexOf('--no-color') !== -1 ||
	    argv.indexOf('--color=false') !== -1) {
	    return false;
	  }
	
	  if (argv.indexOf('--color') !== -1 ||
	    argv.indexOf('--color=true') !== -1 ||
	    argv.indexOf('--color=always') !== -1) {
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./colors": 4,
		"./colors.js": 4,
		"./custom/trap": 8,
		"./custom/trap.js": 8,
		"./custom/zalgo": 9,
		"./custom/zalgo.js": 9,
		"./extendStringPrototype": 10,
		"./extendStringPrototype.js": 10,
		"./index": 11,
		"./index.js": 11,
		"./maps/america": 12,
		"./maps/america.js": 12,
		"./maps/rainbow": 13,
		"./maps/rainbow.js": 13,
		"./maps/random": 14,
		"./maps/random.js": 14,
		"./maps/zebra": 15,
		"./maps/zebra.js": 15,
		"./styles": 5,
		"./styles.js": 5,
		"./system/supports-colors": 6,
		"./system/supports-colors.js": 6
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 7;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {module['exports'] = function runTheTrap (text, options) {
	  var result = "";
	  text = text || "Run the trap, drop the bass";
	  text = text.split('');
	  var trap = {
	    a: ["\u0040", "\u0104", "\u023a", "\u0245", "\u0394", "\u039b", "\u0414"],
	    b: ["\u00df", "\u0181", "\u0243", "\u026e", "\u03b2", "\u0e3f"],
	    c: ["\u00a9", "\u023b", "\u03fe"],
	    d: ["\u00d0", "\u018a", "\u0500" , "\u0501" ,"\u0502", "\u0503"],
	    e: ["\u00cb", "\u0115", "\u018e", "\u0258", "\u03a3", "\u03be", "\u04bc", "\u0a6c"],
	    f: ["\u04fa"],
	    g: ["\u0262"],
	    h: ["\u0126", "\u0195", "\u04a2", "\u04ba", "\u04c7", "\u050a"],
	    i: ["\u0f0f"],
	    j: ["\u0134"],
	    k: ["\u0138", "\u04a0", "\u04c3", "\u051e"],
	    l: ["\u0139"],
	    m: ["\u028d", "\u04cd", "\u04ce", "\u0520", "\u0521", "\u0d69"],
	    n: ["\u00d1", "\u014b", "\u019d", "\u0376", "\u03a0", "\u048a"],
	    o: ["\u00d8", "\u00f5", "\u00f8", "\u01fe", "\u0298", "\u047a", "\u05dd", "\u06dd", "\u0e4f"],
	    p: ["\u01f7", "\u048e"],
	    q: ["\u09cd"],
	    r: ["\u00ae", "\u01a6", "\u0210", "\u024c", "\u0280", "\u042f"],
	    s: ["\u00a7", "\u03de", "\u03df", "\u03e8"],
	    t: ["\u0141", "\u0166", "\u0373"],
	    u: ["\u01b1", "\u054d"],
	    v: ["\u05d8"],
	    w: ["\u0428", "\u0460", "\u047c", "\u0d70"],
	    x: ["\u04b2", "\u04fe", "\u04fc", "\u04fd"],
	    y: ["\u00a5", "\u04b0", "\u04cb"],
	    z: ["\u01b5", "\u0240"]
	  }
	  text.forEach(function(c){
	    c = c.toLowerCase();
	    var chars = trap[c] || [" "];
	    var rand = Math.floor(Math.random() * chars.length);
	    if (typeof trap[c] !== "undefined") {
	      result += trap[c][rand];
	    } else {
	      result += c;
	    }
	  });
	  return result;
	
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {// please no
	module['exports'] = function zalgo(text, options) {
	  text = text || "   he is here   ";
	  var soul = {
	    "up" : [
	      '̍', '̎', '̄', '̅',
	      '̿', '̑', '̆', '̐',
	      '͒', '͗', '͑', '̇',
	      '̈', '̊', '͂', '̓',
	      '̈', '͊', '͋', '͌',
	      '̃', '̂', '̌', '͐',
	      '̀', '́', '̋', '̏',
	      '̒', '̓', '̔', '̽',
	      '̉', 'ͣ', 'ͤ', 'ͥ',
	      'ͦ', 'ͧ', 'ͨ', 'ͩ',
	      'ͪ', 'ͫ', 'ͬ', 'ͭ',
	      'ͮ', 'ͯ', '̾', '͛',
	      '͆', '̚'
	    ],
	    "down" : [
	      '̖', '̗', '̘', '̙',
	      '̜', '̝', '̞', '̟',
	      '̠', '̤', '̥', '̦',
	      '̩', '̪', '̫', '̬',
	      '̭', '̮', '̯', '̰',
	      '̱', '̲', '̳', '̹',
	      '̺', '̻', '̼', 'ͅ',
	      '͇', '͈', '͉', '͍',
	      '͎', '͓', '͔', '͕',
	      '͖', '͙', '͚', '̣'
	    ],
	    "mid" : [
	      '̕', '̛', '̀', '́',
	      '͘', '̡', '̢', '̧',
	      '̨', '̴', '̵', '̶',
	      '͜', '͝', '͞',
	      '͟', '͠', '͢', '̸',
	      '̷', '͡', ' ҉'
	    ]
	  },
	  all = [].concat(soul.up, soul.down, soul.mid),
	  zalgo = {};
	
	  function randomNumber(range) {
	    var r = Math.floor(Math.random() * range);
	    return r;
	  }
	
	  function is_char(character) {
	    var bool = false;
	    all.filter(function (i) {
	      bool = (i === character);
	    });
	    return bool;
	  }
	  
	
	  function heComes(text, options) {
	    var result = '', counts, l;
	    options = options || {};
	    options["up"] =   typeof options["up"]   !== 'undefined' ? options["up"]   : true;
	    options["mid"] =  typeof options["mid"]  !== 'undefined' ? options["mid"]  : true;
	    options["down"] = typeof options["down"] !== 'undefined' ? options["down"] : true;
	    options["size"] = typeof options["size"] !== 'undefined' ? options["size"] : "maxi";
	    text = text.split('');
	    for (l in text) {
	      if (is_char(l)) {
	        continue;
	      }
	      result = result + text[l];
	      counts = {"up" : 0, "down" : 0, "mid" : 0};
	      switch (options.size) {
	      case 'mini':
	        counts.up = randomNumber(8);
	        counts.mid = randomNumber(2);
	        counts.down = randomNumber(8);
	        break;
	      case 'maxi':
	        counts.up = randomNumber(16) + 3;
	        counts.mid = randomNumber(4) + 1;
	        counts.down = randomNumber(64) + 3;
	        break;
	      default:
	        counts.up = randomNumber(8) + 1;
	        counts.mid = randomNumber(6) / 2;
	        counts.down = randomNumber(8) + 1;
	        break;
	      }
	
	      var arr = ["up", "mid", "down"];
	      for (var d in arr) {
	        var index = arr[d];
	        for (var i = 0 ; i <= counts[index]; i++) {
	          if (options[index]) {
	            result = result + soul[index][randomNumber(soul[index].length)];
	          }
	        }
	      }
	    }
	    return result;
	  }
	  // don't summon him
	  return heComes(text, options);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var colors = __webpack_require__(4);
	
	module['exports'] = function () {
	
	  //
	  // Extends prototype of native string object to allow for "foo".red syntax
	  //
	  var addProperty = function (color, func) {
	    String.prototype.__defineGetter__(color, func);
	  };
	
	  var sequencer = function sequencer (map, str) {
	      return function () {
	        var exploded = this.split(""), i = 0;
	        exploded = exploded.map(map);
	        return exploded.join("");
	      }
	  };
	
	  addProperty('strip', function () {
	    return colors.strip(this);
	  });
	
	  addProperty('stripColors', function () {
	    return colors.strip(this);
	  });
	
	  addProperty("trap", function(){
	    return colors.trap(this);
	  });
	
	  addProperty("zalgo", function(){
	    return colors.zalgo(this);
	  });
	
	  addProperty("zebra", function(){
	    return colors.zebra(this);
	  });
	
	  addProperty("rainbow", function(){
	    return colors.rainbow(this);
	  });
	
	  addProperty("random", function(){
	    return colors.random(this);
	  });
	
	  addProperty("america", function(){
	    return colors.america(this);
	  });
	
	  //
	  // Iterate through all default styles and colors
	  //
	  var x = Object.keys(colors.styles);
	  x.forEach(function (style) {
	    addProperty(style, function () {
	      return colors.stylize(this, style);
	    });
	  });
	
	  function applyTheme(theme) {
	    //
	    // Remark: This is a list of methods that exist
	    // on String that you should not overwrite.
	    //
	    var stringPrototypeBlacklist = [
	      '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'charAt', 'constructor',
	      'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf', 'charCodeAt',
	      'indexOf', 'lastIndexof', 'length', 'localeCompare', 'match', 'replace', 'search', 'slice', 'split', 'substring',
	      'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight'
	    ];
	
	    Object.keys(theme).forEach(function (prop) {
	      if (stringPrototypeBlacklist.indexOf(prop) !== -1) {
	        console.log('warn: '.red + ('String.prototype' + prop).magenta + ' is probably something you don\'t want to override. Ignoring style name');
	      }
	      else {
	        if (typeof(theme[prop]) === 'string') {
	          colors[prop] = colors[theme[prop]];
	          addProperty(prop, function () {
	            return colors[theme[prop]](this);
	          });
	        }
	        else {
	          addProperty(prop, function () {
	            var ret = this;
	            for (var t = 0; t < theme[prop].length; t++) {
	              ret = colors[theme[prop][t]](ret);
	            }
	            return ret;
	          });
	        }
	      }
	    });
	  }
	
	  colors.setTheme = function (theme) {
	    if (typeof theme === 'string') {
	      try {
	        colors.themes[theme] = __webpack_require__(7)(theme);
	        applyTheme(colors.themes[theme]);
	        return colors.themes[theme];
	      } catch (err) {
	        console.log(err);
	        return err;
	      }
	    } else {
	      applyTheme(theme);
	    }
	  };
	
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var colors = __webpack_require__(4);
	module['exports'] = colors;
	
	// Remark: By default, colors will add style properties to String.prototype
	//
	// If you don't wish to extend String.prototype you can do this instead and native String will not be touched
	//
	//   var colors = require('colors/safe);
	//   colors.red("foo")
	//
	//
	__webpack_require__(10)();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var colors = __webpack_require__(4);
	
	module['exports'] = (function() {
	  return function (letter, i, exploded) {
	    if(letter === " ") return letter;
	    switch(i%3) {
	      case 0: return colors.red(letter);
	      case 1: return colors.white(letter)
	      case 2: return colors.blue(letter)
	    }
	  }
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var colors = __webpack_require__(4);
	
	module['exports'] = (function () {
	  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
	  return function (letter, i, exploded) {
	    if (letter === " ") {
	      return letter;
	    } else {
	      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
	    }
	  };
	})();
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var colors = __webpack_require__(4);
	
	module['exports'] = (function () {
	  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];
	  return function(letter, i, exploded) {
	    return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 1))]](letter);
	  };
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var colors = __webpack_require__(4);
	
	module['exports'] = function (letter, i, exploded) {
	  return i % 2 === 0 ? letter : colors.inverse(letter);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ }
/******/ ])
});
;
//# sourceMappingURL=logger.js.map