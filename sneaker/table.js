class Table {

  constructor(tableName) {
    this.columns = {};
  }

  integer(columnName, size = 128) {
    let self = this;
    let statement = ` ${columnName} integer(${size})`;

    this.columns[columnName] = statement;

    let def = function(value) {
      self.columns[columnName] += ` DEFAULT(${value})`
    }

    let notNull = function() {
      self.columns[columnName] += ` NOT NULL`;
    }

    return {
      notNull() {
        return {
          default: def
        }
      },
      default(value) {
        return {
          notNull: notNull
        }
      }
    }
  }

  varchar(columnName, size = 255) {
    let self = this;
    let statement = ` ${columnName} varchar(${size})`;
    this.columns[columnName] = statement;

    let def = function(value) {
      self.columns[columnName] += ` DEFAULT(${value})`
    }

    let notNull = function() {
      self.columns[columnName] += ` NOT NULL`;
    }

    return {
      notNull() {
        return {
          default: def
        }
      },
      default(value) {
        return {
          notNull: notNull
        }
      }
    }
  }

  blob(columnName, size = 255) {
    let self = this;
    let statement = ` ${columnName} blob(${size})`;
    this.columns[columnName] = statement;

    let def = function(value) {
      self.columns[columnName] += ` DEFAULT(${value})`
    }

    let notNull = function() {
      self.columns[columnName] += ` NOT NULL`;
    }

    return {
      notNull() {
        return {
          default: def
        }
      },
      default(value) {
        return {
          notNull: notNull
        }
      }
    }
  }

  char(columnName, size = 255) {
    let self = this;
    let statement = ` ${columnName} char(${size})`;
    this.columns[columnName] = statement;

    let def = function(value) {
      self.columns[columnName] += ` DEFAULT(${value})`
    }

    let notNull = function() {
      self.columns[columnName] += ` NOT NULL`;
    }

    return {
      notNull() {
        return {
          default: def
        }
      },
      default(value) {
        return {
          notNull: notNull
        }
      }
    }
  }

  double(columnName, size = 255) {
    let self = this;
    let statement = ` ${columnName} double(${size})`;
    this.columns[columnName] = statement;

    let def = function(value) {
      self.columns[columnName] += ` DEFAULT(${value})`
    }

    let notNull = function() {
      self.columns[columnName] += ` NOT NULL`;
    }

    return {
      notNull() {
        return {
          default: def
        }
      },
      default(value) {
        return {
          notNull: notNull
        }
      }
    }
  }

  float(columnName, size = 255) {
    let self = this;
    let statement = ` ${columnName} float(${size})`;
    this.columns[columnName] = statement;

    let def = function(value) {
      self.columns[columnName] += ` DEFAULT(${value})`
    }

    let notNull = function() {
      self.columns[columnName] += ` NOT NULL`;
    }

    return {
      notNull() {
        return {
          default: def
        }
      },
      default(value) {
        return {
          notNull: notNull
        }
      }
    }
  }

  nvarchar(columnName, size = 255) {
    let self = this;
    let statement = ` ${columnName} nvarchar(${size})`;
    this.columns[columnName] = statement;

    let def = function(value) {
      self.columns[columnName] += ` DEFAULT(${value})`
    }

    let notNull = function() {
      self.columns[columnName] += ` NOT NULL`;
    }

    return {
      notNull() {
        return {
          default: def
        }
      },
      default(value) {
        return {
          notNull: notNull
        }
      }
    }
  }

  text(columnName, size = 255) {
    let self = this;
    let statement = ` ${columnName} text(${size})`;
    this.columns[columnName] = statement;

    let def = function(value) {
      self.columns[columnName] += ` DEFAULT(${value})`
    }

    let notNull = function() {
      self.columns[columnName] += ` NOT NULL`;
    }

    return {
      notNull() {
        return {
          default: def
        }
      },
      default(value) {
        return {
          notNull: notNull
        }
      }
    }
  }
}


module.exports = Table;
