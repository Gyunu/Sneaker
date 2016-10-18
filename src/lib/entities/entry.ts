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

"use strict";
declare function require(name:string);

import { Field } from "../entities/field";

import { FieldManager } from "../controllers/fieldmanager";
import { DatabaseManager } from "../controllers/databasemanager";

var Q = require('q');


export class Entry {

	_fields: Array<Field>;
	_id: number;
	_parentSectionId: number;

	get id(): number {
		return this._id;
	}

	set id(value: number) {
		this._id = value;
	}

	get parentSectionId(): number {
		return this._parentSectionId;
	}

	set parentSectionId(value: number) {
		this._parentSectionId = value;
	}

	get fields(): Array<Field> {
		return this._fields;
	}

	addField(field: Field) {
		this._fields.push(field);
	}

	removeField(field: Field) {
		let index = this._fields.indexOf(field);
		this._fields.splice(index, 0);
	}

	updateField(name: string, value: string) {
		this._fields.forEach(function(f) {
			if(f.name === name) f.value = value;
		})
	}

	save() {
		let self = this;
		return Q.promise(function(resolve, reject) {
			if(typeof self._parentSectionId === 'undefined') {
		 		reject(new Error('entry::save : No parentSectionId'));
		 	}
			if(self._id) {
				DatabaseManager.select('s_entries', {'where': {'id': self.id}})
				.then(function(result) {
					if(0 === result.length) {
						reject('entry::save : entry has id but doesnt exist in database');
					}
					else if(result.length > 1) {
						reject('entry::save : multiple results returned, should only be one. cannot continue.');
					}
					else {
						result = result[0];
						self.fields.forEach(function(value, index) {

							var promises = [];
							var clause: any = {};
							clause.update = {};
							clause.where = {'id': self.id};
							clause.update.value = value.value;

							promises.push(DatabaseManager.update('s_field_' + self.id, clause));

							Q.all(promises)
							.then(function(result) {
								resolve(result);
							})
							.fail(function(error){
								reject(new Error(error));
							});
						});
					}

				})
				.fail(function(error) {
					reject(new Error(error));
				});
			}
			else {
				DatabaseManager.insert('s_entries', [{field: 'parentSectionId', value: self.parentSectionId}])
				.then(function(id) {
					var promises = [];
					self.fields.forEach(function(value, index) {
						promises.push(DatabaseManager.insert('s_field_' + value.id, [{field: 'entryId', value: value.id}, {field: 'value', value: value.value}]));
					});

					Q.all(promises).then(function() {
						self.id = Number(id);
						resolve(id);
					})
					.fail(function(error) {
						reject(new Error("entry::save : " + error));
					});
				});
			}
		});
	}
}
