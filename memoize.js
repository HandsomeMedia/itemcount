/*eslint no-console: 0*/

/*
 * memoize.js
 * by @philogb and @addyosmani
 * with further optimizations by @mathias
 * and @DmitryBaranovsk
 * perf tests: http://bit.ly/q3zpG3
 * Released under an MIT license.
 */

 /*
function memoize(fn) {
  return function() {
    var args = Array.prototype.slice.call(arguments),
      hash = '',
      i = args.length;
    currentArg = null;
    while (i--) {
      currentArg = args[i];
      hash += (currentArg === Object(currentArg)) ?
        JSON.stringify(currentArg) : currentArg;
      fn.memoize || (fn.memoize = {});
    }
    return (hash in fn.memoize) ? fn.memoize[hash] :
      fn.memoize[hash] = fn.apply(this, args);
  };
}
*/

/*
 *https://medium.com/front-end-hacking/today-i-learned-memoization-with-pure-functions-in-es6-33a4765518b5
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
