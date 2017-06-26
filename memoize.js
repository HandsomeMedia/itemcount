/*eslint no-console: 0*/

/*
 * Memoize function is optized for simplicity not performance.
 * See here for more advanced implementations:
 * https://addyosmani.com/blog/faster-javascript-memoization/
*/

module.exports = fn => {
  const cache = {};
  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    if(!cache[stringifiedArgs]){
      cache[stringifiedArgs] = fn(...args);
    }else{
      console.log('\n - Using cached results.');
    }
    return cache[stringifiedArgs];
  };
};
