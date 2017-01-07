let Query = require('./query');
//TODO add pick method which only selects those columns
//TODO add hide method which hides a column from the results, adding to the already hidden ones.
//TODO make fillable actually work.


class Model {
  constructor(
    fillable = [],
    hidden = [],
    database = undefined,
    query = undefined
  ){

    if (this.name === Model) {
      throw new Error("Model: Abstract class, please extend.");
    }

    if(!database) { throw new Error("Model: database not defined");}

    let _database = database;
    let _hidden = hidden;
    let _fillable = fillable;
    let _query = (query) ? new query() : new Query();

    let _wheres = [];
    let _relationships = [];
    let _limitValue = null;
    let _offsetValue = null;
    let _attributes = {};
    let _relationshipQueries = [];
    let _jsonOnly = false;
    let _attributesOnly = false;
    let _initialWhere = false;

    Object.defineProperty(this, 'database', {
      enumerable: true,
      get() {
        return _database;
      }
    });

    Object.defineProperty(this, 'relationshipQueries', {
      enumerable: true,
      get() {
        return _relationshipQueries;
      }
    });

    Object.defineProperty(this, 'query', {
      enumerable: true,
      get() {
        return _query;
      }
    });

    Object.defineProperty(this, 'relationships', {
      enumerable: true,
      get() {
        return _relationships;
      }
    });

    Object.defineProperty(this, 'attributes', {
      enumerable: true,
      get() {
        return _attributes;
      }
    });

    Object.defineProperty(this, 'hidden', {
      enumerable: true,
      get() {
        return _hidden;
      }
    });

    Object.defineProperty(this, 'jsonOnly', {
      enumerable: true,
      get() {
        return _jsonOnly;
      },
      set(value) {
        //turn value into a bool
        _jsonOnly = !!value;
        //if value is true, don't return as attributes
        if(value) {
          this.attributesOnly = false;
        }
      }
    });

    Object.defineProperty(this, 'attributesOnly', {
      enumerable: true,
      get() {
        return _attributesOnly;
      },
      set(value) {
        _attributesOnly = !!value;
        //if value is true, don't return as json
        if(value) {
          this.jsonOnly = false;
        }
      }
    });

    Object.defineProperty(this, 'initialWhere', {
      enumerable: true,
      get() {
        return _initialWhere;
      },
      set(value) {
        _initialWhere = !!value;
      }
    });

    let columns = this.query.getColumnNames(database, this.table);
    columns.forEach(function(column) {
      this.attributes[column] = null;
    }, this);
  }

  static where(column = null, predicate = null, value = undefined, database = undefined, query = undefined) {
    if(!column) { throw new Error('Model.where: column not defined')}
    if(typeof column !== 'string') { throw new Error('Model.where: column is not string')}
    if(!predicate) { throw new Error('Model.where: predicate not defined')}
    if(value === undefined) { throw new Error('Model.where: value not defined')}


    let instance = new this(undefined, undefined, database, query);
    instance.query.buildWhere(column, predicate, null, value);
    instance.initialWhere = true;

    return instance;

  }

  static whereBetween(column = undefined, start = undefined, end = undefined, database = undefined, query = undefined) {
    if(!column) { throw new Error('Model.where: column not defined')}
    if(start === undefined) { throw new Error('Model.where: minimum value not defined')}
    if(end === undefined) { throw new Error('Model.where: maximum not defined')}

    let instance = new this(undefined, undefined, database, query);
    instance.query.buildWhereBetween(column, start, end, null);
    instance.initialWhere = true;

    return instance;
  }

  static find(id = null, database = undefined, query = undefined) {
    if(!id) { throw new Error('Model.find: no id defined')};
    if(typeof id !== 'number') { throw new Error('Model.find: id is not a number')}

    let instance = new this(undefined, undefined, database, query);
    instance.query.buildWhere('id', '=', null, id);
    instance.initialWhere = true;

    return instance;
  }

