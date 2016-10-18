/*jslint node: true */
'use strict';
/** Controller: Field
*
*	An object representation of a sections fields
*
*
*	@version 0.1
*	@author David Allen
*	@exports Field
*
*******************************************************/
//TODO more descriptive error names
//TODO test every type in invalidtype tests
//TODO logs on a per request basis - grouping?
//TODO make section manager only accept frozen fields
//TODO check values for isNaN
//TODO split up the tests for each "thing"
//TODO use this: /*jslint node: true */ 'use strict'; in module
var debug = require('../utilities/debug');
var error = require('../error/field');
/**
*
* Constructor
*/

function Field(o) {

	this._name = null;
	this._type = null;
	this._id = null;
	this._value = null;
	this._parentSectionId = null;
	this._entryId = null;

	Object.seal(this);

	if(typeof o !== 'undefined') {
		if(typeof o.name !== 'undefined') {
			this.name = o.name;
		}

		if(typeof o.type !== 'undefined') {
			this.type = o.type;
		}

		if(typeof o.parentSectionId !== 'undefined') {
			this.parentSectionId = o.parentSectionId;
		}

		if(typeof o.value !== 'undefined') {
			this.value = o.value;
		}

		if(typeof o.entryId !== 'undefined') {
			this.entryId = o.entryId;
		}

		if(typeof o.id !== 'undefined') {
			this.id = o.id;
		}
	}

}

Object.defineProperty(Field.prototype, 'name', {
	get: function() {
		return this._name;
	},
	set: function(value) {
		try {
			if(value === null) {
				throw(new error.nullNameType);
			}
			if(typeof value !== 'string') {
				throw(new error.invalidNameType);
			}
			this._name = value;
		}
		catch(error) {
			debug.log(error, 'error');
			throw(error);
		}
	},
	enumerable: true
});

Object.defineProperty(Field.prototype, 'type', {
	get: function() {
		return this._type;
	},
	set: function(value) {

		try {

			if(value === null) {
				throw(new error.nullFieldTypeParameter);
			}

			if(typeof value !== 'string') {
				throw(new error.invalidFieldTypeParameter);
			}

			value = value.toUpperCase();
			switch(value) {
				//intentional fall through, all these types are allowed
				case 'NULL':
				case 'INTEGER':
				case 'TEXT':
				case 'BLOB':
					this._type = value;
					break;
				default:
					throw(new error.invalidSQLite3Type);
			}
		}
		catch(error) {
			debug.log(error, 'error');
			throw(error);
		}

	},
	enumerable: true
});

Object.defineProperty(Field.prototype, 'value', {
	get: function() {
		return this._value;
	},
	set: function(newValue) {
		try {
			var type = this.typesToSQLite3(newValue);
			if(this.type) {
				if(this.type !== type) {
					throw(new error.valueDoesNotMatchType);
				}
			}
			if(typeof newValue === 'number' && Number.isNaN(newValue)) {
				throw(new error.nanValueType);
			}
			this._value = newValue;
		}
		catch(error) {
			debug.log(error, 'error');
			throw(error);
		}

	},
	enumerable: true,
	configurable: false
});

Object.defineProperty(Field.prototype, 'id', {
	get: function() {
		return this._id;
	},
	set: function(value) {
		try {
			if(typeof value !== 'number') {
				throw(new error.invalidIdType);
			}
			this._id = value;
		}
		catch(error) {
			debug.log(error, 'error');
			throw(error);
		}
	},
	enumerable: true
});

Object.defineProperty(Field.prototype, 'parentSectionId', {
	get: function() {
		return this._parentSectionId;
	},
	set: function(value) {
		try {
			if(typeof value === 'number' && Number.isNaN(value)) {
				throw(new error.nanParentSectionIdType);
			}
			if(typeof value !== 'number') {
				throw(new error.invalidParentSectionIdType);
			}
			this._parentSectionId = value;
		}
		catch(error) {
			debug.log(error, 'error');
			throw(error);
		}

	},
	enumerable: true
});

Object.defineProperty(Field.prototype, 'entryId', {
	get: function() {
		return this._entryId;
	},
	set: function(value) {
		try {
			if(typeof value === 'number' && Number.isNaN(value)) {
				throw(new error.nanEntryIdType);
			}
			if(typeof value !== 'number') {
				throw(new error.invalidEntryIdType)
			}
			this._entryId = value;
		}
		catch(error) {
			debug.log(error, 'error');
			throw(error);
		}
	}
});

Field.prototype.freeze = function() {
	try {
		if(Object.isFrozen(this)) {
			throw(new error.isFrozen);
		}
		Object.freeze(this);
	}
	catch(error) {
			debug.log(error, 'error');
			throw(error);
	}
};

Field.prototype.typesToSQLite3 = function(type) {

	try {
		//TODO this doesn't edit the object so we should probably just let peopl use it
		if(Object.isFrozen(this)) {
			throw(new error.isFrozen);
		}
		var sqliteType;
		var valueType = typeof type;

		if(type === Number.isNaN(type)) {
				sqliteType = "INVALID";
		}
		else if(type !== null) {
			switch(valueType) {
				case 'number':
					sqliteType = (Number(valueType) === valueType && valueType % 1 === 0) ? "INT" : "FLOAT";
					break;
				case 'string':
					sqliteType = "TEXT";
					break;
				case 'boolean':
					sqliteType = "INT";
					break;
				case 'undefined':
					sqliteType = "NULL";
					break;
				case 'array':
				case 'object':
				case 'function':
				default:
					sqliteType = "INVALID";

			}
		}
		else {
			sqliteType = "NULL";
		}
		return sqliteType;

	}
	catch(error) {
		debug.log(error, 'error');
		throw(error);
	}
};

module.exports = Field;
module.exports.test = function() {
	module.exports.error = error;
	debug.off();
	return Field;
}();
