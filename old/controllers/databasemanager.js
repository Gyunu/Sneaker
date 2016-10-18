/** DatabaseManager
*
*	A static handler for database interaction
*
*
*	@version 0.1
*	@author David Allen
*
*******************************************************/
//TODO standardise 0 || null || false === vairbale
//TODO standardise using Object.keys and saving to variable
//TODO standardies
//TODO moving to making transactions, will move to prepared statements and serialise http://blog.modulus.io/nodejs-and-sqlite
//TODO make module.exports an object with defined apis'
//TODO PRIORITY make an argument checking utility that throws errors
//TODO PRIORITY wrap things in try catch and reject in catch
//TODO rename errors to remove method name from name, and include in message and standardise to use is isNot has hasNo and isUndefined and isNotDefined
/**
* Requires
*
*/
var sqlite3 = require('sqlite3').verbose();
var Q = require('q');
var fs = require('fs');

var debug = require('../utilities/debug');
var error = require('../error/databaseManager');


var database;

/**
* DatabaseManager
*/

function DatabaseManager() {
	var _db = null;
	var _name = null;
}

Object.defineProperty(DatabaseManager.prototype, 'name', {
	get: function() {
		return this._name;
	},
	set: function(value) {
		//TODO test this
		this._name = value;
	}
});

Object.defineProperty(DatabaseManager.prototype, 'db', {
	get: function() {
		try {
			if(this._db === null || typeof this._db === 'undefined') {
				this._db = [];
			}
			if(this.availableConnections === 0) {
				this.db = new sqlite3.Database(this.name);
			}
		}
		catch(error) {
			debug.log(error, 'error');
			throw(error);
		}

		return this._db.shift();
	},
	set: function(database) {
		try {
			if(this._db === null || typeof this._db === 'undefined') {
				this._db = [];
			}
			if(typeof database === 'undefined') {
				throw(new error.databaseIsNotDefined);
			}
			if(database === null) {
				throw(new error.databaseIsNull);
			}
			if(database.constructor.name !== 'Database') {
				throw(new error.notDatabaseType);
			}
			if(!database.open) {
				throw(new error.databaseIsNotOpen);
			}
			if(this._db.length > 0) {
				if(this._db[0].filename !== database.filename) {
					throw(new error.databaseIsNotWorkingOnSameFile);
				}
			}
		}
		catch(error) {
			debug.log(error, 'error');
			throw(error);
		}

		this._db.push(database);
	},
	enumerable: false
});

Object.defineProperty(DatabaseManager.prototype, 'availableConnections', {
	enumerable: true,
	get: function() {
		if(typeof this._db === 'undefined') {
			this._db = [];
		}
		return this._db.length;
	}
});

DatabaseManager.prototype.flushConnections = function() {
	this._db = [];
};


DatabaseManager.prototype.connect = function(file) {
	var self = this;
	return Q.promise(
		function(resolve, reject) {
			try {
				if(self.availableConnections > 0) {
					resolve(self.db.filename);
				}
				if(typeof file === 'undefined' || file === ':memory:') {
					file = ':memory:';
				}
				else {
					if(file === null) {
						throw(new error.nullFileName);
					}

					if(typeof file !== 'string') {
						throw(new error.fileNameIsNotString);
					}

					if(!fs.existsSync(file)) {
						throw(new error.fileDoesNotExist);
					}
				}

				var db = new sqlite3.Database(file);
				db.on('open', function() {
					try {
						self.db = db;
						self.name = db.filename;
						resolve(db.filename);
					}
					catch(error) {
						throw(error);
					};
				});

				db.on('error', function(error) {
					throw(error);
				});

			}
			catch(error) {
				debug.log(error, 'error');
				reject(error);
			}
	});
};