  andWhere(column = null, predicate = null, value = undefined) {
    if(!column) { throw new Error('Model.andWhere: column not defined')}
    if(!predicate) { throw new Error('Model.andWhere: predicate is not defined')}
    if(value === undefined) { throw new Error('Model.andWhere: value is not defined')}

    this.query.buildWhere(column, predicate, 'AND', value);

    return this;
  }

  orWhere(column = null, predicate = null, value = undefined) {
    if(!column) { throw new Error('Model.orWhere: column not defined')}
    if(!predicate) { throw new Error('Model.orWhere: predicate is not defined')}
    if(value === undefined) { throw new Error('Model.orWhere: value is not defined')}

    this.query.buildWhere(column, predicate, 'OR', value);

    return this;
  }

  andWhereBetween(column = null, start = undefined, end = undefined) {
    if(!column) { throw new Error('Model.orWhereBetween: column not defined')}
    if(start === undefined) { throw new Error('Model.orWhereBetween: minimum value not defined')}
    if(end === undefined) { throw new Error('Model.orWhereBetween: maximum not defined')}

    this.query.buildWhereBetween(column, start, end, 'AND');

    return this;
  }

  orWhereBetween(column = null, start = undefined, end = undefined) {
    if(!column) { throw new Error('Model.orWhereBetween: column not defined')}
    if(start === undefined) { throw new Error('Model.orWhereBetween: minimum value not defined')}
    if(end === undefined) { throw new Error('Model.orWhereBetween: maximum not defined')}

    this.query.buildWhereBetween(column, start, end, 'OR');

    return this;
  }

  with(name = null, callback) {
    if(!name) { throw new Error('Model.with: related model name is undefined');}
    if(typeof this[name] !== 'function') { throw new Error('Model.with: relationship not defined on the model');}
    if(callback && typeof callback !== 'function') { throw new Error('Model.with: callback is not a function')};

    this.relationships.push({
      name: name,
      callback: callback
    });

    return this;
  }

  get() {
    var self = this;
    if(!this.initialWhere) { throw new Error('Model.get: no where clause')}
    return new Promise(function(resolve, reject) {

      //TODO sort out columns using hidden and pick here, and just pass that built array to query.
      //TODO set query table and database in constructor.
      self.query.select({
        columns: self.attributes
      }).then(function(results) {
        let instances = [];
        let promises = [];
        let promiseTypes = [];

        results.forEach(function(result) {
            let build = self.hydrateNewInstance(result);

            if(self.relationships.length) {
              self.relationships.forEach(function(wit) {
                let hasModel = self[wit.name]();
                let asAttributes = self.jsonOnly || self.attributesOnly;
                self.addRelationshipQuery(hasModel.model, hasModel.onColumn, '=', result[`${self.table}.${hasModel.rootColumn}`], wit.callback, asAttributes);
                promiseTypes.push(hasModel.model.prototype.table)
              });
            }

            instances.push(build);
        });

        Promise.all(self.relationshipQueries).then(function(foreignResults) {
            //we only need to act if there are actual results
            if(foreignResults.length) {
              let instanceOffset = 0;
              let count = 0;
              let withLength = self.relationships.length;

              //a bit archaic but this is a reasonable way to get the correct promise
              //result into the instance.
              //We can't resolve the instance until we build up all the related things requested,
              //and we have to use promise.all with all instances promises in to prevent a race condition between
              //resolving a qualified instance and resolving related models.
              for(let i = 0; i < foreignResults.length; i++) {
                if(count == withLength) {
                  count = 0;
                  instanceOffset++;
                }

                instances[instanceOffset].attributes[promiseTypes[count]] = foreignResults[i];

                count++;

              }
            }

            instances = instances.map(function(instance) {
              if(self.attributesOnly) {
                return instance.getAttributes();
              }
              if(self.jsonOnly) {
                return instance.getAttributesAsJson();
              }
              else {
                return instance;
              }
            });

           resolve(instances);
        });
      });
    });
  }

