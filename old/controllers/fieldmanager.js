/** Controller: Field Manager
*
*	Controls creating, editing, updating and deleting fields
*
*
*	@version 0.1
*	@author David Allen
*	@exports App
*
*******************************************************/
//TODO standardise field placements in database calls
//TODO standardise todo placements
/**
* Requires
*
*/
var databaseManager = require("./databasemanager");

var Field = require("./field");
var Q = require('q');

var debug = require('../utilities/debug');

/**
* add
*
* Adds a new field to the s_fields table
*
* @param {object} fieldData The data of the field containing: fieldName, parentSectionId
* @param {string} fieldType The type of field
* @param {function} callback A callback to be called when the field is added
*
*/
FieldManager = {
	addField: function(field) {
		debug.log('fieldManager::addField ', 'log');
		if(Function.verifyArguments(arguments, ["Field"])) {
			return Q.Promise(
				function(resolve, reject) {
					if(field.name === 'undefined') {
						debug.log('fieldManager::addField field name is not defined', 'error');
						reject(new Error("field name is not defined"));
					}

					if(field.parentSectionId === 'undefined' || isNaN(field.parentSectionId)) {
						debug.log('fieldManager::addField parent section id is not defined', 'error');
						reject(new Error("field parent section ID is not defined"));
					}

					debug.log('fieldManager::addField checking if fields already exist', 'log');
					databaseManager.select('s_fields', {'select': ['id'], "where": {"fieldName": field.name, "parentSectionId": parseInt(field.parentSectionId)}})
					.then(function(result) {
						//only if these fields don't exist for this section
						if(0 === result.length) {
							debug.log('fieldManager::addField creating new fields', 'log');
							databaseManager.insert('s_fields', {"parentSectionId": parseInt(field.parentSectionId), "fieldName": field.name, "fieldType": field.type})
							.then(function(id) {
								debug.log('fieldManager::addField added field with id ' + id, 'log');
								if(id.length === 0) {
									debug.log('fieldManager::addField field not created', 'error');
									//TODO handle rollback
									reject(new Error("insert failure"));
								}
								else {
									debug.log('fieldManager::addField creating new table for field data', 'log');
									databaseManager.createTable({
										name: 's_field_' + id,
										fields: [
											{
												name: 'entryId',
												value: 'INTEGER'
											},
											{
												name: 'value',
												value: field.type
											}
										]
									})
									.then(resolve())
									.fail(function(error) {
										debug.log('fieldManager::addField ' + error, 'error');
										reject(new Error(error));
									});
								}
							})
							.fail(function(error) {
								debug.log('fieldManager::addField ' + error, 'error');
								reject(new Error(error));
							});
						}
						else {
							reject(function(error) {
								debug.log('fieldManager::addField ' + error, 'error');
								reject(new Error(error));
							});
						}
					})
					.fail(function (error) {
						debug.log('fieldManager::addField ' + error, 'error');
						reject(new Error(error));
					});
				});
		}
	},
	remove: function() {
		if(Function.verifyArguments(arguments, ["Object", "Function"])) {

		}
	},
	fetchByID: function() {
		if(Function.verifyArguments(arguments, ["Object", "Function"])) {

		}
	},
	fetchByName: function() {
		if(Function.verifyArguments(arguments, ["Object", "Function"])) {

		}
	},
	fetchAll: function() {
		if(Function.verifyArguments(arguments, ["Object", "Function"])) {

		}
	},
	fetchAllFromSectionName: function() {
		if(Function.verifyArguments(arguments, ["Object", "Function"])) {

		}
	},
	fetchAllFromSectionId: function(id) {
		debug.log('fieldManager::fetchAllFromSectionId ', 'log');
		if(Function.verifyArguments(arguments, ["Number"])) {
			return Q.Promise(
				function(resolve, reject) {
					debug.log('fieldManager::fetchAllFromSectionId querying database', 'log');
					databaseManager.select('s_fields', {'where': {'parentSectionId' : id} })
					.then(function(results) {
						if(0 === results.length) {
							debug.log('fieldManager::fetchAllFromSectionId no fields for this section', 'error');
							reject(new Error('No fields for this section'));
						}
						var fields = {};
						debug.log('fieldManager::fetchAllFromSectionId creating field objects', 'log');
						results.forEach(function(value, index) {
							fields[value.fieldName] = new Field({'name': value.fieldName, 'type': value.fieldType, 'parentSectionId' : value.parentSectionId, 'id': value.id});
						});
						resolve(fields);
					})
					.fail(function(error) {
						debug.log('fieldManager::fetchAllFromSectionId ' + error, 'error');
						reject(new Error(error));
					});
			});

		}
	}
};

module.exports = FieldManager;
