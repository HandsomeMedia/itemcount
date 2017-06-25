/*eslint no-console: 0*/

module.exports = {
  init(items) {
    this.reset();
    items.forEach((item) => this[item] = 0);
  },
  countMatches(fileObj, keyName) {
    const findKeys = (obj) => {
      Object.keys(obj).forEach(function(key) {
        if (key === keyName) {
          compareVals(obj[key]);
        } else if (obj[key] && typeof obj[key] === 'object') {
          findKeys(obj[key]);
        }
      });
    };

    const compareVals = (arr) => {
      if (arr === null) return;
      Object.keys(this).forEach((item) => {
        if (arr.includes(item)) this[item]++;
      });
    };
    findKeys(fileObj);
  },
  reset(){
    Object.keys(this).forEach((item)=>delete this[item]);
  }
};
