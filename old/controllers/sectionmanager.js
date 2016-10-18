/** Controller: Section Manager
*
*	Controls creating, editing, updating and deleting sections
*
*
*	@version 0.1
*	@author David Allen
*	@exports App
*
*******************************************************/
//TODO move to using Q.all and Q.spread.
//TODO standardise ID vs Id
//TODO make sure all .then has a .fail that rejects upwards - doing
//TODO move tablenames into config
//TODO standardise e vs error

/**
* Requires
*
*/

var databaseManager = require("./databasemanager");
var fieldManager = require("./fieldmanager");

var Entry = require("./entry");
var Section = require("./section");

var Q = require('q');

var debug = require('../utilities/debug');


/**
* add
*
* Adds a new section to the s_sections table
*
* @param {object} sectionName The name of the section - {"name" : sectionName}
* @param {function} callback A callback to be called when the section is added
*
*/

var SectionManager = {
	fetchById: function(id) {

	},
	fetchByName: function(name) {
		debug.log('sectionManager::fetchByName ', 'log');
		if(Function.verifyArguments(arguments, ["String"])) {
			return Q.Promise(
				function(resolve, reject) {
						if(name === 'undefined') {
							debug.log('sectionManager::fetchByName table name not defined', 'error');
						}

						debug.log('sectionManager::fetchByName querying database', 'log');
						databaseManager.select('s_sections', {'where': {'sectionName': name}})
						.then(function(result) {
							debug.log('sectionManager::fetchByName found results', 'log');
							resolve(result);
						})
						.fail(function(error) {
							debug.log('sectionManager::fetchByName ' + error, 'error');
							reject(new Error(error));
						});
				}
			);
		}
	},
	fetchAll: function() {

	},
	/**
	* createNew
	*
	* Commits a new section and related fields to the database by calling the field manager recursively with the newly
	* created section id
	* To create new fields for a section, pass these in as field objects to Section.addField, they will
	* be automatically created with the new section as it's parent section id
	*
	* @param {object} sectionObject A key/value SectionObject
	*
	*/
	createNew: function(sectionObject) {
		debug.log('sectionManager::createNew ', 'log');
		if(Function.verifyArguments(arguments, ["Section"])) {
			return Q.Promise(
				function(resolve, reject) {

					var fieldKeys = Object.keys(sectionObject.fields);

					if(typeof sectionObject.name === "undefined") {
						debug.log('sectionManager::createNew section name is not defined ', 'error');
						reject(new Error('Name not defined'));
					}

					if(fieldKeys < 1) {
						debug.log('sectionManager::createNew no fields', 'error');
						reject(new Error('No fields'));
					}
					//check to see if section exists
					debug.log('sectionManager::createNew checking section existance', 'log');
					SectionManager.fetchByName(sectionObject.name)
					.then(function(result) {
						//we only want to make a new section if one with this name doesn't already exist
						if(result.length === 0) {
							debug.log('sectionManager::createNew section does not exist, inserting', 'log');
							databaseManager.insert('s_sections', {"sectionName" : sectionObject.name})
							.then(function(id) {
								if(!id) {
									debug.log('sectionManager::createNew section not created', 'error');
									//TODO handle rollback
								}

								debug.log('sectionManager::createNew adding fields', 'log');
								var promises = [];
								fieldKeys.forEach(function (key) {
									sectionObject.fields[key].parentSectionId = id;
									promises.push(fieldManager.addField(sectionObject.fields[key]));
								});
								Q.all(promises)
								.then(function() {
									debug.log('sectionManager::createNew success, id is ' + id, 'log');
									resolve(parseInt(id));
								})
								.fail(function(error) {
									//TODO roll back
									//TODO SQL log
									debug.log('sectionManager::createNew fields not created', 'error');
									reject(new Error(error));
								});
							})
							.fail(function(error) {
								debug.log('sectionManager::createNew ' + error, 'error');
								reject(new Error(error));
							});
						}
						else {
							debug.log('sectionManager::createNew section already exists', 'error');
							reject(new Error('sectionManager::createNew : Section already defined'));
						}
					})
					.fail(function(error) {
						debug.log('sectionManager::createNew ' + error, 'error');
						reject(new Error(error));
					});
				});
		}
	},
	remove: function() {

	},
	createNewEntryForSection: function(sectionId) {
		debug.log('sectionManager::createNewEntryForSection ', 'log');
		if(Function.verifyArguments(arguments, ["Number"])) {
			return Q.Promise(
				function(resolve, reject) {
					debug.log('sectionManager::createNewEntryForSection fetching related fields ', 'log');
					fieldManager.fetchAllFromSectionId(sectionId)
					.then(function(entryFields) {
							if(!entryFields) {
								debug.log('sectionManager::createNewEntryForSection no fields for this section', 'error');
								reject(new Error("sectionManager::createNewEntryForSection : No fields for Section"));
							}

							debug.log('sectionManager::createNewEntryForSection generating entry object', 'log');
							var entry = new Entry();
							entry.parentSectionId = sectionId;

							Object.keys(entryFields).forEach(function(key) {
								entry.addField(entryFields[key]);
							});

							debug.log('sectionManager::createNewEntryForSection returning entry', 'log');
							resolve(entry);
					})
					.fail(function(error) {
							debug.log('sectionManager::createNewEntryForSection ' + error, 'error');
							reject(new Error(error));
					});
				});
		}
	}
};

module.exports = SectionManager;
