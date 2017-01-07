let Databases = require('../databases');
let fs = require('fs');

class Query {
  constructor(database = undefined, table = undefined) {

    let _wheres = [];
    let _limit = null;
    let _offset = null;
    let _columns = [];
    let _database = database;
    let _table = table;

    Object.defineProperty(this, 'database', {
      enumerable: true,
      get() {
        return _database;
      }
    });

    Object.defineProperty(this, 'table', {
      enumerable: true,
      get() {
        return _table;
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

  database(name) {
    //stub
    return this;
  }

  table(name) {
    //stub
    return this;
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

    return this;
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

    return this;
  }

  static allowablePredicates() {
    return ['=', '!=', '>', '<', 'like'];
  }

  static buildWhere(table, clause, index = 0, binds = null) {
    let query = '';

    if(clause.operator) {
      query += ` ${clause.operator}`;
    }
    else {
      query += ` WHERE`;
    }

    let bind = `:${table}_${clause.column}_${index}`;
    binds[":" + table + "_" + clause.column + "_" + index] = clause.value;

    query += ` ${table}.${clause.column} ${clause.predicate} ${bind}`;

    return query;
  }

  static buildWhereBetween(table, clause, index = 0, binds = null) {
    let query = '';

    if(clause.operator) {
      query += ` ${clause.operator}`;
    }
    else {
      query += ` WHERE`;
    }

    let bindStart = `:${table}_${clause.column}_start_${index}`;
    let bindEnd = `:${table}_${clause.column}_end_${index}`;

    binds[":" + table + "_" + clause.column + "_start_" + index] = clause.start;
    binds[":" + table + "_" + clause.column + "_end_" + index] = clause.end;

    query += ` ${table}.${clause.column} BETWEEN ${bindStart} AND ${bindEnd}`;

    return query;
  }

  static buildSelect(columns = []) {
    if(typeof columns === "Array") {
      return columns.map(function(column) {
        return `${table}.'${column}' AS "${table}.${column}"`;
      });
    }
    else {
      return `* AS "${table}.*"` ;
    }

  }

  static buildUpdate(values = null, binds = null) {
    let query = ` SET `;
    for(var val in values) {
      let bind = `:${val}`;
      binds[bind] = values[val];
      query += ` ${val} = ${bind},`
    }

    return query.slice(0, -1);
  }

  create(options = {
    database: null,
    table: null,
    values: null
  }) {
    return new Promise(function(resolve, reject) {
      //STUB
      resolve();
    });
  }

  update(options = {
    values: null
  }) {
    let self = this;
    return new Promise(function(resolve, reject) {
      if(!self.table) { throw new Error('Query.update: no table name')};

      let query = `UPDATE`;
      let binds = {};

      query += ` ${self.table}`;
      query += ` ${Query.buildUpdate(options.values, binds)}`;


      self.wheres.forEach(function(clause, index) {
        switch(clause.type) {
          case "WHERE": {
            query += Query.buildWhere(self.table, clause, index, binds);
            break;
          }
          case "BETWEEN": {
            query += Query.buildWhereBetween(self.table, clause, index, binds);
            break;
          }
          default: {
            break;
          }
        }

      });

      let stmt = Databases[self.database].database.prepare(query, binds);
      stmt.bind(binds);
      let result = stmt.run();

      let data = Databases[self.database].database.save();
      resolve();
    });
  }

  select(options = {
    columns: []
  }) {
    let self = this;
    return new Promise(function(resolve, reject) {
      if(!this.table) { throw new Error('Query.where: no table name')};


      //BUILD SELECT
      let rootSelect = Query.buildSelect(options.columns);

      let query = `SELECT`;
      query += ` ${rootSelect} `;
      query += ` FROM ${self.table}`;

      //WHERE BUILD
      let binds = {};
      self.wheres.forEach(function(clause, index) {
        switch(clause.type) {
          case "WHERE": {
            query += Query.buildWhere(self.table, clause, index, binds);
            break;
          }
          case "BETWEEN": {
            query += Query.buildWhereBetween(self.table, clause, index, binds);
            break;
          }
          default: {
            break;
          }
        }

      });

      if(self.limit) {
        query += ` LIMIT ${self.limit}`;
      }

      if(self.offset) {
        query += ` OFFSET ${self.offset}`;
      }

      //DATABASE EXECUTION
      let stmt = Databases[self.database].database.prepare(query);
      try {
        stmt.bind(binds);
      }
      catch(e) {
        throw new Error(e);
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
    stmt.run()
    return stmt.getColumnNames();
  }
}

module.exports = Query;
