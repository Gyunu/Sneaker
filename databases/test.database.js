const Database = require("../sneaker/database");

module.exports = class Test extends Database {
  constructor(options = {
    name: "test"
  })
  {
    super(options);
  }

}