  save() {
    var self = this;
    return new Promise(function(resolve, reject) {

      //if it has an id we're doing an update
      if(self.attributes.id) {
        self.query.buildWhere('id', '=', null, self.attributes.id);
        self.query.update({
          database: self.database,
          table: self.table,
          values: self.attributes
        });
        resolve();
      }
      //else we're creating a new one
      else {
        self.query.create({
          database: self.database,
          table: self.table,
          values: self.attributes
        });
        resolve();
      }

    });
  }

  limit(value = null) {
    if(!value) { throw new Error('Model.limit: value not defined')}
    if(typeof value !== 'number') { throw new Error('Model.limit: value is not a number')}

    this.query.limit = value;

    return this;
  }

  offset(value) {
    if(!value) { throw new Error('Model.offset: value not defined')}
    if(typeof value !== 'number') { throw new Error('Model.offset: value is not a number')}

    this.query.offset = value;

    return this;
  }

  hide(column) {
    //STUB
    return this;
  }

  pick(column) {
    //STUB
    return this;
  }

  asJson() {
    this.jsonOnly = true;
    return this;
  }

  asAttributes() {
    this.attributesOnly = true;
    return this;
  }

  updateAttribute(name = null, value = undefined) {
    if(!name) { throw new Error('Model.updateAttribute: attribute name not passed')}

    let o = {};
    o[name] = value;
    this.hydrate(o);

    return this;
  }

  hydrate(values) {
    if(values !== Object(values)) { throw new Error('Model.hydrate: parameter is not an object')}
    for(var att in values) {
      let name = att.split(".")[1] || att;
      if(Object.keys(this.attributes).indexOf(name) > -1) {
        this.attributes[name] = values[att];
      }
      else {
        throw new Error('Model.hydrate: attribute doesn`t exist on model');
      }
    }

    return this;
  }

  //EXECUTION
  hydrateNewInstance(result = {}) {
    let instance = new this.constructor(this.fillable, this.hidden, this.database, this.query.constructor);

    instance.hydrate(result);
    return instance;
  }

  getAttributes() {
    return this.attributes;
  }

  getAttributesAsJson() {
    return JSON.stringify(this.attributes);
  }

  flatten() {
    let ret = {};
    for(var att in this.attributes) {
      if(this.attributes[att] instanceof Array) {
        ret[att] = [];
        this.attributes[att].forEach(function(sub) {
             ret[att].push(sub.flatten());
        });
      }
      else {
        ret[att] = this.attributes[att];
      }
    }
    return ret;
  }

  has(model = null, onColumn = null, rootColumn = null) {
    if(typeof model !== 'function') { throw new Error('Model.has: model is not a function/Class')}
    if(!onColumn) { throw new Error('Model.has: foreign column not passed')}
    if(typeof onColumn !== 'string') { throw new Error('Model.has: foreign column is not a string')}
    if(!rootColumn) { throw new Error('Model.has: this model column to join on not passed')}
    if(typeof rootColumn !== 'string') { throw new Error('Model.has: this model column to join on is not a string')}

    return {
      model: model,
      onColumn: onColumn,
      rootColumn: rootColumn
    };
  }

  addRelationshipQuery(model = null, column = null, predicate = null, value = null, callback = null, asAttributes = false) {
    if(!model) { throw new Error('Model.addRelationshipQuery: no model')}
    if(!column) { throw new Error('Model.addRelationshipQuery: no column')}
    if(!predicate) { throw new Error('Model.addRelationshipQuery: no predicate')}
    if(!value) { throw new Error('Model.value: no value')}


    let currentRelationships = this.relationshipQueries;
    let modelQuery = model.where(column, predicate, value, undefined, this.query.constructor);

    if(callback) {
      callback(modelQuery);
    }

    if(asAttributes) {
      modelQuery.asAttributes();
    }

    currentRelationships.push(modelQuery.get());

  }

}

module.exports = Model;
