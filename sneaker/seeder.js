let Schema = require('./schema');

class Seeder {

  constructor(options = {
    database: null
  }) {
    this.schema = new Schema(options);
  }

}

module.exports = Seeder;
