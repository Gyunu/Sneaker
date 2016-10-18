interface IQuery {

	table(table: string);
	select(column: string);
	delete();
	update(column: string, value: string);
	insert(column: string, condition: string, value: string);
	join(table: string, column: string, value: string);

	construct(): string;
}
