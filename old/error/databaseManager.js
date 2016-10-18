'use strict';
var util = require('util');

var DatabaseManager = {
	fileNameIsNotString: function() {
		this.message = 'databaseManager#connect fileNameIsNotString';
		Error.captureStackTrace(this, DatabaseManager.fileNameIsNotString);
	},
	fileDoesNotExist: function() {
		this.message = 'databaseManager#connect fileDoesNotExist';
		Error.captureStackTrace(this, DatabaseManager.fileDoesNotExist);
	},
	nullFileName: function() {
		this.message = 'databaseManager#connect nullFileName';
		Error.captureStackTrace(this, DatabaseManager.nullFileName);
	},
	notConnected: function() {
		this.message = 'databaseManager#connect notConnected';
		Error.captureStackTrace(this, DatabaseManager.notConnected);
	},
	cannotRedefineDatabaseName: function() {
		this.message = 'databaseManager#connect cannotRedefineDatabaseName';
		Error.captureStackTrace(this, DatabaseManager.cannotRedefineDatabaseName);
	},
	isNotDatabaseType: function() {
		this.message = 'databaseManager#addDatabaseToPool isNotDatabaseType';
		Error.captureStackTrace(this, DatabaseManager.isNotDatabaseType);
	},
	databaseIsNotDefined: function() {
		this.message = 'databaseManager#addDatabaseToPool databaseIsNotDefined';
		Error.captureStackTrace(this, DatabaseManager.databaseIsNotDefined);
	},
	databaseIsNull: function() {
		this.message = 'databaseManager#addDatabaseToPool databaseIsNull';
		Error.captureStackTrace(this, DatabaseManager.databaseIsNull);
	},
	databaseIsNotOpen: function() {
		this.message = 'databaseManager#addDatabaseToPool databaseIsNotOpen';
		Error.captureStackTrace(this, DatabaseManager.databaseIsNotOpen);
	},
	databaseIsNotWorkingOnSameFile: function() {
		this.message = 'databaseManager#addDatabaseToPool databaseIsNotWorkingOnSameFile';
		Error.captureStackTrace(this, DatabaseManager.databaseIsNotWorkingOnSameFile);
	},
	createTableArgumentsUndefined: function() {
		this.message = 'databaseManager#createTable createTableArgumentsUndefined';
		Error.captureStackTrace(this, DatabaseManager.createTableArgumentsUndefined);
	},
	createTableNameIsUndefined: function() {
		this.message = 'databaseManager#createTable nameIsUndefined';
		Error.captureStackTrace(this, DatabaseManager.createTableNameIsUndefined);
	},
	createTableNameIsNull: function() {
		this.message = 'databaseManager#createTable nameIsNull';
		Error.captureStackTrace(this, DatabaseManager.createTableNameIsNull);
	},
	createTableNameIsNotString: function() {
		this.message = 'databaseManager#createTable createTableNameIsNotString';
		Error.captureStackTrace(this, DatabaseManager.createTableNameIsNotString);
	},
	createTableFieldsIsUndefined: function() {
		this.message = 'databaseManager#createTable createTableFieldsIsUndefined';
		Error.captureStackTrace(this, DatabaseManager.createTableNameFieldsIsUndefined);
	},
	createTableFieldsIsNotArray: function() {
		this.message = 'databaseManager#createTable createTableNameFieldsIsNotArray';
		Error.captureStackTrace(this, DatabaseManager.createTableNameFieldsIsNotArray);
	},
	createTableFieldsHasNoLength: function() {
		this.message = 'databaseManager#createTable createTableNameFieldsHasNoLength';
		Error.captureStackTrace(this, DatabaseManager.createTableNameFieldsHasNoLength);
	},
	createTableFieldIsNotObject: function() {
		this.message = 'databaseManager#createTable createTableNameFieldIsNotObject';
		Error.captureStackTrace(this, DatabaseManager.createTableNameFieldIsNotObject);
	},
	createTableFieldNameIsUndefined: function() {
		this.message = 'databaseManager#createTable createTableNameFieldNameIsUndefined';
		Error.captureStackTrace(this, DatabaseManager.createTableNameFieldNameIsUndefined);
	},
	createTableFieldNameIsNull: function() {
		this.message = 'databaseManager#createTable createTableNameFieldNameIsNull';
		Error.captureStackTrace(this, DatabaseManager.createTableNameFieldNameIsNull);
	},
	createTableFieldNameAlreadyExists: function() {
		this.message = 'databaseManager#createTable createTableNameFieldNameAlreadyExists';
		Error.captureStackTrace(this, DatabaseManager.createTableNameFieldNameAlreadyExists);
	},
	createTableFieldNameIsNotString: function() {
		this.message = 'databaseManager#createTable createTableNameFieldNameIsNotString';
		Error.captureStackTrace(this, DatabaseManager.createTableNameFieldNameIsNotString);
	},
	createTableFieldTypeIsUndefined: function() {
		this.message = 'databaseManager#createTable createTableNameFieldTypeIsUndefined';
		Error.captureStackTrace(this, DatabaseManager.createTableNameFieldTypeIsUndefined);
	},
	createTableFieldTypeIsNull: function() {
		this.message = 'databaseManager#createTable createTableFieldTypeIsNull';
		Error.captureStackTrace(this, DatabaseManager.createTableFieldTypeIsNull);
	},
	createTableFieldTypeIsNotString: function() {
		this.message = 'databaseManager#createTable createTableFieldTypeIsNotString';
		Error.captureStackTrace(this, DatabaseManager.createTableFieldTypeIsNotString);
	},
	createTableFieldTypeIsNotValidSqlite3Type: function() {
		this.message = 'databaseManager#createTable createTableFieldTypeIsNotValidSqlite3Type';
		Error.captureStackTrace(this, DatabaseManager.createTableFieldTypeIsNotValidSqlite3Type);
	},
	tableNameIsNotDefined: function() {
		this.message = 'databaseManager#insert tableNameIsNotDefined';
		Error.captureStackTrace(this, DatabaseManager.tableNameIsNotDefined);
	},
	tableNameIsNull: function() {
		this.message = 'databaseManager#insert tableNameIsNull';
		Error.captureStackTrace(this, DatabaseManager.tableNameIsNull);
	},
	tableNameIsNotString: function() {
		this.message = 'databaseManager#insert tableNameIsNotString';
		Error.captureStackTrace(this, DatabaseManager.tableNameIsNotString);
	},
	statementIsUndefined: function() {
		this.message = 'databaseManager#insert statementIsUndefined';
		Error.captureStackTrace(this, DatabaseManager.statementIsUndefined);
	},
	statementIsNull: function() {
		this.message = 'databaseManager#insert statementIsNull';
		Error.captureStackTrace(this, DatabaseManager.statementIsNull);
	},
	statementIsNotAnObject: function() {
		this.message = 'databaseManager#insert statementIsNotAnObject';
		Error.captureStackTrace(this, DatabaseManager.statementIsNotAnObject);
	},
	statementHasNoValues: function() {
		this.message = 'databaseManager#insert statementHasNoValues';
		Error.captureStackTrace(this, DatabaseManager.statementHasNoValues);
	}
};

