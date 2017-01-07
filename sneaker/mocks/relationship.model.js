let Model = require('../model');

class Relationship extends Model {
    constructor(
      fillable = [],
      hidden = [],
      database  = 'test',
      query = null
    ) {
      super(fillable, hidden, database, query);
    }
}

Relationship.prototype.table = 'test_relationship';

module.exports = Relationship;
