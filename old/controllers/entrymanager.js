/** Controller: Entry Manager
*
*	Handles all entries to the database
*
*
*	@version 0.1
*	@author David Allen
*	@exports App
*
*******************************************************/
//TODO make sure verifyArguments throws error
//TODO make debug mode where console.log logs everything with levels.
//TODO add breakpoints and debug suite.
//TODO make test suite.
/**
* Requires
*
*/

var sectionManager = require('./sectionmanager');
var databaseManager = require('./databasemanager');
var fieldManager = require('./fieldmanager');
var Entry = require('./entry');
var Q = require('q');

var debug = require('../utilities/debug');

/**
* add
*
* Given a sectionId, creates a new entry in the database related to that section under s_entries
*
* @param {object} entryObject An object that contains the section id and field values
* @param {function} callback A callback to be called when the section is added
*
*/
var EntryManager = {
	remove: function(entryObject) {

	},
	fetchById: function(id) {
		debug.log('entryManager::fetchById ', 'log');
		if(Function.verifyArguments(arguments, ["Number"])) {
			return Q.Promise(
				function(resolve, reject) {
					debug.log('entryManager::fetchById querying database', 'log');
					databaseManager.select(['*'], {'where': {'id' : id}})
					.then(function(foundEntry) {
						debug.log('entryManager::fetchById found entry with id ' + id, 'log');
						process.exit();
						debug.log('entryManager::fetchById generating entry object', 'log');
						var entry = new Entry();
						entry.parentSectionId = foundEntr

						fieldManager.fetchAllFromSectionId(foundEntry.parentSectionId)
						.then(function(fields){
							if(!fields) {
								debug.log('entryManager::fetchById not fields for this entry ', 'error');
								reject(new Error("entryManager::fetchById : No fields for this entry"));
							}

							entry.parentSectionId = sectionId;

							Object.keys(entryFields).forEach(function(key) {
								entry.addField(entryFields[key]);
							});

							resolve(entry);
						})
						.fail(function(error) {
							debug.log('entryManager::fetchById ' + error, 'error');
							reject(error);
						});
					})
					.fail(function(error) {
						debug.log('entryManager::fetchById ' + error, 'error');
						reject(error);
					});

			});
		}
	},
	fetchAllBySectionId: function(sectionId) {

	},
	fetchAllBySectionName: function(sectionName) {

	},
	fetchByFieldValue: function(field) {

	}
};
module.exports = EntryManager;
