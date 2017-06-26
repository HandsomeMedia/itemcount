/*eslint no-console: 0*/

const dir = './data';
const searchKey = 'tags';
const fs = require('fs');
const path = require('path');
const memoize = require('./memoize');
const memoProcessData = memoize(processData);
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\n ENTER LIST> '
});
const jsonArr = [];
const UserObj = {
  init(items) {
    items.forEach((item) => this[item] = 0);
    return this;
  },
  print() {
    const sortedKeys = Object.keys(this).sort((a, b) => this[b] - this[a]);
    let maxLen = 0;
    sortedKeys.forEach((key) => {
      maxLen = Math.max(maxLen, key.length);
    });
    console.log('\n - Output:');
    console.log('\n   ```');
    sortedKeys.forEach((key) => {
      const pad = 2 + maxLen - key.length;
      console.log('   ', key, ' '.repeat(pad), this[key]);
    });
    console.log('\n   ```');
    rl.prompt();
  }
};

fs.readdir(dir, function(err, files) {
  if (err) throw err;
  let num = files.length;
  console.log(`\n - Loading ${num} files from ${dir}`);
  files.forEach((name) => {
    fs.readFile(path.join(dir, name), 'utf8', (err, data) => {
      if (err) throw err;
      try {
        jsonArr.push(JSON.parse(data));
      } catch (e) {
        console.error(`\n - Skipping file '${name}': JSON parsing error`);
      }
      if (--num === 0) {
        console.log('\n - Files loaded.');
        rl.prompt();
      }
    });
  });
});

rl.on('line', (line) => {
  if (line.trim()) {
    const userArr = line.split(/\s*,\s*/);
    onInput(userArr);
  } else {
    fs.readFile('./tags.txt', 'utf8', (err, data) => {
      if (err) throw err;
      console.log('\n - Default list loaded.');
      const userArr = data.split(/\r?\n/).filter((str) => str.trim());
      onInput(userArr);
    });
  }
}).on('close', () => process.exit(0));

function onInput(userArr){
  const resultObj = memoProcessData(userArr);
  resultObj.print();
}

function processData(userArr) {
  const userObj = Object.create(UserObj).init(userArr);
  let flattened = [];
  getKeyVals(jsonArr);
  flattened.forEach((val) => {
    if (val === null) return;
    Object.keys(userObj).forEach((item) => {
      if (item === val) userObj[item]++;
    });
  });
  return userObj;

  function getKeyVals(obj) {
    Object.keys(obj).forEach((key) => {
      if (key === searchKey) {
        flattened = flattened.concat(obj[key]);
      } else if (obj[key] && typeof obj[key] === 'object') {
        getKeyVals(obj[key]); //recursive
      }
    });
  }
}
