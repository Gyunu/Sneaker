module.exports = function(assert, Section, Field, types) {
		/*jslint node: true */
		'use strict';

		describe('Section', function() {

			describe('#constructor', function() {

				it('Should return a new section object', function() {
					var section = new Section();
					assert(section.constructor.name === "Section", "Is a section");
				});

				it('Should be sealed', function() {
					var section = new Section();
					assert.isSealed(section);
				});

				describe('construct with argument object', function() {

					it('Should take an optional constructor object', function() {
						var section = new Section({});
						assert(section.constructor.name === "Section", "Is a section initialised with an object");
					});
					it('Should set the section name if it is passed in the construction object', function() {
						var o = {name: 'test'};
						var section = new Section(o);
						assert.equal(section.name, o.name);
					});
					it('Should set the fields if fields are passed in the construction object', function() {

						var o = {
							fields: {
								test: new Field({
									name: 'test',
									type: 'text'
								})
							}
						};

						var section = new Section(o);
						assert.equal(section.fields.test, o.fields.test);

					});
					it('Should return a valid object when a valid constructor object is used', function() {
						var o = {
							name: 'test',
							fields: {
								fieldTest: new Field({
									name: 'fieldTest',
									type: 'text'
								})
							}
						};

						var section = new Section(o);
						assert(section.constructor.name === "Section", 'Is a section');
						assert.equal(section.name, o.name, 'Name is set properly');
						assert.equal(section.fields.fieldTest, o.fields.fieldTest, 'Fields are set properly');

					});
				});
			});
			describe('#id', function() {
				describe('set', function() {
					it('Should be able to set id', function() {
						var section = new Section();
						var id = 1;
						section.id = id;
						assert(section.constructor.name === 'Section', 'Is a section');
						assert(section.id === id, 'Id field is set');
					});
					it('Should throw an error if id is invalid', function() {
						var section = new Section();
						Object.keys(types).forEach(function(key) {
							//we test NaN seperately because it's a type of number
							//we test null seperately because it's a different error
							if(key === 'null' ||key === 'number' || key === 'NaN') {
								return;
							}
							assert.throws(function() {
								section.id = types[key];
							}, Section.error.invalidIdType);

						});
					});
					it('Should throw an error if id is null', function() {
						var section = new Section();
						assert.throw(function(){section.id = types.null}, Section.error.nullIdType);
					});
					it('Should throw an error if id is NaN', function() {
						var section = new Section();
						assert.throw(function(){section.id = types.NaN}, Section.error.nanIdType);
					});
				});
				describe('get', function() {
					it('Should be able to get id', function() {
						var section = new Section();
						var name = 'test';
						section.name = name;
						assert(section.constructor.name === 'Section', 'Is a section');
						assert(section.name === name, 'Name field is set');
					});
				});
			});
			describe('#name', function() {
				describe('set', function() {
					it('Should be able to set name', function() {
						var section = new Section();
						var name = 'test';
						section.name = name;
						assert(section.constructor.name === 'Section', 'Is a section');
						assert(section.name === name, 'Name field is set');
					});
					it('Should throw an error if name is invalid', function() {
						var section = new Section();
						Object.keys(types).forEach(function(key) {
							if(typeof key === 'string') {
								return;
							}
							assert.throw(function(){section.name = types[key]}, Section.error.invalidNameType);
						});
					});
					it('Should throw an error if name is null', function() {
						var o = {name: types.null};
						assert.throw(function(){new Section(o)}, Section.error.nullNameType);
					});
				});
				describe('get', function() {
					it('Should be able to get name', function() {
						var section = new Section();
						var name = 'test';
						section.name = name;
						assert(section.constructor.name === 'Section', 'Is a section');
						assert(section.name === name, 'Name field is set');
					});
				});
			});
			describe('#fields', function() {
				describe('set', function() {
					it('Should add a valid field', function() {
						var section = new Section();
						var field = new Field({
							name: 'test',
							type: 'text'
						});

						section.addField(field);
						assert.equal(section.fields.test, field);
					});
					it('Should throw an error if field is invalid', function() {
						var section = new Section();
						Object.keys(types).forEach(function(key) {
							if(key === 'null') {
								return;
							}
							assert.throw(function(){section.addField(types[key])}, Section.error.invalidFieldType);
						});
					});

					it('Should throw an error if field is null', function() {
						var section = new Section();
						var field = types.null;

						assert.throw(function(){section.addField(field)}, Section.error.nullFieldType);
					});
				});
				describe('get', function() {
					it('Should be able to get fields', function() {
						var section = new Section();
						var field = new Field({
							name: 'test',
							type: 'text'
						});

						section.addField(field);
						assert.equal(section.fields.test, field);
					});
				});
			});
			describe('#addField', function() {
				it('Should accept a valid Field and set it', function() {
					var section = new Section();
					var field = new Field({
						name: 'test',
						type: 'text'
					});

					section.addField(field);
					assert.equal(section.fields.test, field);
				});
				it('Should throw an error if field is invalid', function() {
					var section = new Section();
					Object.keys(types).forEach(function(key) {
						if(key === 'null') {
							return;
						}
						assert.throw(function(){section.addField(types[key])}, Section.error.invalidFieldType);
					});
				});

				it('Should throw an error if field is null', function() {
					var section = new Section();
					var field = types.null;

					assert.throw(function(){section.addField(field)}, Section.error.nullFieldType);
				});
			});
			describe('#freeze', function() {
					it('Should freeze all getters and setters', function() {
						var section = new Section({
							id: 1,
							name: 'test'
						});
						section.freeze();
						Object.keys(section).forEach(function(key) {
							assert.throw(function() {
								section[key] = 'test';
							}, TypeError);
						});
					});
					it('Should freeze Section#addField', function() {
						var section = new Section();
						section.freeze();


						assert.throws(function() {
							section.addField(new Field({
								'name': 'test',
								'type': 'text'
							}));
						}, Section.error.isFrozen
						);
					});
					it('Should freeze Section#freeze', function() {
						var section = new Section();
						section.freeze();


						assert.throws(function() {
							section.freeze();
						}, Section.error.isFrozen
						);
					});
			});

		});

};
