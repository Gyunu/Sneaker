let SQL = require('sql.js');
let fs = require('fs');

class Database  {
  constructor(options = {
    name: null
  }) {
    if(!options.name) { throw new Error("Database: name not defined")};

    Object.defineProperty(this, 'database', {
      enumerable: true,
      get() {
        return _database;
      },
      set(value) {
        _database = value;
      }
    });

    Object.defineProperty(this, 'name', {
      enumerable: true,
      get() {
        return _name;
      }
    });

    let _database = null;
    let _name = options.name;

    this.open();
  }

  open() {
    try {
      let fileBuffer = fs.readFileSync('./sql/' + this.name + '.sqlite');
      this.database = new SQL.Database(fileBuffer);
      return this;
    }
    catch (e) {
      if(e.code === 'ENOENT') {
        console.warn('Schema: Database file not found, creating in memory database that will be written to file name: ' + this.name);
        this.database = new SQL.Database();
        this.save();
        return this;
      }
    }
  }

  close() {
    this.database.close();
  }

  save() {
    let data = this.database.export();
    let buffer = new Buffer(data);
    fs.writeFileSync('./sql/' + this.databaseName + '.sqlite', buffer);
  }

  exec(sql, binds) {
    let t0 = process.hrtime();

    return new Promise((resolve, reject) => {

      let stmt = this.database.prepare(sql);
      stmt.bind(binds);

      let results = [];
      while(stmt.step()) {
        let row = stmt.getAsObject();
        results.push(row);
      };

      let object = {};
      object.data = results;
      object.metadata = {};
      object.metadata.sql = sql;
      object.metadata.binds = binds;
      object.metadata.rowsModified = this.database.getRowsModified();

      stmt.free();

      object.metadata.executionTime = (process.hrtime(t0)[1]);

      resolve(object);

    });
  }

  execSync() {

  }
}

module.exports = Database;
