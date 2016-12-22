const Schema = require("./schema");

module.exports = class Seeder {

  constructor(options = {
    database: null
  }) {
    this.schema = new Schema(options);
  }

}
