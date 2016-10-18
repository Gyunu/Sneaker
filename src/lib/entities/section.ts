/** Section Objecy
*
*	An object representation of a section
*
*
*	@version 0.1
*	@author David Allen
*	@exports Section
*
*******************************************************/
'use strict';

import { Field } from "../entities/field";

export class Section {

	_fields: Array<Field> = [];
	_id: number = null;
	_name: string = null;


	constructor(args: ISectionArgs) {

		this.name = args.name;
		this.id = args.id;
		args.fields.forEach(function(field) {
			this.addField(field);
		}.bind(this));

		Object.seal(this);
	}

	get id(): number {
		return this._id;
	}

	set id(value: number) {
		this._id = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get fields(): Array<Field> {
		return this._fields;
	}

	set fields(value) {
		return;
	}

	addField(field: Field): void {

			if(Object.isFrozen(this)) {
				throw(new Error('Section is frozen'));
			}
			this._fields.push(field);
	};

	freeze(): void {
		if(Object.isFrozen(this)) {
			throw(new Error('Section is already frozen'));
		}
		this._fields.forEach(function(field) {
			field.freeze();
		});
		Object.freeze(this);
	}
}
