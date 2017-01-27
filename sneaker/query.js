const DatabaseManager = require('./database.manager');

const QueryType = {
  SELECT: 1,
  UPDATE: 2,
  DELETE: 3,
  INSERT: 4
}

class Query {
  constructor(options = {
    table: null,
    database: null
  }) {

    let _selects = {
      columns: [],
      table: null
    };
    let _wheres = {};
    let _updates = {};
    let _inserts = [];
    let _type = null;
    let _table = options.table;
    let _database = options.database;

    let _limitValue = null;
    let _offsetValue = null;

    Object.defineProperty(this, 'table', {
      enumerable: true,
      get() {
        return _table;
      },
      set(value) {
        _table = value;
      }
    });

    Object.defineProperty(this, 'type', {
      enumerable: false,
      get() {
        return _type;
      },
      set(value) {
        _type = value;
      }
    });

    Object.defineProperty(this, 'selects', {
      enumerable: false,
      get() {
        return _selects;
      },
      set(value) {
        _selects = value;
      }
    });

    Object.defineProperty(this, 'wheres', {
      enumerable: false,
      get() {
        return _wheres;
      },
      set(value) {
        _wheres = value;
      }
    });

    Object.defineProperty(this, 'updates', {
      enumerable: false,
      get() {
        return _updates;
      },
      set(value) {
        _updates = value;
      }
    });

    Object.defineProperty(this, 'inserts', {
      enumerable: false,
      get() {
        return _inserts;
      },
      set(value) {
        _inserts = value;
      }
    });

    Object.defineProperty(this, 'database', {
      enumerable: true,
      get() {
        return _database;
      }
    });

    Object.defineProperty(this, 'limitValue', {
      enumerable: true,
      get() {
        return _limitValue;
      },
      set(value) {
        _limitValue = parseInt(value, 10);
      }
    });

    Object.defineProperty(this, 'offsetValue', {
      enumerable: true,
      get() {
        return _offsetValue;
      },
      set(value) {
        _offsetValue = parseInt(value, 10);
      }
    })
  }

  static database(name = undefined) {
    if(!name) { throw new Error('Query.database: no database name passed')}
    if(name.constructor !== String) { throw new Error('Query.database: Database name is not a string')}

    return {
      table: (table = undefined) => {
        if(!table) { throw new Error('Query.table: no table name passed')}
        if(table.constructor !== String) { throw new Error('Query.table: table name is not a string')}

        let instance = new this({
          database: name,
          table: table
        });
        return instance;
      }
    }
  }

  insert(insertArray) {
    if(this.type && this.type !== QueryType.INSERT) { throw new Error('Query.insert: Query is of type ', this.type)}
    this.type = QueryType.INSERT;

    if(insertArray.constructor !== Array) { throw new Error('Query.insert: argument is not an array')};

    this.inserts = this.inserts.concat(insertArray);

    return this;
  }

  delete() {
    if(this.type && this.type !== QueryType.DELETE) { throw new Error('Query.delete: Query is of type ', this.type)}
    this.type = QueryType.DELETE;
    return {
      where: this.where.bind(this)
    }
  }

  select(column = undefined) {
    if(this.type && this.type !== QueryType.SELECT) { throw new Error('Query.select: Query is of type ', this.type)}
    this.type = QueryType.SELECT;

    let columns = [];

    if(column.constructor === String) {
      if(!this.selects.columns.includes(column)) {
        columns = [column];
      }
    }
    if(column.constructor === Array) {
      columns = column.filter((col) => {
        if(!this.selects.columns.includes(col) && col.constructor === String) { return col; }
      });
    }

    columns = this.selects.columns.concat(columns);
    let selectClause = {
      columns: columns
    }

    this.selects = selectClause;
    return this;

  }

  update(update = undefined) {
    if(this.type && this.type !== QueryType.UPDATE) { throw new Error('Query.update: Query is of type ', this.type)}

    this.type = QueryType.UPDATE;
    this.updates = Object.assign({}, this.updates, update);

    return this;
  }

  where(column = undefined, conditional = undefined) {
    if(column.constructor === String) {
      return {
        equals: (value) => { this.addWhereClause(this.buildWhereClause(column, '=', value, conditional)); return this;},
        notEquals: (value) => { this.addWhereClause(this.buildWhereClause(column, '!=', value, conditional)); return this; },
        greaterThan: (value) => { this.addWhereClause(this.buildWhereClause(column, '>', value, conditional)); return this; },
        lessThan: (value) => { this.addWhereClause(this.buildWhereClause(column, '<', value, conditional)); return this; },
        like: (value) => { this.addWhereClause(this.buildWhereClause(column, 'like', '%'+value+'%', conditional)); return this;},
        between: (start) => { return {
          and: (end) => { this.addWhereClause(this.buildWhereBetweenClause(column, start, end, conditional)); return this;}
        }}
      }
    }
    else {
      throw new Error('Query.where: column is not a string');
    }
  }

  addWhereClause(where = undefined) {
    this.wheres = Object.assign({}, this.wheres, where);
  }

  andWhere(column = undefined) {
    return this.where(column, 'AND');
  }

