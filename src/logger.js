require('brout');

const inBrowser = process.env.APP_ENV === 'browser';

export class LoggerStream {
  constructor(stream, { type } = {}) {
    this.stream = stream;
  }

  write(line) {
    this.stream.write(line + '\n');
  }
}

LoggerStream.Type = {};
['ERROR', 'LOG'].forEach(type => {
  LoggerStream.Type[type] = type;
});

export default class Logger {
  constructor({
    name = '',
    stream = process.stdout,
    errorStream = process.stderr
  } = {}) {
    this.log = this.log.bind(this);
    this.error = this.error.bind(this);

    this.streams = [];
    this.errorStreams = [];
    this.addStream(stream);
    this.addErrorStream(errorStream);
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

  _resetAccumulators() {
    this.accumulators.logs = [];
    this.accumulators.errors = [];
  }
}

Logger.ERROR_PREFACE = inBrowser ? '' : '(✗)';