Object.keys(DatabaseManager).forEach(function(key) {
	util.inherits(DatabaseManager[key], Error);
});

DatabaseManager.fileNameIsNotString.prototype.name = 'databaseManager.fileNameIsNotString';
DatabaseManager.fileDoesNotExist.prototype.name = 'databaseManager.fileDoesNotExist';
DatabaseManager.nullFileName.prototype.name = 'databaseManager.nullFileName';
DatabaseManager.notConnected.prototype.name = 'databaseManager.notConnected';
DatabaseManager.cannotRedefineDatabaseName.prototype.name = 'databaseManager.cannotRedefineDatabaseName';
DatabaseManager.isNotDatabaseType.prototype.name = 'databaseManager.isNotDatabaseType';
DatabaseManager.databaseIsNotDefined.prototype.name = 'databaseManager.databaseIsNotDefined';
DatabaseManager.databaseIsNotWorkingOnSameFile.prototype.name = 'databaseManager.databaseIsNotWorkingOnSameFile';
DatabaseManager.databaseIsNull.prototype.name = 'databaseManager.databaseIsNull';
DatabaseManager.databaseIsNotOpen.prototype.name = 'databaseManager.databaseIsNotOpen';
DatabaseManager.createTableArgumentsUndefined.prototype.name = 'databaseManager.createTableArgumentsUndefined';
DatabaseManager.createTableNameIsUndefined.prototype.name = 'databaseManager.createTableNameIsUndefined';
DatabaseManager.createTableNameIsNull.prototype.name = 'databaseManager.createTableNameIsNull';
DatabaseManager.createTableNameIsNotString.prototype.name = 'databaseManager.createTableNameIsNotString';
DatabaseManager.createTableFieldsIsUndefined.prototype.name = 'databaseManager.createTableFieldsIsUndefined';
DatabaseManager.createTableFieldsIsNotArray.prototype.name = 'databaseManager.createTableFieldsIsNotArray';
DatabaseManager.createTableFieldsHasNoLength.prototype.name = 'databaseManager.createTableFieldsHasNoLength';
DatabaseManager.createTableFieldNameIsUndefined.prototype.name = 'databaseManager.createTableFieldNameIsUndefined';
DatabaseManager.createTableFieldNameIsNull.prototype.name = 'databaseManager.createTableFieldNameIsNull';
DatabaseManager.createTableFieldNameAlreadyExists.prototype.name = 'databaseManager.createTableFieldNameAlreadyExists';
DatabaseManager.createTableFieldNameIsNotString.prototype.name = 'databaseManager.createTableNameIsNotString';
DatabaseManager.createTableFieldTypeIsUndefined.prototype.name = 'databaseManager.createTableFieldTypeIsUndefined';
DatabaseManager.createTableFieldTypeIsNull.prototype.name = 'databaseManager.createTableFieldTypeIsNull';
DatabaseManager.createTableFieldTypeIsNotString.prototype.name = 'databaseManager.createTableFieldTypeIsNotString';
DatabaseManager.createTableFieldTypeIsNotValidSqlite3Type.prototype.name = 'databaseManager.createTableFieldTypeIsNotValidSqlite3Type';
DatabaseManager.tableNameIsNotDefined.prototype.name = 'databaseManager.tableNameIsNotDefined';
DatabaseManager.tableNameIsNull.prototype.name = 'databaseManager.tableNameIsNull';
DatabaseManager.tableNameIsNotString.prototype.name = 'databaseManager.tableNameIsNotString';
DatabaseManager.statementIsUndefined.prototype.name = 'databaseManager.statementIsUndefined';
DatabaseManager.statementIsNull.prototype.name = 'databaseManager.statementIsNull';
DatabaseManager.statementIsNotAnObject.prototype.name = 'databaseManager.statementIsNotAnObject';
DatabaseManager.statementHasNoValues.prototype.name = 'databaseManager.statementHasNoValues';


module.exports = DatabaseManager;
