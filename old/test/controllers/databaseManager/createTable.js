module.exports = function(assert, fs, types, databaseManager) {
	describe('#createTable', function() {
		it('Should throw an error no parameter is passed', function() {
			return databaseManager.createTable()
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableArgumentsUndefined);
			});
		});
		it('Should throw an error if table name is undefined', function() {
			return databaseManager.createTable({})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableNameIsUndefined);
			});
		});
		it('Should throw an error if table name is null', function() {
			return databaseManager.createTable({name: types.null})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableNameIsNull);
			});
		});
		it('Should throw an error if table name is number', function() {
			return databaseManager.createTable({name: types.number})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableNameIsNotString);
			});
		});
		it('Should throw an error if table name is NaN', function() {
			return databaseManager.createTable({name: types.NaN})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableNameIsNotString);
			});
		});
		it('Should throw an error if table name is boolean', function() {
			return databaseManager.createTable({name: types.boolean})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableNameIsNotString);
			});
		});
		it('Should throw an error if table name is regex', function() {
			return databaseManager.createTable({name: types.regex})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableNameIsNotString);
			});
		});
		it('Should throw an error if table name is object', function() {
			return databaseManager.createTable({name: types.object})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableNameIsNotString);
			});
		});
		it('Should throw an error if table name is array', function() {
			return databaseManager.createTable({name: types.array})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableNameIsNotString);
			});
		});
		it('Should throw an error if fields is undefined', function() {
			return databaseManager.createTable({name: 'test'})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldsIsUndefined);
			});
		});
		it('Should throw an error if fields is string', function() {
			return databaseManager.createTable({name: 'test', fields: types.string})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldsIsNotArray);
			});
		});
		it('Should throw an error if fields is number', function() {
			return databaseManager.createTable({name: 'test', fields: types.number})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldsIsNotArray);
			});
		});
		it('Should throw an error if fields is NaN', function() {
			return databaseManager.createTable({name: 'test', fields: types.NaN})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldsIsNotArray);
			});
		});
		it('Should throw an error if fields is boolean', function() {
			return databaseManager.createTable({name: 'test', fields: types.boolean})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldsIsNotArray);
			});
		});
		it('Should throw an error if fields is regex', function() {
			return databaseManager.createTable({name: 'test', fields: types.regex})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldsIsNotArray);
			});
		});
		it('Should throw an error if fields is object', function() {
			return databaseManager.createTable({name: 'test', fields: types.object})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldsIsNotArray);
			});
		});
		it('Should throw an error if fields has no length', function() {
			return databaseManager.createTable({name: 'test', fields: types.array})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldsHasNoLength);
			});
		});
		it('Should throw an error if fields item is string', function() {
			return databaseManager.createTable({name: 'test', fields: [types.string]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldIsNotObject);
			});
		});
		it('Should throw an error if fields item is number', function() {
			return databaseManager.createTable({name: 'test', fields: [types.number]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldIsNotObject);
			});
		});
		it('Should throw an error if fields item is NaN', function() {
			return databaseManager.createTable({name: 'test', fields: [types.NaN]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldIsNotObject);
			});
		});
		it('Should throw an error if fields item is boolean', function() {
			return databaseManager.createTable({name: 'test', fields: [types.boolean]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldIsNotObject);
			});
		});
		it('Should throw an error if fields item is regex', function() {
			return databaseManager.createTable({name: 'test', fields: [types.regex]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldIsNotObject);
			});
		});
		it('Should throw an error if fields item is array', function() {
			return databaseManager.createTable({name: 'test', fields: [types.array]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldIsNotObject);
			});
		});
		it('Should throw an error if fields item name is undefined', function() {
			return databaseManager.createTable({name: 'test', fields: [types.object]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldNameIsUndefined);
			});
		});
		it('Should throw an error if fields item name is null', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: null}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldNameIsNull);
			});
		});
		it('Should throw an error if fields item name is number', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: types.number}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldNameIsNotString);
			});
		});
		it('Should throw an error if fields item name is NaN', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: types.NaN}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldNameIsNotString);
			});
		});
		it('Should throw an error if fields item name is boolean', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: types.boolean}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldNameIsNotString);
			});
		});
		it('Should throw an error if fields item name is regex', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: types.regex}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldNameIsNotString);
			});
		});
		it('Should throw an error if fields item name is object', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: types.object}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldNameIsNotString);
			});
		});
		it('Should throw an error if fields item name is array', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: types.array}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldNameIsNotString);
			});
		});
		it('Should throw an error if field item type is undefined', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: 'field'}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldTypeIsUndefined);
			});
		});
		it('Should throw an error if field item type is null', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: 'field', type: types.null}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldTypeIsNull);
			});
		});
		it('Should throw an error if field item type is number', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: 'field', type: types.number}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldTypeIsNotString);
			});
		});
		it('Should throw an error if field item type is NaN', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: 'field', type: types.NaN}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldTypeIsNotString);
			});
		});
		it('Should throw an error if field item type is boolean', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: 'field', type: types.boolean}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldTypeIsNotString);
			});
		});
		it('Should throw an error if field item type is rexex', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: 'field', type: types.regex}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldTypeIsNotString);
			});
		});
		it('Should throw an error if field item type is array', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: 'field', type: types.array}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldTypeIsNotString);
			});
		});
		it('Should throw an error if field item type is object', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: 'field', type: types.object}]})
			.then(function() {
				throw(new Error ('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldTypeIsNotString);
			});
		});
		it('Should throw an error if field item type is not valid sqlite3 type', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: 'field', type: 'string'}]})
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldTypeIsNotValidSqlite3Type);
			});
		});
		it('Should throw an error if a duplicated field name exists', function() {
			return databaseManager.createTable({name: 'test', fields: [{name: 'field', type: 'TEXT'},{name: 'field', type: 'TEXT'}]})
			.then(function() {
				throw(new Error('Unexpected Success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.createTableFieldNameAlreadyExists);
			});
		});
		it('Should insert a valid table statement', function() {
			//TODO fetch tables using databaseManager to check
			databaseManager.flushConnections();
			return databaseManager.connect('./database.db')
			.then(function(name) {
				databaseManager.createTable({name: 'test', fields: [{name: 'foo', type: 'TEXT'}]})
				.then(function(result) {

				})
				.fail(function(error) {

					assert.fail();
				});
			});
		});
	});
};
