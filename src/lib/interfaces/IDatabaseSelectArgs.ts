interface IDatabaseSelectArgs {
	select: Array<string>
	where?: Array<IDatabaseWhereClause>;
	join?: IDatabaseJoinClause;
	distinct?: boolean;
}
