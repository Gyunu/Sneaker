const Test = require('./test.database');
let databases = [
  Test
];

let databaseExports = {};

databases.forEach(function(database) {
  let d = new database();
  databaseExports[d.databaseName] = d;
});

module.exports = databaseExports;
