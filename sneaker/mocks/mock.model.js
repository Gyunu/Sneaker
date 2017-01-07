let Model = require('../model');

let Relationship = require('./relationship.model');

class Mock extends Model {
    constructor(
      fillable = [],
      hidden = [],
      database  = 'test',
      query = null
    ) {
      super(fillable, hidden, database, query);
    }

    relationship() {
      return this.has(Relationship, 'relationship_id', 'id');
    }
}

Mock.prototype.table = 'test';

module.exports = Mock;
