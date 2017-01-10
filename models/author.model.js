const Model = require("../sneaker/model");

class author extends Model {

  constructor(
    fillable =  [],
    hidden = [],
    database = 'test'
  ) {
    super(fillable, hidden, database);
  }
}

author.prototype.table = 'authors';

module.exports = author;
