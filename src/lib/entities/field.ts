export class Field {

	_name: string = null;
	_type: string = null;
	_value: string = null;

	_id: number = null;
	_parentSectionId: number = null;
	_entryId: number = null;

	constructor(args: IFieldArgs) {
		this.name = args.name;
		this.type = args.type;
		this.name = args.name;
		this.value = args.value;
		this.type = args.type;
		this.id = args.id;
		this.parentSectionId = args.parentSectionId;
		this.entryId = args.parentSectionId;

	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get type(): string {
		return this._type;
	}

	set type(value: string) {
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
				throw(new Error('Invalid Type'));
		}
	}

	get value(): string {
		return this._value;
	}

	set value(value: string) {

		if(typeof value === 'undefined') return;
		
		var type = this.typesToSQLite3(value);

		if(this._type !== type) {
			throw(new Error('Type of value does not match field type'));
		}
		this._value = value;
	}

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

	get entryId(): number {
		return this._entryId;
	}

	set entryId(value: number) {
		this._entryId = value;
	}

	typesToSQLite3(type: string): string {
		var sqliteType;
		var valueType = typeof type;

		switch(valueType) {
			case 'number':
				sqliteType = "INT";
				break;
			case 'string':
				sqliteType = "TEXT";
				break;
			case 'boolean':
				sqliteType = "INT";
				break;
			case 'array':
			case 'object':
			case 'function':
				sqliteType = "INVALID";
				break;

		}

		return sqliteType;
	}


	freeze() {
		if(Object.isFrozen(this)) {
			throw(new Error('Field is already frozen'));
		}
		Object.freeze(this);
	}
}
