var SQL = require('sql.js')
const fs = require('fs');

module.exports = class Database  {
  constructor(options = {
    name: null
  }) {

    if(!options.name) { throw new Error("Database: name not defined")};

    let _database = null;
    let _databaseName = options.name.toLowerCase();

    Object.defineProperty(this, 'database', {
      enumerable: true,
      get() {
        return _database;
      }
    });

    Object.defineProperty(this, 'databaseName', {
      enumerable: true,
      get() {
        return _databaseName;
      }
    });

    try {
      let fileBuffer = fs.readFileSync('./sql/' + _databaseName + '.sqlite');
      _database = new SQL.Database(fileBuffer);
    }
    catch (e) {
      if(e.code === 'ENOENT') {
        console.warn('Database: Database file not found, creating in memory database that will be written to file name: ' + _databaseName + ".sqlite");
        _database = new SQL.Database();
      }
    }
  }
}