  orWhere(column = undefined) {
    return this.where(column, 'OR');
  }

  buildWhereClause(column = undefined, predicate = undefined, value = undefined, conditional = undefined) {

    let obj = {};
    obj[column] = {
      predicate: predicate,
      value: value,
      conditional: conditional
    }

    return obj;
  }

  buildWhereBetweenClause(column = undefined, start = undefined, end = undefined, conditional = undefined) {

    let obj = {};
    obj[column] = {
      predicate: 'BETWEEN',
      conditional: conditional,
      start: start,
      end: end
    }

    return obj;
  }

  buildInsertSQL() {

    let query = `INSERT INTO ${this.table} `;

    let binds = {};
    let columns = [];
    let values = [];
    let valueSQL = null;
    let columnSQL = null;

    this.inserts.forEach((clause, index) => {
      let value = [];
      for(var col in clause) {
        if(!columns.includes(col)) {
          columns.push(col);
        }
        let bind = `:insert_${col}_${index}`;
        binds[bind] = clause[col];
        value.push(bind);
      }

      values.push(value);
    });

    query += `(${columns.join(', ')})`;
    query += ` VALUES`;
    query += `${ values.map((valueArray) => ' (' + valueArray.join(', ') + ')' )}`;

    return {
      binds: binds,
      sql: query
    }
  }

  buildUpdateSQL() {
    let query = `UPDATE ${this.table} `;
    query += `SET `

    let binds = {};

    for(let col in this.updates) {
      let bind = `:update_${col}`;
      binds[bind] = this.updates[col];

      query += `${this.table}.'${col}' = ${bind}, `;
    }

    //remove trailing comma and space.
    query = query.slice(0, -2);
    query = query.trim();

    return {
      binds: binds,
      sql: query
    }
  }

  buildDeleteSQL() {
    let query = `DELETE FROM ${this.table}`;
    return {
      sql: query
    };
  }

  buildSelectSQL() {
    let query = `SELECT `;

    query += this.selects.columns.reduce((acc, column) => {
      return acc + `${this.table}.'${column}', `;
    }, '');

    //remove trailing comma and space.
    query = query.slice(0, -2);
    query += ` FROM ${this.table}`;

    return query;
  }

  buildWhereSQL() {
    let query = '';
    let binds = {};

    for(let col in this.wheres) {
      let statement = ``;
      if(this.wheres[col].conditional) {
        switch(this.wheres[col].conditional) {
          case 'AND': {
            statement += `AND `;
            break;
          }
          case 'OR': {
            statement += `OR `;
            break;
          }
        }
      }
      else {
        statement += `WHERE `;
      }

      statement += `${this.table}.'${col}' `;

      if(this.wheres[col].predicate == 'BETWEEN') {
        let bindStart = `:${this.table}_${col}_start`;
        let bindEnd = `:${this.table}_${col}_end`;
        binds[bindStart] = this.wheres[col].start;
        binds[bindEnd] = this.wheres[col].end;
        statement += `BETWEEN ${bindStart} AND ${bindEnd} `;
      }
      else {
        let bind = `:${this.table}_${col}`;
        binds[bind] = this.wheres[col].value;
        statement += `${this.wheres[col].predicate} ${bind} `;
      }
      query += statement;
    }

    query = query.trim();

    return {
      sql: query,
      binds: binds
    };
  }

  buildSQL() {
    let query = '';
    let binds = {};
    let queryBinds = null;
    let queryBuild = null;
    let queryWhere = null;

    switch(this.type) {
      case QueryType.SELECT: {
        query += this.buildSelectSQL();
        break;
      }
      case QueryType.INSERT: {
        queryBuild = this.buildInsertSQL();
        query += queryBuild.sql;
        queryBinds = queryBuild.binds;
        break;
      }
      case QueryType.UPDATE: {
        queryBuild = this.buildUpdateSQL();
        query += queryBuild.sql;
        queryBinds = queryBuild.binds;
        break;
      }
      case QueryType.DELETE: {
        queryBuild = this.buildDeleteSQL();
        query += queryBuild.sql;
        break;
      }
    }

    queryWhere = this.buildWhereSQL();

    binds = Object.assign({}, queryBinds, queryWhere.binds);
    query += ' ' + queryWhere.sql;
    query = query.trim();

    if(this.limitValue) { query += ` LIMIT ${this.limitValue}`}
    if(this.offsetValue) { query += ` OFFSET ${this.offsetValue}`}

    return {
      sql: query,
      binds: binds
    };
  }

  limit(value = null) {
    if(value.constructor !== Number) { throw new Error('Query.limit: Limit is not a number')}

    this.limitValue = value;
    return this;
  }

  offset(value = null) {
    if(value.constructor !== Number) { throw new Error('Query.offset: offset is not a number')}

    this.offsetValue = value;
    return this;
  }

  get() {
    return new Promise((resolve, reject) => {
      if(!this.type) {
        reject(Error('Query.get: no query type selected'));
        return;
      }

      let query = this.buildSQL();
      DatabaseManager.databases[this.database].exec(query.sql, query.binds)
      .then((results) => {
        resolve(results);
      });
    });
  }
}

module.exports = Query;
