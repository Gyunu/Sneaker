const Database = require('./database');

class DatabaseManager  {

  constructor() {
    let _databases = {};

    Object.defineProperty(this, 'databases', {
      enumerable: true,
      get() {
        return _databases;
      }
    });
  }

  loadDatabase(options = {
    name: null
  }) {
    this.databases[options.name] = new Database({
      name: options.name
    });
  }

  delete(options = {
    name: null
  }) {
    this.databases[options.name] = null;
    fs.unlink('./sql/' + options.name + '.sqlite');
  }

  migrate() {
    //run all migrations
  }

  seed() {
    //run all seeds
  }
}

let databaseManager = new DatabaseManager();
module.exports = databaseManager;
