const Model = require("../../lib/model");

class Sqlite_master extends Model {

  constructor(options = {
    fillable: [],
    hidden: [],
    database: ''
  }) {
    super(options);
  }
}

Sqlite_master.prototype.table = 'sqlite_master';

module.exports = Sqlite_master;
