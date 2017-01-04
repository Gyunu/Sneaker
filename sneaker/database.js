let SQL = require('sql.js');
let fs = require('fs');

class Database  {
  constructor(options = {
    name: null
  }) {

    if(!options.name) { throw new Error("Database: name not defined")};

    let _database = null;
    let _databaseName = options.name;

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
      let fileBuffer = fs.readFileSync('./sql/' + options.name + '.sqlite');
      _database = new SQL.Database(fileBuffer);
    }
    catch (e) {
      if(e.code === 'ENOENT') {
        console.warn('Schema: Database file not found, creating in memory database that will be written to file name: ' + options.name);
        _database = new SQL.Database();
        this.save();
      }
    }
  }

  save() {
    let data = this.database.export();
    let buffer = new Buffer(data);
    fs.writeFileSync('./sql/' + this.databaseName + '.sqlite', buffer);
  }
}

module.exports = Database;
