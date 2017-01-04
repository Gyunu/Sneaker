let Model = require('../model');

class Mock extends Model {
    constructor(options = {
      fillable: [],
      hidden: [],
      database: 'test'
    }) {
      super(options);
    }
}

Mock.prototype.table = 'test';

module.exports = Mock;
