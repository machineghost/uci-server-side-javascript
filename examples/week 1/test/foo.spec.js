import { expect } from 'chai';
import foo, { bar, baz } from '../src/foo';

describe('foo (a fake module with example functions)', () => {
  // Example of testing a basic (ie. value-returning) function
  describe('foo (inverts its argument)', () => {
    it('inverts the number 5 into -5', () => {
      expect(foo(5)).to.equal(-5);
    });
    it('inverts the number -5 into 5', () => {
      expect(foo(-5)).to.equal(5);
    });
  });

  // Example of testing an asynchronous function
  describe('bar (returns 2x its argument, in 0.5 secs)', () => {
    it('returns 10 when provided 5', async () => {
      const result = await bar(5);
      expect(result).to.equal(10);
    });
    it('returns 5 when provided -2.5', async () => {
      const result = await bar(-2.5);
      expect(result).to.equal(-5);
    });
  });

  // Example of testing a function which requires "stubbing"

  // NOTE: This example "stubs" the console.log function, replacing what it
  //       normally does (ie. log its argument) with an expectation (which 
  //       also has the nice side effect of preventing the function from
  //       adding garbage test values to our test log output)
  describe('baz (logs its argument but adds a "!")', () => {
    let originalLog; // variable to hold onto the original log function
    beforeEach(() => {
      originalLog = console.log; // save the real "console.log"
    });
    it('logs "Hi!" when given "Hi"', () => {
      // Replace console.log with a "stub" that will expect a "hi!" argument
      console.log = messageToLog => expect(messageToLog).to.equal('Hi!');
      baz('Hi');
      // because we had an expectation in our stub, and the previous line
      // called that stub, we have nothing to "assert" here
    });
    afterEach(() => {
      console.log = originalLog; // restore the real "console.log"
    });
  });

});

