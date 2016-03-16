import colors from 'colors/safe';
colors.enabled = true;

class LightStream {
  constructor(fn) {
    this.fn = fn;
    this.buff = '';
  }

  write(msg) {
    this.buff += msg;
    this.flush();
  }

  flush() {
    const split = this.buff.split('\n');
    this.buff = split.pop();
    split.forEach(s => this.fn(s || ''));
  }
}

let stdout;
let stderr;
let inBrowser;

if (process && process.stdout) {
  stdout = process.stdout;
  stderr = process.stderr;
  inBrowser = false;
} else {
  stdout = new LightStream(console.log.bind(console));
  stderr = new LightStream(console.error.bind(console));
  inBrowser = true;
}

const templateRegex = /(\%(.)(((\.[\w]*))*))/g;

function timeStamp() {
  const d = new Date();
  // convert number to two digit string
  const two = (num) => ('0' + num).slice(-2);
  return `${ two(d.getHours()) }:${ two(d.getMinutes()) }:${ two(d.getSeconds()) }`;
}

export class LoggerStream {
  constructor(stream, { type, template } = {}) {
    this.stream = stream;
    this.type = type;
    this.template = template;
  }

  write(line) {
    const templatedLine = LoggerStream.templateLine(this.template, { line });
    this.stream.write(templatedLine + '\n');
  }

  get template() {
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
  }

  set template(template) {
    this._template = template;
  }

  static templateLine(template, data) {
    const matches = [];
    for (let match = templateRegex.exec(template);
         match;
         match = templateRegex.exec(template)) {
      matches.push(match);
    }

    return matches.reduce((logString, match) => {
      return logString
        .replace(match[0], LoggerStream.convertSpecification(match, data));
    }, template);
  }

  static convertSpecification(specification, { line }) {
    const character = specification[2];
    const text =
      character === 't' ? timeStamp() :
      character === 'm' ? line        :
      specification[0];

    const modifyString = specification[3];
    const id = (s => s);
    const modify = modifyString.split('.').reduce((modify, modifierString) => {
      if (colors[modifierString]) {
        // compose new modifier onto old
        return s => colors[modifierString](modify(s));
      }

      // throw out unknown modifiers
      return modify;
    }, id);

    return modify(text);
  }
}

LoggerStream.Type = {};
['ERROR', 'LOG'].forEach(type => {
  LoggerStream.Type[type] = type;
});

LoggerStream.DefaultTemplate = '[%t.dim.grey] %m';
LoggerStream.Templates = {};
LoggerStream.CLITemplates = {};
LoggerStream.BrowserTemplates = {};

LoggerStream.CLITemplates[LoggerStream.Type.ERROR] =
  `[%t.dim.grey] ${ colors.red('(✗)') } %m.red`;

export default class Logger {
  constructor({
    name = '',
    stream = stdout,
    errorStream = stderr,
    template,
    errorTemplate,
  } = {}) {
    this.log = this.log.bind(this);
    this.error = this.error.bind(this);
    this.tap = this.tap.bind(this);
    this.tapError = this.tapError.bind(this);

    this.streams = [];
    this.errorStreams = [];
    this.addStream(stream, { template });
    this.addErrorStream(errorStream, { template: errorTemplate || template });
    this.history = {
      errors: [],
      log: [],
    };

    this.accumulators = { };
    this._resetAccumulators();
    this.paused = false;
  }

  addStream(stream, options = { type: LoggerStream.Type.LOG }) {
    const loggerStream = new LoggerStream(stream, options);
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

  addErrorStream(stream, options) {
    this.addStream(stream,
                   Object.assign({ type: LoggerStream.Type.ERROR }, options));
  }

  log(str) {
    this.history.log.push(str);
    if (this.silenced) {
      return;
    }

    if (this.paused) {
      return this.accumulators.logs.push(str);
    }

    this.streams.forEach(s => s.write(str));
  }

  error(str) {
    this.history.errors.push(str);
    if (this.silenced) {
      return;
    }

    if (this.paused) {
      return this.accumulators.errors.push(str);
    }

    this.errorStreams.forEach(s => s.write(str));
  }

  silence() {
    this.silenced = true;
  }

  unsilence() {
    this.silenced = false;
  }

  get paused() {
    return this._paused;
  }

  set paused(newPaused) {
    if (newPaused) {
      this.pause();
    } else {
      this.resume();
    }
    return this.paused;
  }

  pause() {
    this._paused = true;
    this._resetAccumulators();
  }

  resume() {
    this._paused = false;
    this.accumulators.logs.forEach(this.log);
    this.accumulators.errors.forEach(this.error);
  }

  dump() {
    this._resetAccumulators();
    this.resume();
  }

  tap(message = '%0') {
    return val => {
      const finalMessage = message.includes('%0') ?
        message.replace('%0', val) : message + ': ' + val;
      this.log(finalMessage);
      return Promise.resolve(val);
    };
  }

  tapError(message = '%0') {
    return val => {
      const finalMessage = message.includes('%0') ?
        message.replace('%0', val) : message + ': ' + val;
      this.error(finalMessage);
      return Promise.reject(val);
    };
  }

  _resetAccumulators() {
    this.accumulators.logs = [];
    this.accumulators.errors = [];
  }
}
