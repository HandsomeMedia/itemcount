/*eslint no-console: 0*/

const fs = require('fs');
const path = require('path');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\nENTER LIST> '
});
const memoize = require('./memoize');
const memoProcess = memoize(processData);
let jsonArr;
const dir = './data';
const searchKey = 'tags';
const UserObj = {
  init(items) {
    items.forEach((item) => this[item] = 0);
    return this;
  }
};

function initData(userArr) {
  const resultObj = memoProcess(userArr);
  printResults(resultObj);
}

function processData(userArr) {
  const userObj = Object.create(UserObj).init(userArr);
  jsonArr.forEach(findKeys);
  return userObj;

  function findKeys(obj) {
    Object.keys(obj).forEach(function(key) {
      if (key === searchKey) {
        compareVals(obj[key]);
      } else if (obj[key] && typeof obj[key] === 'object') {
        findKeys(obj[key]);
      }
    });
  }

  function compareVals(arr) {
    if (arr === null) return;
    Object.keys(userObj).forEach((item) => {
      if (arr.includes(item)) userObj[item]++;
    });
  }

}

function printResults(obj) {
  const sortedKeys = Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
  let maxLen = 0;
  sortedKeys.forEach((key) => {
    maxLen = Math.max(maxLen, key.length);
  });
  console.log('\n - List results:');
  console.log('\n   ```');
  sortedKeys.forEach((key) => {
    const pad = 2 + maxLen - key.length;
    console.log('   ', key, ' '.repeat(pad), obj[key]);
  });
  console.log('\n   ```');
  rl.prompt();
}

rl.on('close', () => process.exit(0));
rl.on('line', (line) => {
  if (line.trim()) {
    const userArr = line.split(/\s*,\s*/);
    initData(userArr);
  } else {
    fs.readFile('./tags.txt', 'utf8', (err, data) => {
      if (err) throw err;
      console.log('\n - Default list loaded.');
      const userArr = data.split(/\r?\n/).filter((str) => str.trim());
      initData(userArr);
    });
  }
});

fs.readdir(dir, function(err, files) {
  if (err) throw err;
  const arr = [];
  let num = files.length;
  console.log(`\n - Loading ${num} files from ${dir}...`);
  files.forEach((name) => {
    fs.readFile(path.join(dir, name), 'utf8', (err, data) => {
      if (err) throw err;
      try {
        arr.push(JSON.parse(data));
      } catch (e) {
        console.error(`\n - Error parsing ${name}. Skipping...`);
      }
      if (--num === 0) {
        jsonArr = arr;
        console.log('\n - Files loaded.');
        rl.prompt();
      }
    });
  });
});
