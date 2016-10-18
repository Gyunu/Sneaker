module.exports = function(assert, fs, types) {
	/*jslint node: true */
	'use strict';
	describe('DatabaseManager', function() {
		var databaseManager = require('../../controllers/databaseManager').test;
		require('./databaseManager/connect')(assert, fs, types, databaseManager);
		require('./databaseManager/createTable')(assert, fs, types, databaseManager);
		require('./databaseManager/insert')(assert, fs, types, databaseManager);


	});
};