DatabaseManager.prototype.createTable = function(options) {
	var self = this;
	return Q.Promise(
		function(resolve, reject) {
			try {
				if(typeof options === 'undefined') {
					throw(new error.createTableArgumentsUndefined);
				}
				if(typeof options.name === 'undefined') {
					throw(new error.createTableNameIsUndefined);
				}
				if(options.name === null) {
					throw(new error.createTableNameIsNull);
				}
				if(typeof options.name !== 'string') {
					throw(new error.createTableNameIsNotString);
				}
				if(typeof options.fields === 'undefined') {
					throw(new error.createTableFieldsIsUndefined);
				}
				if(!(options.fields instanceof Array)) {
					throw(new error.createTableFieldsIsNotArray);
				}
				if(options.fields.length < 1) {
					throw(new error.createTableFieldsHasNoLength);
				}

				var fieldNames = {};
				options.fields.forEach(function(value) {
					if(fieldNames[value.name]) {
						throw(new error.createTableFieldNameAlreadyExists);
					}
					else {
						fieldNames[value.name] = value.name;
					}
					if(typeof value !== 'object' || value instanceof RegExp || value instanceof Array ) {
						throw(new error.createTableFieldIsNotObject);
					}
					if(typeof value.name === 'undefined') {
						throw(new error.createTableFieldNameIsUndefined);
					}
					if(value.name === null) {
						throw(new error.createTableFieldNameIsNull);
					}
					if(typeof value.name !== 'string') {
						throw(new error.createTableFieldNameIsNotString);
					}
					if(typeof value.type === 'undefined') {
						throw(new error.createTableFieldTypeIsUndefined);
					}
					if(value.type === null) {
						throw(new error.createTableFieldTypeIsNull);
					}
					if(typeof value.type !== 'string') {
						throw(new error.createTableFieldTypeIsNotString);
					}
					switch(value.type) {
						case 'NULL':
						case 'INTEGER':
						case 'TEXT':
						case 'BLOB':
							break;
						default:
						throw(new error.createTableFieldTypeIsNotValidSqlite3Type);
					}
				});

				//TODO work out a way to transaction and bind params
				var values = [];

				var query  = " CREATE TABLE IF NOT EXISTS";
						query += " " + options.name;
						query += " (id INTEGER PRIMARY KEY, ";

				var length = options.fields.length;

				options.fields.forEach(function(item, index) {
					query += item.name + " " + item.type;
					if(index < length - 1) {
						query += ", ";
					}
					else {
						query += ")";
					}
				});

				var db = self.db;

				db.serialize(function() {
					db.exec(query, function(error, rows) {
						if(error) {
							reject(error);
						}
						//put the database back into rotation
						self.db = db;
						resolve(this);
					});
				});
			}
			catch(error) {
				debug.log(error, 'error');
				reject(error);
			}
		});
};

DatabaseManager.prototype.insert = function(tableName, statement) {
	var self = this;
	return Q.Promise(
		function(resolve, reject) {
			try {
				if(typeof tableName === 'undefined') {
					throw(new error.tableNameIsNotDefined);
				}
				if(tableName === null) {
					throw(new error.tableNameIsNull);
				}
				if(typeof tableName !== 'string') {
					throw(new error.tableNameIsNotString);
				}
				if(typeof statement === 'undefined') {
					throw(new error.statementIsUndefined);
				}
				if(statement === null) {
					throw(new error.statementIsNull);
				}
				switch(typeof statement) {
					case 'number':
					case 'string':
					case 'boolean':
						throw(new error.statementIsNotAnObject);
				}
				if(statement instanceof RegExp || statement instanceof Array) {
					throw(new error.statementIsNotAnObject);
				}
				if(Object.keys(statement).length === 0) {
					throw(new error.statementHasNoValues);
				}

				var columns = [];
				var values = [];

				Object.keys(statement).forEach(function(value, index) {
					columns.push(value);
					values.push(statement[value]);
				});

				var query  = "";
						query += " INSERT INTO " + tableName;
						query += " (" + columns.join(", ") + ")";
						query += " VALUES ('" + values.join("', '") + "')";

						var db = self.db;

						db.serialize(function() {
							db.run(query, function(error, rows) {
								if(error) {
									throw(error);
								}
								self.db = db;
								resolve(this.lastID);
							});
						});
			}
			catch(error) {
				debug.log(error, 'error');
				reject(error);
			}
		});
};

