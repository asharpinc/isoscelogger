import StreamBuffer from 'stream-buffers';
import Logger from '../../src/logger';

const newStream = () => new StreamBuffer.WritableStreamBuffer();

describe('stream buffer', () => {
  describe('basic functionality', () => {
    it('stores data', () => {
      const stream = newStream();
      stream.write('hello friend');
      expect(stream.getContentsAsString()).to.eql('hello friend');
    });
  });
});

describe('logger', () => {
  describe('log function', () => {
    let logger;
    let stream;
    let testStrings;
    beforeEach(() => {
      testStrings = ['help', 'I\'m', 'alive'];
      stream = newStream();
      logger = new Logger({
        stream,
      });
      spy(logger, 'log');

      testStrings.forEach(string => {
        logger.log(string);
      });
    });

    it('should have been run the correct number of times', () => {
      // if this is not true, the test is probably broken
      expect(logger.log.callCount).to.eql(testStrings.length);
    });

    it('output what is passed to it', () => {
      expect(stream.getContentsAsString()).to.eql(testStrings.join('\n') + '\n');
    });
  });
});
