import stdout from 'browser-stdout';

export default class Logger {
  constructor({
    name = '',
    stream = process.stdout,
  } = {}) {
    this.stream = stream;
  }

  write(...data) {
    data.forEach(line => this.writeLine(line));
  }

  writeLine(line) {
    this.stream.write(line + '\n');
  }

  log(str) {
    this.write(str);
  }
}
