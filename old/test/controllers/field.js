module.exports = function(assert, Field, types) {
		/*jslint node: true */
		'use strict';
		describe('Field', function() {
			describe('#constructor', function() {
				it('Should return a new field object', function() {
					var field = new Field();
					assert(field.constructor.name === 'Field');
				});
				it('Should be sealed', function() {
					var field = new Field();
					assert(Object.isSealed(field));
				});
				describe('Construct with argument object', function() {

					it('Should take an optional constructor object', function() {
						var field = new Field({});
						assert(field.constructor.name === "Field");
					});
					it('Should return a valid object when a valid constructor object is used', function() {
						var o = {
							name: 'test',
							type: 'TEXT',
							id: 1,
							entryId: 500,
							parentSectionId: 3,
							value: 'Foo'
						};

						var field = new Field(o);
						assert(field.constructor.name === 'Field');
						assert.equal(field.name, o.name, 'Name is set properly');
						assert.equal(field.type, o.type, 'Type is set properly');
						assert.equal(field.id, o.id, 'Id is set properly');
						assert.equal(field.entryId, o.entryId, 'EntryId is set properly');
						assert.equal(field.parentSectionId, o.parentSectionId, 'parentSectionId is set properly');
						assert.equal(field.value, o.value, 'Value is set properly');
				});
			});
			describe('#name', function() {
				describe('set', function() {
					it('Should be able to set name', function() {
						var f = new Field();
						f.name = types.string;
						assert.equal(f.name, types.string);
					});
					it('Should throw an error if name is set to null', function() {
						var f = new Field();
						assert.throw(function(){
							f.name = types.null;
						}, Field.error.nullNameType);
					});
					it('Should throw an error if name is not a string', function() {
						var f = new Field();
						Object.keys(types).forEach(function(key) {
							if(key === 'string' || key === 'null') {
								return;
							}
							assert.throw(function() {
								f.name = types[key];
							});
						}, Field.error.invalidNameType);
					});
				});
				describe('get', function() {
					it('Should be able to get name', function() {
						var name = 'test';
						var field = new Field();
						field.name = name;
						assert.equal(field.name, name);
					});
				});
			});
			describe('#type', function() {
				describe('set', function() {
					it('Should be able to set type', function() {
						var type = 'text';
						var field = new Field();
						//field auto converts to uppercase
						field.type = type;
						assert.equal(field.type, type.toUpperCase());
					});
					it('Should throw error if not a valid SQLite3 type', function() {
						var field = new Field();
						Object.keys(types).forEach(function(key) {
							//test null seperately
							if(key === 'null') {
								return;
							}
							var sqlite3type = field.typesToSQLite3(types[key]);
							if(sqlite3type === 'INVALID') {
								assert.throws(function(){field.type = sqlite3type;}, Field.error.invalidSQLite3Type);
							}
						});
					});
					it('Should throw error if type is null', function() {
						var field = new Field();
							assert.throw(function() {field.type = types.null}, Field.error.nullFieldTypeParameter);
					});
				});
				describe('get', function() {
					it('Should be able to get type', function(){
						var type = 'TEXT';
						var field = new Field({type: type});
						assert.equal(field.type, type);
					});
				});
			});
			describe('#value', function() {
				describe('set', function() {
					it('Should be able to set value', function() {
						var field = new Field();
						var value = 1;
						field.value = value;
						assert.equal(field.value, value);
					});
					it('Should throw error is value is NaN', function() {
						var field = new Field();
						var value = types.NaN;
						assert.throw(function() {
							field.value = value;
						}, Field.error.nanValueType);
					});
					it('Should throw error if value does not match type TEXT', function(){
						Object.keys(types).forEach(function(key) {
							if(typeof types[key] === 'string') {
								return;
							}
							var field = new Field({
								type: 'text'
							});
							assert.throw(function(){field.value = types[key];}, Field.error.valueDoesNotMatchType);
						});
					});
					it('Should throw error if value does not match type INT', function(){
						Object.keys(types).forEach(function(key) {
							//booleans are stored as 0 or 1.
							if(key === 'number' || key === 'boolean') {
								return;
							}

							var field = new Field({
								type: 'integer'
							});
							assert.throw(function(){field.value = types[key];}, Field.error.valueDoesNotMatchType);
						});
					});
					it('Should throw error if value does not match type NULL', function(){
						Object.keys(types).forEach(function(key) {
							//booleans are stored as 0 or 1.
							if(key === 'null') {
								return;
							}

							var field = new Field({
								type: 'null'
							});
							assert.throw(function(){field.value = types[key];}, Field.error.valueDoesNotMatchType);
						});
					});
					it('Should throw error if value does not match type BLOB', function(){
						Object.keys(types).forEach(function(key) {
							//booleans are stored as 0 or 1.
							if(key === 'object' || key === 'array') {
								return;
							}

							var field = new Field({
								type: 'blob'
							});
							assert.throw(function(){field.value = types[key];}, Field.error.valueDoesNotMatchType);
						});
					});
				});
			});
			describe('#parentSectionId', function() {
				describe('set', function() {
					it('Should be able to set parentSectionId', function() {
						var field = new Field();
						var parentSectionId = 1;
						field.parentSectionId = parentSectionId;
						assert.equal(field.parentSectionId, parentSectionId);
					});
					it('Should throw an error if parentSectionId type is invalid', function() {
						var field = new Field();
						Object.keys(types).forEach(function(key) {
							if(key === 'number' || Number.isNaN(key)) {
								return;
							}
							assert.throw(function() {
								field.parentSectionId = types[key];
							}, Field.invalidParentSectionIdType);
						});
					});
					it('Should throw an error if parentSectionId type is NaN', function() {
						var field = new Field();
						assert.throw(function() {
							field.parentSectionId = types.NaN;
						}, Field.error.nanParentSectionIdType);
					});
				});
				describe('get', function() {
					it('Should be able to get parentSectionId', function() {
						var field = new Field();
						var parentSectionId = 10000;
						field.parentSectionId = parentSectionId;
						assert.equal(field.parentSectionId, parentSectionId);
					});
				});
			});
			describe('#entryId', function() {
				describe('set', function() {
					it('Should be able to set entryId', function() {
						var field = new Field();
						var entryId = 1;
						field.entryId = entryId;
						assert.equal(field.entryId, entryId);
					});
					it('Should throw an error if entryId type is invalid', function() {
						var field = new Field();
						Object.keys(types).forEach(function(key) {
							if(key === 'number' || Number.isNaN(key)) {
								return;
							}
							assert.throw(function() {
								field.entryId = types[key];
							}, Field.invalidEntryIdType);
						});
					});
					it('Should throw an error if entryId type is NaN', function() {
						var field = new Field();
						assert.throw(function() {
							field.entryId = types.NaN;
						}, Field.error.nanentryIdType);
					});
				});
				describe('get', function() {
					it('Should be able to get entryId', function() {
						var field = new Field();
						var entryId = 10000;
						field.entryId = entryId;
						assert.equal(field.entryId, entryId);
					});
				});
			});
			describe('#freeze', function() {
				it('Should freeze the field', function() {
					var field = new Field({
						name: 'test',
						type: 'TEXT',
						value: 'test',
						parentSectionId: 1,
						entryId: 4
					});
					field.freeze();
					Object.keys(field).forEach(function(key) {
						assert.throws(function(){
							field[key] = 'test';
						}, TypeError);
					});
				});
				it('Should freeze freeze method', function() {
					var field = new Field({
						name: 'test',
						type: 'TEXT',
						value: 'test',
						parentSectionId: 1,
						entryId: 4
					});
					field.freeze();
					assert.throw(function() {
						field.freeze();
					}, Field.error.isFrozen);
				});
				it('Should freeze typesToSQLite3 method', function() {
					var field = new Field({
						name: 'test',
						type: 'TEXT',
						value: 'test',
						parentSectionId: 1,
						entryId: 4
					});
					field.freeze();
					assert.throw(function() {
						field.typesToSQLite3(types.string);
					}, Field.error.isFrozen);
				});
			});
		});
	});
};
