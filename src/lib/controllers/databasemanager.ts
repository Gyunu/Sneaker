/** DatabaseManager
*
*	A static handler for database interaction
*
*
*	@version 0.1
*	@author David Allen
*
*******************************************************/
//TODO moving to making transactions, will move to prepared statements and serialise http://blog.modulus.io/nodejs-and-sqlite

declare function require(name: string);

import { Sneaker } from "../../sneaker";

/**
* DatabaseManager
*/
export module DatabaseManager {

	let sqlite3 = require('sqlite3').verbose();
	let Q = require('q');
	let fs = require('fs');

	//TODO get the typings for sqlite3
	let pool: Array<any> = [];
	let name: string;
	let _db = null;
	let _name = null;

	export function connect(file: string) {
		return Q.promise(
			function(resolve, reject) {
				try {
					if (pool.length > 0) {
						resolve(pool[0]);
					}

					var db = new sqlite3.Database(file);
					db.on('open', function() {
						try {
							pool.push(db);
							name = db.filename;
							resolve(db);
						}
						catch (error) {
							throw (error);
						};
					});

					db.on('error', function(error) {
						console.log(error);
						throw (error);
					});

				}
				catch (error) {
					console.log(error);
					reject(error);
				}
			});
	};

	export function flushConnections() {
		pool = [];
	}

	export function listTables() {
		var self = this;
		return Q.promise(
			function(resolve, reject) {
				self.connect(name)
					.then(function(db) {
						db.serialize(function() {
							db.all("select name from sqlite_master where type='table'", function(error, tables) {
								if (error) {
									reject(error);
								}
								pool.push(db);
								resolve(tables);
							});
						});
					})
					.fail(function(error) {
						console.log(error);
					});
			}
		)
	};

	export function createTable(options: ICreateTableArgs) {
		let self = this;
		return Q.Promise(
			function(resolve, reject) {
				try {
					var fieldNames = {};
					options.fields.forEach(function(field) {
						if (fieldNames[field.name]) {
							throw (new Error('field name already exists in section'));
						}
						else {
							fieldNames[field.name] = field.name;
						}
						switch (field.value) {
							case 'NULL':
							case 'INTEGER':
							case 'TEXT':
							case 'BLOB':
								break;
							default:
								throw (new Error('Type does not match sqlite3 type'));
						}
					});

					var values = [];

					var query = " CREATE TABLE IF NOT EXISTS";
					query += " " + options.name;
					query += " (id INTEGER PRIMARY KEY, ";

					var length = options.fields.length;

					options.fields.forEach(function(item, index) {
						query += item.name + " " + item.value;
						if (index < length - 1) {
							query += ", ";
						}
						else {
							query += ")";
						}
					});

					if (pool.length === 0) {
						throw (new Error("Please run connect first"));
					}

					self.connect(name)
						.then(function(db) {
							db.serialize(function() {
								db.exec(query, function(error, rows) {
									if (error) {
										reject(error);
									}
									//put the database back into rotation
									pool.push(db);
									resolve(this);
								});
							});
						})
						.fail(function(error) {
							console.log(error);
						});
				}
				catch (error) {
					reject(error);
				}
			});
	}

	export function insert(tableName: string, statement: Array<IInsertArgs>) {
		let self = this;
		return Q.Promise(
			function(resolve, reject) {
				try {
					let columns = [];
					let values = [];

					statement.forEach(function(s) {
						columns.push(s.field);
						values.push(s.value);
					});

					let query = "";
					query += " INSERT INTO " + tableName;
					query += " (" + columns.join(", ") + ")";
					query += " VALUES ('" + values.join("', '") + "')";

					self.connect(name).then(function(db) {
						db.serialize(function() {
							db.run(query, function(error, rows) {
								if (error) {
									throw (error);
								}

								pool.push(db);
								resolve(this.lastID);
							});
						});
					})
						.fail(function(error) {
							console.log(error);
						});
				}
				catch (error) {
					reject(error);
				}
			});
	}

	export function update(table: string, clause: Object): any {

	}

	export function select(table: string, clause: IDatabaseSelectArgs): any {
		let self = this;
		return Q.promise(
			function(resolve, reject) {

				let query: string = "";
				let select = "";
				let from = "";
				let join = "";
				let on = "";

				select += " SELECT ";
				if (clause.distinct) select += " DISTINCT ";
				select += " t1." + clause.select.join(', ');

				from += " FROM " + table + " AS t1";

				if (clause.join) {
					select += ", t2." + clause.select.join(', ');
					join += " INNER JOIN " + clause.join.table + " AS t2";
					on += " ON t2." + clause.join.on + clause.join.modifier + "t1." + clause.join.value;
				}

				query += select + from + join + on;

				if (clause.where) {
					let columns: Array<string> = [];
					let modifiers: Array<string> = [];
					let values: Array<string> = [];

					clause.where.forEach(function(c) {
						columns.push(c.column);
						modifiers.push(c.modifier);
						values.push(c.value);
					});

					columns.forEach(function(col, index) {
						if (index === 0) {
							query += " WHERE ";
						}
						else {
							query += " AND ";
						}

						query += "t1." + columns[index] + modifiers[index] + "'" + values[index] + "'";

					});
				}

				console.log(query);

				self.connect(name)
					.then(function(db) {
						db.all(query, function(error, rows) {
							if (error) {
								reject(new Error("databaseManager::select : " + error));
							}
							pool.push(db);
							resolve(rows);
						});
					})
					.fail(function(error) {
						console.log(error);
					});
			});
	}
}
