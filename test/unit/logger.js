import { times, merge, append, allUniq, values } from 'ramda';
import { lorem } from 'faker';

import StreamBuffer from 'stream-buffers';
import Logger, { LoggerStream } from '../../src/logger';

const newStream = () => new StreamBuffer.WritableStreamBuffer();
const inBrowser = process.env.APP_ENV === 'browser';

describe('LoggerStream', () => {
  describe('Type', () => {
    it('has unique values', () => {
      const vals = values(LoggerStream.Type);
      expect(allUniq(vals)).to.be.true;
    });
  });
});

describe('logger', () => {
  describe('log function', () => {
    let logger;
    let testStrings;
    let output;
    beforeEach(() => {
      testStrings = times(() => lorem.sentence(), 5);
      const stream = newStream();
      logger = new Logger({
        stream,
      });
      spy(logger, 'log');

      testStrings.forEach(string => {
        logger.log(string);
      });

      output = stream.getContentsAsString();
    });

    it('should have been run the correct number of times', () => {
      // if this is not true, the test is probably broken
      expect(logger.log).to.have.callCount(testStrings.length);
    });

    it('includes what is passed to it', () => {
      testStrings.forEach(str => {
        expect(output).to.include(str);
      });
    });

    it('logs the correct number of lines', () => {
      const parts = output.split(/\n/);
      expect(parts.length).to.eql(testStrings.length + 1);
      expect(parts.pop()).to.satisfy(tail => tail.length === 0);
    });
  });

  describe('error function', () => {
    let numStrings;
    let errorStrings;
    let logStrings;
    let errorLog;
    let log;
    let logger;
    beforeEach(() => {
      numStrings = Math.ceil(Math.random() * 20);
      const testStrings = times(() => lorem.sentence(), numStrings);

      const [stream, errorStream] = [newStream(), newStream()];
      logger = new Logger({ stream, errorStream });

      spy(logger, 'error');
      spy(logger, 'log');

      const result = testStrings.reduce((state, str) => {
        const error = str => {
          logger.error(str);
          return merge(state, {
            errorStrings: append(str, state.errorStrings),
          });
        };

        const log = str => {
          logger.log(str);
          return merge(state, { logStrings: append(str, state.logStrings) });
        };

        // make sure there's at least one error string
        if (state.errorStrings.length === 0) {
          return error(str);
        } else if (state.logStrings.length === 0 || Math.random() > 0.75) {
          return log(str);
        } else {
          return error(str);
        }
      }, {
        errorStrings: [],
        logStrings: [],
      });
      errorStrings = result.errorStrings;
      logStrings = result.logStrings;
      errorLog = errorStream.getContentsAsString();
      log = stream.getContentsAsString();
    });

    it('test is behaving properly', () => {
      expect(errorStrings.length + logStrings.length).to.eql(numStrings);
      expect(logger.error.callCount + logger.log.callCount)
        .to.eql(numStrings);
    });

    it('doesn\'t interfere with regular logging', () => {
      expect(log.length).to.not.eql(0);
    });

    it('logs all errors', () => {
      errorStrings.forEach(str => {
        expect(errorLog).to.include(str);
      });
    });

    it('has the correct number of lines', () => {
      const lines = errorLog.split(/\n/);
      expect(lines).to.have.lengthOf(errorStrings.length + 1);
      expect(lines.pop()).to.have.lengthOf(0);
    });
  });

  describe('silence', () => {
    let logger;
    let loudString;
    let quietString;
    let output;
    let error;
    beforeEach(() => {
      const stream = newStream();
      const errorStream = newStream();
      logger = new Logger({ stream, errorStream });

      loudString = lorem.sentence();
      logger.log(loudString);
      logger.error(loudString);
      logger.silence();
      quietString = lorem.sentence();
      logger.log(quietString);
      logger.error(quietString);
      logger.unsilence();
      logger.log(loudString);
      logger.error(loudString);

      output = stream.getContentsAsString();
      error = errorStream.getContentsAsString();
    });

    it('doesn\'t write anything to the stream', () => {
      expect(output, 'output includes loud string').to.include(loudString);
      expect(output, 'output doesn\'t include quiet string').to.not.include(quietString);

      expect(error, 'error includes loud string').to.include(loudString);
      expect(error, 'error doesn\'t include quiet string').to.not.include(quietString);
    });

    it('still stores history', () => {
      expect(logger.history.errors).to.have.lengthOf(3);
      const errorHistoryJoined = logger.history.errors.join('\n');
      expect(errorHistoryJoined).include(loudString).and.include(quietString);
      expect(logger.history.log).to.have.lengthOf(3);
      const logHistoryJoined = logger.history.log.join('\n');
      expect(logHistoryJoined).to.include(loudString).and.include(quietString);
    });
  });

  describe('pause/resume/dump', () => {
    let logger;
    let earlyString;
    let lateString;
    let output;
    let error;
    beforeEach(() => {
      const stream = newStream();
      const errorStream = newStream();

      output = (() => {
        let _output = '';
        return () => _output += stream.getContentsAsString() || '';
      })();
      error = (() => {
        let _error = '';
        return () => _error += errorStream.getContentsAsString() || '';
      })();

      logger = new Logger({ stream, errorStream });
      earlyString = lorem.sentence();
      lateString = lorem.sentence();
      logger.log(earlyString);
      logger.error(earlyString);
      logger.pause();
      logger.log(lateString);
      logger.error(lateString);
    });

    it('temporarily suppresses output', () => {
      expect(output(), 'log includes string before pause but not after')
        .to.include(earlyString).and.not.include(lateString);
      expect(error(), 'error includes string before pause but not after')
        .to.include(earlyString).and.not.include(lateString);
      expect(logger.paused).to.be.true;
      logger.resume();
      expect(logger.paused).to.be.false;
      expect(output()).to.include(lateString);
      expect(error()).to.include(lateString);
    });

    it('destroys its cache with dump', () => {
      logger.dump();
      expect(logger.paused).to.be.false;
      expect(output()).to.not.include(lateString);
      expect(error()).to.not.include(lateString);
    });
  });

  describe('tap', () => {
    let resolver;
    let failer;
    let message;
    let preface;
    let logger;
    beforeEach(() => {
      const [stream, errorStream] = [newStream(), newStream()];
      logger = new Logger({ stream, errorStream });

      preface = lorem.sentence();
      message = lorem.sentence();
      resolver = new Promise(res => res(message))
        .then(logger.tap(preface))
        .then(s => s);

      failer = new Promise((res, rej) => rej(message))
        .catch(logger.tapError(preface))
        .catch(s => s);
    });

    it('does not interrupt Promise flow', done => {
      Promise.all([resolver, failer]).then(([resolution, failure]) => {
        expect(resolution).to.eql(message);
        expect(failure).to.eql(message);
        done();
      });
    });

    it('successfully logs', () => {
      Promise.all([resolver, failer]).then(() => {
        expect(logger.history.log[0]).to.include(preface).and.include(message);
        expect(logger.history.errors[0]).to.include(preface).and.include(message);
      });
    });
  });
});