// var DatabaseManager = {
//
// 	/**
// 	* insert
//
// 		{
// 			columnName: value,
// 			columnName: value
// 		}
// 	*/
// 	insert: function(tableName, statement) {
// 		debug.log('databaseManager::insert ', 'log');
// 			return Q.Promise(
// 				function(resolve, reject) {
// 					try {
// 						if(DatabaseManager.db === null) {
// 							throw(new error.notConnected);
// 						}
//
// 						if(typeof tableName === 'undefined') {
// 							throw(new error.tableNameNotDefined);
// 						}
//
// 						if(typeof tableName !== 'string') {
// 							throw(new error.tableNameIsNotString);
// 						}
//
// 						if(typeof statement === 'undefined') {
// 							throw(new error.statementIsNotDefined);
// 						}
//
// 						if(statement === null || typeof statement === 'string' || typeof statement === 'number' || typeof statement === 'boolean' || statement instanceof RegExp || statement instanceof Array) {
// 							throw(new error.statementIsNotAnObject);
// 						}
//
// 						if(Object.keys(statement).length < 1) {
// 							throw(new error.statementHasNoValues);
// 						}
// 					}
// 					catch(error) {
// 						debug.log(error, 'error');
// 						reject(error);
// 					}
//
//
// 					var columns = [];
// 					var values = [];
//
// 					Object.keys(statement).forEach(function(value, index) {
// 						columns.push(value);
// 						values.push(statement[value]);
// 					});
//
// 					var query  = "";
// 							query += " INSERT INTO " + tableName;
// 							query += " (" + columns.join(", ") + ")";
// 							query += " VALUES ('" + values.join("', '") + "')";
// 							console.log(query);
// 							debug.log('databaseManager::insert constructed query', 'log');
// 							debug.log('databaseManager::insert ' + query, 'log');
//
// 							debug.log('databaseManager::insert running query', 'log');
// 							database.run(query, function(error, rows) {
// 								if(error) {
// 									debug.log('databaseManager::insert ' + error, 'error');
// 									console.log(error);
// 									// reject(new Error("databaseManager::create : " + error));
// 								}
//
// 								debug.log('databaseManager::insert inserted id is' + this.lastID, 'log');
// 								//returns lastID of insert
// 								resolve(this.lastID);
// 							});
// 			});
// 	},
// 	/**
// 	* select
// 	{
// 		select: [columnames]
// 		where: {
// 			columnname: value,
// 			columename: value
// 			columname: greater than, less than
// 		}
// 	}
// 	*/
//
// 	//TODO more complex where clauses
// 	//TODO limit
// 	/*
// 	statement is an object with optional where and optional select
// 	if select is ommitted, all fields are returned (as in using a wildcard)
// 	if where is ommitted, all results are returned
// 	*/
// 	select: function(tableName, statement) {
// 		debug.log('databaseManager::select ', 'log');
// 		if(Function.verifyArguments(arguments, ["String", "Object"])) {
// 			return Q.Promise(
// 				function(resolve, reject) {
//
// 					if(!tableName || 0 === tableName.length ) {
// 						debug.log('databaseManager::select tableName is not defined', 'error');
// 						reject(new Error("databaseManager::select : no tablename"));
// 					}
//
// 					if(!statement.select) {
// 						statement.select = ['*'];
// 					}
//
// 					debug.log('databaseManager::select constructing query', 'log');
// 					var query  = "";
// 							query += " SELECT " + statement.select.join(', ') + " FROM " + tableName;
// 						if(statement.where && typeof statement.where === 'object') {
//
// 							debug.log('databaseManager::select constructing where clause', 'log');
// 							var fields = [];
// 							var values = [];
// 							Object.keys(statement.where).forEach(function (key) {
// 								fields.push(key);
// 								values.push('"' + statement.where[key] + '"');
// 							});
//
// 							fields.forEach(function(value, index) {
// 								if(index === 0) {
// 									query += " WHERE ";
// 								}
// 								else {
// 									query += " AND ";
// 								}
//
// 								query += fields[index] + "=" + values[index];
//
// 							});
// 							debug.log('databaseManager::select query constructed', 'log');
// 							debug.log('databaseManager::select ' + query, 'log');
//
// 						}
// 						else {
// 							debug.log('databaseManager::select malformed where clause', 'error');
// 							reject(new Error("databaseManager::select : Where is not an object"));
// 						}
//
//
// 						debug.log('databaseManager::select querying database', 'log');
// 						database.all(query, function(error, rows) {
// 							if(error) {
// 								debug.log('databaseManager::select ' + error, 'error');
// 								reject(new Error("databaseManager::select : " + error));
// 							}
//
// 							debug.log('databaseManager::select found result', 'log');
// 							resolve(rows);
//
// 						});
// 				});
// 		}
// 	},
// 	/**
// 	* update
// 	{
// 		update: {
// 			columname: value,
// 			columname: value
// 		},
// 		where: {
// 			columnname: value,
// 			columename: value
// 			columname: greater than, less than
// 		}
// 	}
// 	*/
//
// 	//TODO more complex where clauses
// 	//TODO limit
// 	//TODO table/field metadata last update/created
// 	/*
// 	statement is an object with optional where and optional select
// 	if select is ommitted, all fields are returned (as in using a wildcard)
// 	if where is ommitted, all results are returned
// 	*/
// 	update: function(tableName, statement) {
// 		debug.log('databaseManager::update ', 'log');
// 		if(Function.verifyArguments(arguments, ["String", "Object"])) {
// 			return Q.Promise(
// 				function(resolve, reject) {
//
// 					if(!tableName || 0 === tableName.length ) {
// 						debug.log('databaseManager::update table name does not exist', 'error');
// 						reject(new Error("databaseManager::update : no tablename"));
// 					}
//
// 					if(!statement.update) {
// 						debug.log('databaseManager::update no update values', 'error');
// 						reject(new Error("Nothing to update"));
// 					}
//
// 					debug.log('databaseManager::update generating query', 'log');
// 					var query  = "";
// 							query += " UPDATE " + tableName;
// 							query += " SET ";
//
// 					debug.log('databaseManager::update generating update clause ', 'log');
// 						if(statement.update && typeof statement.update === 'object') {
//
// 							var updateFields = [];
// 							var updateValues = [];
// 							Object.keys(statement.update).forEach(function (key) {
// 								updateFields.push(key);
// 								updateValues.push("'" + statement.update[key] + "'");
// 							});
//
// 							updateFields.forEach(function(value, index) {
// 								query += value + " = ";
// 								query += updateValues[index];
// 							});
//
// 						}
// 						else {
// 							debug.log('databaseManager::update malformed update object', 'error');
// 							reject(new Error("databaseManager::select : update is not an object"));
// 						}
//
// 						debug.log('databaseManager::update generating where clause', 'log');
// 						if(statement.where && typeof statement.where === 'object')
// 						{
// 							var whereFields = [];
// 							var whereValues = [];
// 							Object.keys(statement.where).forEach(function (key) {
// 								whereFields.push(key);
// 								whereValues.push('"' + statement.where[key] + '"');
// 							});
//
// 							whereFields.forEach(function(value, index) {
// 								if(index === 0) {
// 									query += " WHERE ";
// 								}
// 								else {
// 									query += " AND ";
// 								}
//
// 								query += whereFields[index] + "=" + whereValues[index];
//
// 							});
// 						}
//
// 						debug.log('databaseManager::update running query', 'log');
// 						database.run(query, function(error, rows) {
// 							if(error) {
// 								debug.log('databaseManager::update ' + error, 'error');
// 								reject(new Error("databaseManager::select : " + error));
// 							}
//
// 							debug.log('databaseManager::update id is ' + this.lastID, 'log');
// 							resolve(this.lastID);
//
// 						});
// 				});
// 		}
// 	},
// 	/**
// 	* createTable
// 	*
// 	* Inserts a new table to the database
// 	*
// 	* @param {object} An object of tablename and fields to create
// 	*
// 	*/
// 	/*
//
// 		example options object
// 		the fields key is an array of objects with the keys name and type - to denote
// 		the field name and it's type.
//
// 		{
// 			name: 'tableName',
// 			fields: [
// 				{
// 					name: 'field1',
// 					type: 'TEXT'
// 				},
// 				{
// 					name: 'field2',
// 					type: 'TEXT'
// 				}
// 			]
// 		}
//
// 	*/
// 	createTable: function(options) {
					// debug.log('databaseManager::createTable building query', 'log');
					// //build the query
					// var query  = "CREATE TABLE IF NOT EXISTS ";
					// 		query += options.name;
					// 		query += " (id INTEGER PRIMARY KEY, ";
					//
					// //get the amount of fields
					// var length = options.fields.length;
					//
					// debug.log('databaseManager::createTable building fields', 'log');
					// //for each field object, add it to the query
					// options.fields.forEach(function(item, index) {
					// 	//need to parse the type here
					// 	query += item.name + " " + item.type;
					// 	if(index < length - 1) {
					// 		query += ", ";
					// 	} else {
					// 		query += ")";
					// 	}
					// });
					//
					// debug.log('databaseManager::createTable query generated', 'log');
					// debug.log('databaseManager::createTable ' + query, 'log');
					// //run the query
					// debug.log('databaseManager::createTable running query', 'log');
					// DatabaseManager.transaction.beginTransaction(function(reject, transaction) {
					// 	transaction.run(query);
					// 	transaction.commit(function(error) {
					// 		if(error) {
					// 			reject(error);
					// 		}
					// 		resolve();
					// 	});
					// });

		// 	}
		// );
// 	},
// 	dropTable: function(name) {
// 		if(Function.verifyArguments(arguments, ["String"])) {
//
// 				var query  = "";
// 						query += "DROP TABLE " + tablename;
//
// 				database.run(query, function(row, error) {
// 					//not complete
// 				});
// 		}
// 	}
//
// };

var databaseManager = new DatabaseManager();
module.exports = databaseManager;

module.exports.test = function() {
	module.exports.error = error;
	debug.off();
	return databaseManager;
}();
