const Model = require("../../lib/model");

class Migrations extends Model {

  constructor(options = {
    fillable: [],
    hidden: [],
    database: null
  }) {

    super(options);
  }
}

Migrations.prototype.table = 'migrations';

module.exports = Migrations;
