let Query = require('./query');
// let ModelManager = require('./model.manager');

class Model extends Query {
  constructor(options = {
    name: null,
    database: null,
    table: null,
    hidden: [],
    relationships: {}
  }
  ){
    super(options);

    if(!options.name) { throw new Error('Model: no model name')};
    if(!options.database) { throw new Error('Model: no database')}
    if(!options.table) { throw new Error('Model: no table')}

    if(options.name.constructor !== String) { throw new Error('Model: model name is not string')}
    if(options.database.constructor !== String) { throw new Error('Model: database name is not string')}
    if(options.table.constructor !== String) { throw new Error('Model: table name is not string')}

    let _name = options.name;
    let _database = options.database;
    let _table = options.table;
    let _hidden = options.hidden;
    let _relationships = options.relationships;

    //internal
    let _relationshipQueries = [];

    Object.defineProperty(this, 'name', {
      enumerable: true,
      get() {
        return _name;
      }
    });

    Object.defineProperty(this, 'hidden', {
      enumerable: true,
      get() {
        return _hidden;
      }
    });

    Object.defineProperty(this, 'relationships', {
      enumerable: false,
      get() {
        return _relationships;
      }
    });

    Object.defineProperty(this, 'relationshipQueries', {
      enumerable: false,
      get() {
        return _relationshipQueries;
      }
    });
  }

  with(relationshipName, callback) {
    if(!relationshipName) { throw new Error('Model.with: relationship name is not defined')}
    if(relationshipName.constructor !== String) { throw new Error('Model.with: relationship name is not a string')}

    if(!this.relationships[relationshipName]) { throw new Error('Model.with: relationship does not exist on this model')}

    this.relationshipQueries.push({
      relationship: relationshipName,
      callback: callback
    });

    return this;
  }

  get() {
    return new Promise((resolve, reject) => {
      super.get().then((results) => {
        resolve(results);
      });
    });
  }
}

module.exports = Model;
