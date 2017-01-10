var test =  require('./test.database');
let databases = [
  test
];

let databaseExports = {};

databases.forEach(function(database) {
  let d = new database();
  databaseExports[d.databaseName] = d;
});

module.exports = databaseExports;
