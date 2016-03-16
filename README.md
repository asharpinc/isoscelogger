# logger

A good old-fashioned logger

### What is this

This is a logger. Its uses are numeral. It can log to anything that is a stream, but defaults to
stdout and stderr. It is intended to look good both in browser and CLI (I think its file output
leaves a lot to be desired atm)

### Usage and examples

```javascript
import Logger from 'logger';
const console = new Logger();

console.log('hello'); // => [timestamp] hello
console.error('err'); // => [timestamp] (✗) err

// Logger also has tap functions for use with Promises
Promise.resolve('nick')
  .then(console.tap('hey there')) // => [timestamp] hey there: nick
  .then(console.tap())            // => [timestamp] nick
  .then(val => console.log(val)); // => [timestamp] nick

Promise.reject('ben')
  .catch(console.tapError('hello')) // => [timestamp] (✗) hello: ben
  .catch(val => console.error(val)); // => [timestamp] (✗) ben

Promise.resolve('rafa')
  .then(console.tap('interpolate %0 in')) // => [timestamp] interpolate rafa in
  .then(val => console.log(val)) // => [timestamp] rafa

// You can silence logs
console.log('mama bear'); // => [timestamp] mama bear
console.silence(); // or console.silenced = true
console.log('papa bear'); // prints nothing
console.unsilence(); // or console.silenced = false
console.log('baby bear'); // => [timestamp] baby bear

// or pause/unpause them
console.log('zip'); // => [timestamp] zip
console.pause(); // or console.paused = true
console.log('zap'); // prints nothing
console.unpause(); // or console.paused = false
                   // => [timestamp] zap
console.log('pow'); // => [timestamp] pow

// you can dump in the middle of a pause
console.paused = true;
console.log('Sarah'); // prints nothing
console.dump();
console.error('Ari'); // prints nothing
console.log('Camille'); // prints nothing
console.paused = false; // => [timestamp] Camille
                        // => [timestamp] (✗) Ari
```
