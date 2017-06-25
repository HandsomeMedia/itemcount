/*eslint no-console: 0*/

const fs = require('fs');
const path = require('path');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\nENTER LIST> '
});
const ItemFreq = require('./itemfreq'); //uses OLOO pattern
const tagFreq = Object.create(ItemFreq);
const dir = './data';

function processFiles(){
  fs.readdir(dir, function(err, files) {
    if (err) throw err;
    let remaining = files.length;
    files.map((name) => {
      return path.join(dir, name);
    }).forEach((path) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;
        try {
          tagFreq.countMatches(JSON.parse(data), 'tags');
        } catch (e) {
          console.error(`\n • Error parsing "${path}". Skipping this file...`);
        }
        if (--remaining === 0){
          printResults();
        }
      });
    });
  });
}

function printResults(){
  const sortedKeys = Object.keys(tagFreq).sort((a,b)=>tagFreq[b]-tagFreq[a]);
  let maxLen = 0;
  sortedKeys.forEach((key)=>{
    maxLen = Math.max(maxLen, key.length);
  });
  console.log('\n   ```');
  sortedKeys.forEach((key)=>{
    const pad = 2 + maxLen - key.length;
    console.log('   ', key, ' '.repeat(pad), tagFreq[key]);
  });
  console.log('\n   ```');
  rl.prompt();
}

rl.prompt();
rl.on('close', () => process.exit(0));
rl.on('line', (line) => {
  if (line.trim()) {
    tagFreq.init(line.split(/\s*,\s*/));
    processFiles();
  } else {
    fs.readFile('./tags.txt', 'utf8', (err, data) => {
      if (err) throw err;
      const arr = data.split(/\r?\n/).filter((str)=>str.trim());
      tagFreq.init(arr);
      processFiles();
    });
  }
});
