let Databases = require('../databases');

const QueryType = {
  SELECT: 1,
  UPDATE: 2,
  DELETE: 3,
  INSERT: 4
}

class Query {
  constructor() {

    let _selects = {
      columns: [],
      table: null
    };
    let _wheres = [];
    let _joins = [];
    let _updates = [];
    let _inserts = [];
    let _deletes = [];
    let _type = null;
    let _table = null;

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

    Object.defineProperty(this, 'joins', {
      enumerable: false,
      get() {
        return _joins;
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

    Object.defineProperty(this, 'deletes', {
      enumerable: false,
      get() {
        return _deletes;
      },
      set(value) {
        _deletes = value;
      }
    });
  }

  insert(insertObject) {
    if(this.type && this.type !== QueryType.INSERT) { throw new Error('Query.insert: Query is of type ', this.type)}
    this.type = QueryType.INSERT;

    if(insertObject.constructor === Object) {
      this.inserts.push(insertObject);
    }
    return this;
  }

  delete() {
    if(this.type && this.type !== QueryType.DELETE) { throw new Error('Query.delete: Query is of type ', this.type)}
    this.type = QueryType.DELETE;
    return {
      where: (column) => {
        if(column.constructor === String) {
          return {
            equals: (value) => { this.deletes.push(this.buildDeleteClause(column, '=', value)); return this;},
            notEquals: (value) => { this.deletes.push(this.buildDeleteClause(column, '!=', value)); return this; },
            greaterThan: (value) => { this.deletes.push(this.buildDeleteClause(column, '>', value)); return this; },
            lessThan: (value) => { this.deletes.push(this.buildDeleteClause(column, '<', value)); return this; },
            like: (value) => { this.deletes.push(this.buildDeleteClause(column, 'like', '%'+value+'%')); return this;}
          }
        }
        else {
          throw new Error('Query.delete.where: column is not a string');
        }
      }
    }
  }

  select(column = undefined) {
    if(this.type && this.type !== QueryType.SELECT) { throw new Error('Query.select: Query is of type ', this.type)}
    this.type = QueryType.SELECT;

    return {
      from: (table) => {
        let columns = [];
        this.table = table;

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
          columns: columns,
          table: table
        }

        this.selects = selectClause;
        return this;
      }
    }
  }

  update(column = undefined) {
    if(this.type && this.type !== QueryType.UPDATE) { throw new Error('Query.update: Query is of type ', this.type)}
    this.type = QueryType.UPDATE;
    if(column.constructor === String) {
      return {
        with: (value) => { this.updates.push(this.buildUpdateClause(column, value)); return this; }
      }
    }
    if(column.constructor === Array) {
      return {
        with: (values) => {
          if(values.constructor === Array) {
            if(values.length !== column.length) { throw new Error('Query.update.with: Columns do not match values count');}
            column.forEach((col, index) => {
              this.updates.push(this.buildUpdateClause(col, values[index]));
            });
            return this;
          }
          else {
            throw new Error('Query.update.with: array of values not passed');
          }
        }
      }
    }

    throw new Error('Query.update: argument is not a string or an array');
  }

  where(column = undefined, conditional = undefined) {
    if(column.constructor === String) {
      return {
        equals: (value) => { this.wheres.push(this.buildWhereClause(column, '=', value, conditional)); return this;},
        notEquals: (value) => { this.wheres.push(this.buildWhereClause(column, '!=', value, conditional)); return this; },
        greaterThan: (value) => { this.wheres.push(this.buildWhereClause(column, '>', value, conditional)); return this; },
        lessThan: (value) => { this.wheres.push(this.buildWhereClause(column, '<', value, conditional)); return this; },
        like: (value) => { this.wheres.push(this.buildWhereClause(column, 'like', '%'+value+'%', conditional)); return this;},
        between: (start) => { return {
          and: (end) => { this.wheres.push(this.buildWhereBetweenClause(column, start, end, conditional)); return this;}
        }}
      }
    }
    else {
      throw new Error('Query.where: column is not a string');
    }
  }

  andWhere(column = undefined) {
    return this.where(column, 'AND');
  }

  orWhere(column = undefined) {
    return this.where(column, 'OR');
  }


  join(table = undefined, type = 'INNER') {
    if(table.constructor === String) {
      return {
        on: (column) => {
          if(column.constructor === String) {
            return {
              equals: (value) => { this.joins.push(this.buildJoinClause(type, table, column, '=', value)); return this;},
            }
          }
          else {
            throw new Error('Query.join.on: column is not a string');
          }
        }
      }
    }
    else {
      throw new Error('Query.join: table name is not a string');
    }
  }

  buildJoinClause(type = 'INNER', table = undefined, joinColumn = undefined, predicate = undefined, value = undefined) {
    return {
      type: type,
      table: table,
      joinColumn: joinColumn,
      predicate: predicate,
      value: value
    }
  }

  buildWhereClause(column = undefined, predicate = undefined, value = undefined, conditional = undefined) {
    return {
      column: column,
      predicate: predicate,
      value: value,
      conditional: conditional
    }
  }

  buildWhereBetweenClause(column = undefined, start = undefined, end = undefined, conditional = undefined) {
    return {
      column: column,
      predicate: 'between',
      start: start,
      end: end,
      conditional: conditional
    }
  }

  buildUpdateClause(column, value) {
    return {
      column: column,
      value: value
    }
  }

  buildUpdateClause(column, value) {
    return {
      column: column,
      value: value
    }
  }

  buildDeleteClause(column = undefined, predicate = undefined, value = undefined) {
    return {
      column: column,
      predicate: predicate,
      value: value
    }
  }

  buildSelectSQL() {
    let query = `SELECT `;

    query += this.selects.columns.reduce((acc, column) => {
      return acc + `${this.selects.table}.'${column}', `;
    }, '');

    //remove trailing comma and space.
    query = query.slice(0, -2);
    query += ` FROM ${this.selects.table}`;

    return query;
  }

  buildWhereSQL() {
    let query = '';
    let binds = {};

    query += this.wheres.reduce((acc, where, index) => {
      let statement = ``;
      if(where.conditional) {
        switch(where.conditional) {
          case 'AND': {
            statement += `AND `
            break;
          }
          case 'OR': {
            statement += `OR `
            break;
          }
        }
      }
      else {
        statement += `WHERE `
      }

      statement += `${this.table}.'${where.column}' `;

      if(where.predicate == 'between') {
        let bindStart = `:${this.table}_${where.column}_start_${index}`;
        let bindEnd = `:${this.table}_${where.column}_end_${index}`;

        binds[":" + this.table + "_" + where.column + "_start_" + index] = where.start;
        binds[":" + this.table + "_" + where.column + "_end_" + index] = where.end;
        statement += `BETWEEN ${bindStart} AND ${bindEnd} `;
      }
      else {
        let bind = `:${this.table}_${where.column}_${index}`;
        binds[":" + this.table + "_" + where.column + "_" + index] = where.value;
        statement += `${where.predicate} ${bind} `;
      }
      return acc + statement;
    }, '');

    //remove trailing space.
    query = query.slice(0, -1);
    return {
      sql: query,
      binds: binds
    };
  }

  buildSQL() {
    let query = '';
    let binds = null;
    let wheres = null;

    switch(this.type) {
      case QueryType.SELECT: {
        query += this.buildSelectSQL();
        break;
      }
      case QueryType.INSERT: {
        break;
      }
      case QueryType.UPDATE: {
        break;
      }
      case QueryType.DELETE: {
        break;
      }
    }

    wheres = this.buildWhereSQL();

    binds = wheres.binds;
    query += ' ' + wheres.sql;

    return {
      sql: query,
      binds: binds
    };
  }
}

module.exports = Query;
