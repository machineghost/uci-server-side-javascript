const ONE_HALF_SECOND = 500; // 1000 miliseconds = 1 second

/**
 * Dummy "bar" named export which returns the provided number multiplied by
 * two ... but does it asynchronously
 */
export const bar = number =>
  // This creates a promise which will resolve with 2x the provided number,
  // ... in exactly one second from now
  // NOTE: This code demonstrates how, as great as the async/await keywords
  //       are, we sometimes still need to work with promises
  new Promise(resolve =>
    setTimeout
      (() => resolve(number * 2),
      ONE_HALF_SECOND)
  );

/**
 * Dummy "baz" named export which logs the provided message, but with an
 * exclamation mark added at the end
 */
export const baz = message => console.log(`${message}!`);

/**
 * Dummy "foo" default export which returns a negative version of the provided
 * numeric argument
 */
export default number => -1 * number
