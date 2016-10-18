"use strict";
declare function require(name: string);

export class Query implements IQuery {

	type: string = null;

	_table: string = null;
	_select: string = null;
	_where: string = null;

	constructor(table: string) {

	}

	table(table: string) {
		this._table = table + " AS t1";
		return this;
	};

	select(column: string) {
		if (this._select === null) {
			this.type = "SELECT";
			this._select += "t1." + column;
		}
		else {
			this._select += ", t1." + column;
		}

		return this;
	};

	where(column: string, condition: string, value: string): this {

		return this;
	}

	delete(): this {

		return this;
	};
	update(column: string, value: string): this {

		return this;
	};
	insert(column: string, value: string): this {

		return this;
	};
	replace(column: string, value: string): this {

		return this;
	};
	join(table: string, column: string, value: string): this {

		return this;
	};

	construct(): string {
		let query: string = "";

		return query;
	}
}
