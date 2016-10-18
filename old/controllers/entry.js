/** Controller: Entry
*
*	An object representation of a sections fields
*
*
*	@version 0.1
*	@author David Allen
*	@exports Section
*
*******************************************************/
//TODO make all methods first debug.log show more info like .save here

/**
*
* Constructor
*/

var fieldManager = require("./fieldmanager");
var databaseManager = require("./databasemanager");
var Q = require('q');

var debug = require('../utilities/debug');

function Entry(o) {

	var _fields = {};
	var _id,
		_parentSectionId;

	Object.defineProperty(this, 'is', {
		get: function() {
			return "Entry";
		},
		enumerable: true,
		configurable: false
	});

	Object.defineProperty(this, 'id', {
		get: function() {
			return _id;
		},
		set: function(value) {
			_id = value;
		},
		enumerable: true
	});

	Object.defineProperty(this, 'fields', {
		get: function() {
			return _fields;
		},
		set: function(fields) {
			_fields = fields;
		},
		enumerable: true,
		configurable: false
	});

	Object.defineProperty(this, 'parentSectionId', {
		get: function() {
			return _parentSectionId;
		},
		set: function(id) {
			_parentSectionId = id;
		},
		enumerable: true
	});

	if(typeof o !== 'undefined') {
		for(var property in o) {
			this[property] = o[property];
		}
	}

	Object.seal(this);

}

Entry.prototype.save = function() {
	debug.log('entry::save id: ' + this.id + ' parentdId: ' + this.parentSectionId + ' fields: ' + this.fields , 'log');

	var self = this;
	return Q.promise(function(resolve, reject) {
		debug.log('entry::save testing parentSectionId', 'log');
		if(this.parentSectionId === 'undefined') {
			debug.log('entry::save no parentSectionId', 'error');
	 		reject(new Error('entry::save : No parentSectionId'));
	 	}

		debug.log('entry::save testing entry id', 'log');
		if(self.id) {
			debug.log('entry::save id found, checking database for entry', 'log');
			databaseManager.select('s_entries', {'where': {'id': self.id}})
			.then(function(result) {
				debug.log('entry::save testing if we have results', 'log');
				if(0 === result.length) {
					debug.log('entry::save entry not found in database, incorrect id', 'error');
					reject('entry::save : entry has id but doesnt exist in database');
				}
				else if(result.length > 1) {
					debug.log('entry::save found multiple entries with this id', 'error');
					reject('entry::save : multiple results returned, should only be one. cannot continue.');
				}
				else {
					result = result[0];
					debug.log('entry::save creating entry update', 'log');

					debug.log('entry::save creating the statement', 'log');
					Object.keys(self.fields).forEach(function(value, index) {

						var promises = [];
						var clause = {};
						clause.update = {};
						clause.where = {'id': self.id};
						clause.update.value = self.fields[value].value;

						debug.log('entry::save clause for field update: ' + clause, 'log');
						promises.push(databaseManager.update('s_field_' + self.id, clause));

						Q.all(promises)
						.then(function(result) {
							debug.log('entry::save entry updated', 'log');
							resolve(result);
						})
						.fail(function(error){
							debug.log('entry::save ' + error, 'error');
							reject(new Error(error));
						});
					});
				}

			})
			.fail(function(error) {
				debug.log('entry::save ' + error, 'error');
				reject(new Error(error));
			});
		}
		else {
			debug.log('entry::save id not found, creating new entry', 'log');
			debug.log('entry::save inserting entry into database', 'log');
			databaseManager.insert('s_entries', {'parentSectionId': self.parentSectionId})
			.then(function(id) {
				debug.log('entry::save inserted entry into entries table', 'log');

				var promises = [];
				debug.log('entry::save inserting entry fields into database', 'log');
				Object.keys(self.fields).forEach(function(value, index) {
					promises.push(databaseManager.insert('s_field_' + self.fields[value].id, {'entryId': self.fields[value].id, 'value': self.fields[value].value}));
				});

				Q.all(promises).then(function() {
					debug.log('entry::save fields saved', 'log');
					self.id = id;
					resolve(id);
				})
				.fail(function(error) {
					debug.log('entry::save error ' + error, 'error');
					reject(new Error("entry::save : " + error));
				});
			});
		}
	});
};

Entry.prototype.updateField = function(field) {
	debug.log('entry::updateField', 'log');
	try {
		if(field.name === 'undefined') {
			throw new Error("Field name not defined");
		}
		if(field.value === 'undefined') {
			return;
		}
		//TODO field validation
		this.fields[field.name].value = field.value;
		return;
	}
	catch(error) {
			debug.log('entry::updateField' + error, 'error');
			process.exit();
	}
};

Entry.prototype.addField = function(field) {
	debug.log('entry::addField ', 'log');
	try {
		if(field.constructor.name !== 'Field') {
			throw new Error("Not a Field object");
		}
		if(field.parentSectionId !== this.parentSectionId || !'undefined') {
			throw new Error("This field does not belong to this section");
		}

		this.fields[field.name] = field;
		return;
	}
	catch(error) {
			debug.log('entry::updateField ' + error , 'error');
			process.exit();
	}
};


module.exports = Entry;
