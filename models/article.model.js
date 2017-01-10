const Model = require("../sneaker/model");
const Author = require('./author.model');
class article extends Model {

  constructor(
    fillable = [],
    hidden = [],
    database = 'test'
  ) {

    super(fillable, hidden, database);
  }

  author() {
    return this.has(Author, 'id', 'author_id');
  }
}

article.prototype.table = 'articles';

module.exports = article;
