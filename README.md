- open root directory in console and type 'node index.js' or 'npm start'
- allow user to supply a CLI argument containing a comma-separated list
  - if no argument is given, load `tags.txt`
- count how many times each list item appears within the objects in `data/*.json` (_note:_ objects can be nested).
- final output should be formatted like this (sorted by most popular tag first):

```
pizza     15
spoon     2
umbrella  0
cats      0
```

- cache the result so that subsequent runs can return the result immediately without needing to process the files.
- use only core modules
- use asynchronous variants of the file IO functions (eg. use `fs.readFile` not `fs.readFileSync`).
- if any of the data files contain invalid JSON, log the error with `console.error` and continue, ignoring that file.
- use latest version of node (at time of writing), but use plain callbacks instead of promises.
