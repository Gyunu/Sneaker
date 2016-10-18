module.exports = function(assert, fs, types, databaseManager) {
	describe('#connect', function() {
		afterEach(function() {
			//delete the database manager cached file
			databaseManager.flushConnections();
		});
		it('Should create a database in memory is a file is not passed', function() {
			return databaseManager.connect()
			.then(function(name) {
				assert.equal(name, ':memory:');
			})
			.fail(function(error) {
				assert.fail(error);
			});
		});
		it('Should add a new database to the pool', function() {
			return databaseManager.connect()
			.then(function(name) {
				assert.equal(databaseManager.availableConnections, 1);
			})
			.fail(function(error) {
				assert.fail(error);
			});
		});
		it('Should return a database from a pool when using .db', function() {
			return databaseManager.connect()
			.then(function(db) {
				assert.equal(databaseManager.db.filename, db);
				assert.equal(databaseManager.availableConnections, 0);
			});
		});
		it('Should create a database from file if a file is passed', function() {
			var fs = require("fs");
			var dbFile = './database.db';
			var dbExists = fs.existsSync(dbFile);
			if(dbExists) {
				fs.unlinkSync(dbFile);
			}
			fs.openSync(dbFile, 'w');
			return databaseManager.connect(dbFile)
			.then(function(name) {
				assert.equal(name, dbFile);
				assert.equal(databaseManager.availableConnections, 1);
			})
			.fail(function(error) {
				assert.fail();
			});
		});
		it('Should throw an error if file type is a number', function() {
			return databaseManager.connect(types.number)
			.then(function(){
				throw(new Error('Unexpected success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.fileNameIsNotString);
			});
		});
		it('Should throw an error if file type is NaN', function() {
			return databaseManager.connect(types.NaN)
			.then(function(){
				throw(new Error('Unexpected success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.fileNameIsNotString);
			});
		});
		it('Should throw an error if file type is boolean', function() {
			return databaseManager.connect(types.boolean)
			.then(function(){
				throw(new Error('Unexpected success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.fileNameIsNotString);
			});
		});
		it('Should throw an error if file type is regex', function() {
			return databaseManager.connect(types.regex)
			.then(function(){
				throw(new Error('Unexpected success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.fileNameIsNotString);
			});
		});
		it('Should throw an error if file type is object', function() {
			return databaseManager.connect(types.object)
			.then(function(){
				throw(new Error('Unexpected success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.fileNameIsNotString);
			});
		});
		it('Should throw an error if file type is array', function() {
			return databaseManager.connect(types.array)
			.then(function(){
				throw(new Error('Unexpected success'));
			})
			.fail(function(error) {
				assert.instanceOf(error, databaseManager.error.fileNameIsNotString);
			});
		});
		it('Should throw error if file doesn\'t exist', function() {
				return databaseManager.connect('./test/location/database.db')
				.then(function() {
					throw(new Error('Unexpected Success'));
				})
				.fail(function(error) {
					assert.instanceOf(error, databaseManager.error.fileDoesNotExist);
				});
		});
		it('Should set the databaseManager name to the database filename', function() {
			return databaseManager.connect().then(function(dbname) {
				assert.equal(dbname, databaseManager.name);
			});
		});
		it('Should return the same database if #connect has already be called', function() {
			return databaseManager.connect().then(function(db) {
				databaseManager.connect().then(function(db2) {
					assert.equal(db, db2);
				});
			});
		});
	});
};
