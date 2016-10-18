/** Controller: Section
*
*	An object representation of a sections fields
*
*
*	@version 0.1
*	@author David Allen
*	@exports Section
*
*******************************************************/
'use strict';
var debug = require('../utilities/debug');
var error = require('../error/section');
/**
*
* Constructor
*/


function Section(o) {
	debug.log("Section#constructor with an " + typeof o + " object constructor", 'log');
	this._fields = null;
	this._id = null;
	this._name = null;

	Object.seal(this);

	if(typeof o !== 'undefined') {
		if(typeof o.name !== 'undefined') {
			this.name = o.name;
		}

		if(typeof o.fields !== 'undefined') {
			Object.keys(o.fields).forEach(function(value, index) {
				this.addField(o.fields[value]);
			}.bind(this));
		}
	}
}

Object.defineProperty(Section.prototype, 'id', {
	get: function() {
		return this._id;
	},
	set: function(value) {
		try {
			if(value === null) {
				throw(new error.nullIdType());
			}
			if(typeof value !== 'number') {
				throw(new error.invalidIdType());
			}
			if(Number.isNaN(value)) {
				throw(new error.nanIdType);
			}
			else {
				this._id = value;
			}
		}
		catch(error)
		{
			debug.log(error.message, 'error');
			throw(error);
		}

	},
	enumerable: true,
	configurable: false
});

Object.defineProperty(Section.prototype, 'name', {
	get: function() {
		return this._name;
	},
	set: function(value) {
		try {
			if(value === null) {
				throw(new error.nullNameType());
			}
			if(typeof value !== 'string') {
				throw(new error.invalidNameType());
			}
			else {
				this._name = value;
			}
		}
		catch(error) {
			debug.log(error.message, 'error');
			throw(error);
		}
	},
	enumerable: true,
	configurable: false
});

Object.defineProperty(Section.prototype, 'fields', {
	get: function() {
		if(this._fields === null) {
			this._fields = {};
		}
		return this._fields;
	},
	set: function(value) {
		try {
			if(this._fields === null) {
				this._fields = {};
			}
			this._fields[value.name] = value;
		}
		catch(error) {
			debug.log(error, 'error');
			throw(error);
		}
	},
	enumerable: true,
	configurable: false
});

Section.prototype.addField = function(field) {
	try {
		if(Object.isFrozen(this)) {
			throw(new error.isFrozen());
		}
		if(field === null) {
			throw(new error.nullFieldType());
		}

		if(field.constructor.name !== 'Field') {
			throw(new error.invalidFieldType());
		}

		if(typeof field.parentSectionId !== 'undefined' && field.parentSectionId !== this.id) {
			throw(new error.invalidFieldId());
		}

		this.fields = field;
		return;
	}
	catch(error) {
			debug.log(error.message, error);
			throw(error);
	}
};

Section.prototype.freeze = function() {
	if(Object.isFrozen(this)) {
		throw(new error.isFrozen());
	}
	Object.keys(this.fields).forEach(function(key) {
		this.fields[key].freeze();
	}.bind(this));
	Object.freeze(this);
};

module.exports = Section;
//Turn off debug logs for test suite
module.exports.test = function() {
	//send the errors along with the section to test the error
	module.exports.error = error;
	debug.off();
	return Section;
}();
