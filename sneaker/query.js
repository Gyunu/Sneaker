let Databases = require('../databases');
let fs = require('fs');

class Query {
  constructor() {

    let _wheres = [];
    let _limit = null;
    let _offset = null;
    let _columns = [];
    let _database = null;

    Object.defineProperty(this, 'database', {
      enumerable: true,
      get() {
        return _database;
      }
    });

    Object.defineProperty(this, 'column', {
      enumerable: true,
      get() {
        return _columns;
      }
    });

    Object.defineProperty(this, 'wheres', {
      enumerable: true,
      get() {
        return _wheres;
      }
    });

    Object.defineProperty(this, 'limit', {
      enumerable: false,
      get() {
        return _limit;
      },
      set(value) {
        _limit = parseInt(value);
      }
    });

    Object.defineProperty(this, 'offset', {
      enumerable: false,
      get() {
        return _offset;
      },
      set(value) {
        _offset = parseInt(value);
      }
    });

  }

  buildWhere(column = null, predicate = null, operator = null, value = null) {
    let currentWheres = this.wheres;

    let whereClause = {};

    whereClause.column = column;
    whereClause.predicate = predicate;
    whereClause.value = value;
    whereClause.type = "WHERE";

    if(operator) {
      whereClause.operator = operator;
    }

    currentWheres.push(whereClause);
  }

  buildWhereBetween(column = null, start = null, end = null, operator = null) {
    let currentWheres = this.wheres;
    let whereClause = {};

    whereClause.column = column;
    whereClause.start = start;
    whereClause.end = end;
    whereClause.type = "BETWEEN";

    if(operator) {
      whereClause.operator = operator;
    }

    currentWheres.push(whereClause);
  }

  static allowablePredicates() {
    return ['=', '!=', '>', '<', 'like'];
  }

  create(options = {
    database: null,
    table: null,
    values: null
  }) {
    return new Promise(function(resolve, reject) {
      //stub
      resolve();
    });
  }

  update(options = {
    database: null,
    table: null,
    values: null
  }) {
    let self = this;
    return new Promise(function(resolve, reject) {
      if(!options.table) { throw new Error('Query.update: no table name')};

      let query = `UPDATE`;
      let binds = {};

      query += ` ${options.table}`;
      query += ` ${Query.buildUpdate(options.values, binds)}`;


      self.wheres.forEach(function(clause, index) {
        switch(clause.type) {
          case "WHERE": {
            query += Query.buildWhere(options.table, clause, index, binds);
            break;
          }
          case "BETWEEN": {
            query += Query.buildWhereBetween(options.table, clause, index, binds);
            break;
          }
          default: {
            break;
          }
        }

      });

      let stmt = Databases[options.database].database.prepare(query, binds);
      stmt.bind(binds);
      let result = stmt.run();

      let data = Databases[options.database].database.export();
      let buffer = new Buffer(data);
      fs.writeFileSync(options.database + '.sqlite', buffer);
      resolve();
    });
  }

  select(options = {
    database: null,
    table: null,
    columns: [],
    joins: [],
    hidden: []
  }) {
    let self = this;
    return new Promise(function(resolve, reject) {
      if(!options.table) { throw new Error('Query.where: no table name')};


      //BUILD SELECT

      let rootSelect = Query.buildSelect(options.table, options.columns, options.hidden);

      let query = `SELECT`;
      query += ` ${rootSelect} `;
      query += ` FROM ${options.table}`;

      //WHERE BUILD
      let binds = {};
      self.wheres.forEach(function(clause, index) {
        switch(clause.type) {
          case "WHERE": {
            query += Query.buildWhere(options.table, clause, index, binds);
            break;
          }
          case "BETWEEN": {
            query += Query.buildWhereBetween(options.table, clause, index, binds);
            break;
          }
          default: {
            break;
          }
        }

      });

      if(self.limit) {
        query += ` LIMIT ${options.limit}`;
      }

      if(self.offset) {
        query += ` OFFSET ${options.offset}`;
      }

      // console.log(query);
      // console.log(binds);

      //DATABASE EXECUTION
      let stmt = Databases[options.database].database.prepare(query);
      try {
        stmt.bind(binds);
      }
      catch(e) {
        // console.log(query);
        console.log(e);
      }


      let results = [];

      while(stmt.step()) {
        var row = stmt.getAsObject();
        results.push(row);
      }

      resolve(results);

    });
  }

  static raw(db, sql = null) {
    return new Promise(function(resolve, reject) {
      let results = Databases[db].database.exec(sql);
      resolve(results);
    });
  }

  static rawSync(db, sql = null) {
    return Databases[db].database.exec(sql);
  }

  getColumnNames(db, table) {
    var stmt = Databases[db].database.prepare(`SELECT * FROM ${table}`);
    stmt.step()
    return stmt.getColumnNames();
  }
}

module.exports = Query;
