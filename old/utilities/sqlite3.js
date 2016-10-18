function sqlite3type() {
	return {
		text: "TEXT",
		int: "INTEGER",
		float: "FLOAT",
		blob: "BLOB",
		invalid: "INVALID",
		null: "NULL"
	};
}

module.exports = sqlite3type();
