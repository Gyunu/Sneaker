module.exports = function(assert, fs, types, databaseManager) {
	//TODO before each flush connections and unlink database file and make new
	describe('#insert', function() {
		it('Should throw error if tablename has not been defined', function() {
			return databaseManager.insert()
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.tableNameIsNotDefined);
			});
		});
		it('Should throw error if tablename is null', function() {
			return databaseManager.insert(types.null)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.tableNameIsNull);
			});
		});
		it('Should throw error if tablename is number', function() {
			return databaseManager.insert(types.number)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.tableNameIsNotString);
			});
		});
		it('Should throw error if tablename is NaN', function() {
			return databaseManager.insert(types.NaN)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.tableNameIsNotString);
			});
		});
		it('Should throw error if tablename is boolean', function() {
			return databaseManager.insert(types.boolean)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.tableNameIsNotString);
			});
		});
		it('Should throw error if tablename is regex', function() {
			return databaseManager.insert(types.regex)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.tableNameIsNotString);
			});
		});
		it('Should throw error if tablename is array', function() {
			return databaseManager.insert(types.array)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.tableNameIsNotString);
			});
		});
		it('Should throw error if tablename is object', function() {
			return databaseManager.insert(types.object)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.tableNameIsNotString);
			});
		});
		it('Should throw error if statement is undefined', function() {
			return databaseManager.insert(types.string)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.statementIsUndefined);
			})
		});
		it('Should throw error if statement is null', function() {
			return databaseManager.insert(types.string, types.null)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.statementIsNull);
			})
		});
		it('Should throw error if statement is string', function() {
			return databaseManager.insert(types.string, types.string)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.statementIsNotAnObject);
			})
		});
		it('Should throw error if statement is number', function() {
			return databaseManager.insert(types.string, types.number)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.statementIsNotAnObject);
			})
		});
		it('Should throw error if statement is NaN', function() {
			return databaseManager.insert(types.string, types.NaN)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.statementIsNotAnObject);
			})
		});
		it('Should throw error if statement is boolean', function() {
			return databaseManager.insert(types.string, types.boolean)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.statementIsNotAnObject);
			})
		});
		it('Should throw error if statement is regex', function() {
			return databaseManager.insert(types.string, types.regex)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.statementIsNotAnObject);
			})
		});
		it('Should throw error if statement is array', function() {
			return databaseManager.insert(types.string, types.array)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.statementIsNotAnObject);
			})
		});
		it('Should throw an error if statement has no keys', function() {
			return databaseManager.insert(types.string, types.object)
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.statementHasNoValues);
			});
		});
		it('Should successfully insert a valid value and return the id', function() {
			databaseManager.flushConnections();
			return databaseManager.connect('./database.db').then(function(name) {
				return databaseManager.createTable({
					name: 'test',
					fields: [
						{
							name: 'foo',
							type: 'TEXT'
						}
					]
				})
				.then(function() {
					return databaseManager.insert('test', {foo: 'foo'})
					.then(function(id) {
						assert.isNumber(id);
					})
					.fail(function(error) {
						assert.fail();
					});
				})
				.fail(function(error) {
					assert.fail();
				});
			});
		});
	});
};
	// it('Should fail if statement has no keys', function() {
	// 	databaseManager.connect()
	// 	.then(function() {
	// 		databaseManager.insert('test', types.object)
	// 		.then(function() {
	// 			throw new Error('Unexpected Success');
	// 		})
	// 		.fail(function(error) {
	// 			assert.instanceOf(error, databaseManager.error.statementHasNoValues);
	// 		});
	// 	});
	// });
	// it('Should fail if the query fails', function() {
	// 	databaseManager.connect()
	// 	.then(function() {
	// 		databaseManager.insert('test', {test: 'value'})
	// 		.then(function() {
	// 			throw new Error('Unexpected Success');
	// 		})
	// 		.fail(function(error) {
	// 			assert.instanceOf(error, databaseManager.error.statementHasNoValues);
	// 		});
	// 	});
	// });
