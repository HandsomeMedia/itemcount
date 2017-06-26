/*eslint no-console: 0*/

const dir = './data'; // path to JSON data
const searchKey = 'tags'; // key to search
const fs = require('fs');
const path = require('path');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\n ENTER LIST> '
});
const memoize = require('./memoize'); // memoization - see README file
const memoProcessData = memoize(processData); // wrap iterative process function for memoization
const jsonData = []; // JSON data store
const InputObj = { // user input prototype
  init(items) {
    items.forEach((item) => this[item] = 0); // populate user keys and set count values to 0
    return this;
  },
  print() {
    const sortedKeys = Object.keys(this).sort((a, b) => this[b] - this[a]); // sort by large to small
    let maxLen = 0;
    sortedKeys.forEach((key) => {
      maxLen = Math.max(maxLen, key.length); // print format: get longest str length
    });
    console.log('\n - Output:');
    console.log('\n   ```');
    sortedKeys.forEach((key) => {
      const pad = 2 + maxLen - key.length;  // print format: chars needed for each key to have equal length
      console.log('   ', key, ' '.repeat(pad), this[key]); // print format: space + key + extra spaces + value
    });
    console.log('\n   ```');
    rl.prompt();
  }
};

// SET UP UI HANDLERS
rl.on('line', (line) => {
  if (line.trim()) {
    onInput(line, ','); // if input is not '', send for formatting, specify delimiter
  } else {
    fs.readFile('./tags.txt', 'utf8', (err, data) => { // if input is '', load default using async
      if (err) throw err;
      console.log('\n - Default list loaded.');
      onInput(data, '\n'); // send for formatting, specify delimiter
    });
  }
}).on('close', () => process.exit(0));

// READ JSON FILES FROM DIR USING ASYNC
fs.readdir(dir, (err, files)=>{
  if (err) throw err;
  let num = files.length;
  console.log(`\n - Loading ${num} files from ${dir}`);
  files.forEach((name) => {
    fs.readFile(path.join(dir, name), 'utf8', (err, data) => {
      if (err) throw err;
      try {
        jsonData.push(JSON.parse(data)); // test for valid JSON
      } catch (e) {
        console.error(`\n - Skipping file '${name}': JSON parsing error`);
      }
      if (--num === 0) { // decrement until all files read
        console.log('\n - Files loaded.');
        rl.prompt(); // show initial prompt
      }
    });
  });
});

// FORMAT INPUT AND SEND FOR PROCESSING
function onInput(data, delimiter){
  const inputArr = data.split(delimiter).reduce((arr, str)=>{
    const trimmed = str.trim(); // remove new lines or whitespace e.g. "item1,item2, item3, item4  ,"
    if(trimmed) arr.push(trimmed); // push only non-empty items
    return arr;
  }, []);
  memoProcessData(inputArr).print(); // memoize process and print return data
}

// PROCESS DATA
function processData(inputArr) { // process function is wrapped/called by memoize
  const inputObj = Object.create(InputObj).init(inputArr); // create object and use prototype to initialize input keys with value = 0
  let jsonVals = []; // store values for all instances of searchKey
  getKeyVals(jsonData); // search for values
  jsonVals.forEach((val) => {
    if (val === null) return; // discard null values
    Object.keys(inputObj).forEach((item) => {
      if (item === val) inputObj[item]++; // compare input key with JSON value, increment input count value if match found
    });
  });
  return inputObj; // return object updated with match counts

  function getKeyVals(obj) { // recursive function to traverse JSON and get searchKey values
    Object.keys(obj).forEach((key) => {
      if (key === searchKey) { // searchKey can be dynamic - set at top of program
        jsonVals = jsonVals.concat(obj[key]);
      } else if (obj[key] && typeof obj[key] === 'object') {
        getKeyVals(obj[key]); // nested object found
      }
    });
  }
}
