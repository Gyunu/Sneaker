'use strict';
var util = require('util');

var Section = {
	invalidNameType: function() {
		this.message = 'Section.name#set value is invalid';
		Error.captureStackTrace(this, Section.invalidNameType);
	},
	nullNameType: function() {
		this.message = 'Section.name#set value is null';
		Error.captureStackTrace(this, Section.nullNameType);
	},
	invalidFieldType: function() {
		this.message = 'Section.name#set expecting Field type';
		Error.captureStackTrace(this, Section.invalidFieldType);
	},
	nullFieldType: function() {
		this.message = 'Section.name#set field is null';
		Error.captureStackTrace(this, Section.nullFieldType);
	},
	invalidFieldId: function() {
		this.message = 'Section.#setField field parentSectionId does not match this section id';
		Error.captureStackTrace(this, Section.invalidFieldId);
	},
	invalidIdType: function() {
		this.message = 'Section.id#set expecting Number Type';
		Error.captureStackTrace(this, Section.invalidIdType);
	},
	nullIdType: function() {
		this.message = 'Section.id#set id is null';
		Error.captureStackTrace(this, Section.nullIdType);
	},
	nanIdType: function() {
		this.message = 'Section.id#set id is NaN';
		Error.captureStackTrace(this, Section.nanIdType);
	},
	isFrozen: function() {
		this.message = 'This object is frozen,';
		Error.captureStackTrace(this, Section.isFrozen);
	}
};

Object.keys(Section).forEach(function(key) {
	util.inherits(Section[key], Error);
});

Section.invalidNameType.prototype.name = 'Section.invalidNameType';
Section.nullNameType.prototype.name = 'Section.nullNameType';
Section.invalidFieldType.prototype.name = 'Section.invalidFieldType';
Section.nullFieldType.prototype.name = 'Section.nullFieldType';
Section.invalidFieldId.prototype.name = 'Section.invalidFieldId';
Section.invalidIdType.prototype.name = 'Section.invalidIdType';
Section.nullIdType.prototype.name = 'Section.nullIdType';
Section.nanIdType.prototype.name = 'Section.nanIdType';
Section.isFrozen.prototype.name = 'Section.isFrozen';


module.exports = Section;
