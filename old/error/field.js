'use strict';
var util = require('util');

var Field = {
	invalidNameType: function() {
		this.message = 'Field.name#set value is invalid';
		Error.captureStackTrace(this, Field.invalidNameType);
	},
	nullNameType: function() {
		this.message = 'Field.name#set value is null';
		Error.captureStackTrace(this, Field.nullNameType);
	},
	invalidFieldTypeParameter: function() {
		this.message = 'Field.type#set invalid Field Type Parameter';
		Error.captureStackTrace(this, Field.invalidFieldTypeParameter);
	},
	nullFieldTypeParameter: function() {
		this.message = 'Field.type#set null Field Type Parameter';
		Error.captureStackTrace(this, Field.nullFieldTypeParameter);
	},
	invalidSQLite3Type: function() {
		this.message = 'Field.type#set invalid SQLite3 type';
		Error.captureStackTrace(this, Field.invalidSQLite3Type);
	},
	valueDoesNotMatchType: function() {
		this.message = 'Field.value#set value does not match the field type';
		Error.captureStackTrace(this, Field.valueDoesNotMatchType);
	},
	invalidValueType: function() {
		this.message = 'Field.value#set value does not match the SQLite3 type';
		Error.captureStackTrace(this, Field.invalidValueType);
	},
	nanValueType: function() {
		this.message = 'Field.value#set value is NaN';
		Error.captureStackTrace(this, Field.nanValueType);
	},
	invalidEntryIdType: function() {
		this.message = 'Field.entryId#set entryId is not a number';
		Error.captureStackTrace(this, Field.invalidEntryIdType);
	},
	nanEntryIdType: function() {
		this.message = 'Field.entryId#set entryId is not a number';
		Error.captureStackTrace(this, Field.nanEntryIdType);
	},
	invalidParentSectionIdType: function() {
		this.message = 'Field.parentSectionId#set parentSectionId is not a number';
		Error.captureStackTrace(this, Field.invalidParentSectionIdType);
	},
	nanParentSectionIdType: function() {
		this.message = 'Field.parentSectionId#set parentSectionId is NaN type';
		Error.captureStackTrace(this, Field.nanParentSectionIdType);
	},
	invalidIdType: function() {
		this.message = 'Field.id#set id is not a number';
		Error.captureStackTrace(this, Field.invalidIdType);
	},
	isFrozen: function() {
		this.message = 'Field is Frozen';
		Error.captureStackTrace(this, Field.isFrozen);
	}
};

Object.keys(Field).forEach(function(key) {
	util.inherits(Field[key], Error);
});

Field.invalidNameType.prototype.name = 'Field.invalidNameType';
Field.nullNameType.prototype.name = 'Field.nullNameType';
Field.invalidFieldTypeParameter.prototype.name = 'Field.invalidFieldTypeParameter';
Field.nullFieldTypeParameter.prototype.name = 'Field.nullFieldTypeParameter';
Field.invalidSQLite3Type.prototype.name = 'Field.invalidSQLite3Type';
Field.invalidValueType.prototype.name = 'Field.invalidValueType';
Field.nanValueType.prototype.name = 'Field.nanValueType';
Field.invalidEntryIdType.prototype.name = 'Field.invalidEntryIdType';
Field.nanEntryIdType.prototype.name = 'Field.nanEntryIdType';
Field.invalidParentSectionIdType.prototype.name = 'Field.invalidParentSectionEntryIdType';
Field.nanParentSectionIdType.prototype.name = 'Field.nanParentSectionEntryIdType';
Field.invalidIdType.prototype.name = 'Field.invalidIdType';
Field.isFrozen.prototype.name = 'Field.isFrozen';


module.exports = Field;
