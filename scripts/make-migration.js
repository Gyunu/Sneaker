const fs = require('fs');
let args = process.argv.slice(2);

if(!args[0]) {
  throw new Error("make:migration -- No migration name passed");
}

if(!args[1]) {
  throw new Error("make:migration -- No database name passed");
}

const template = `const Migration = require("../sneaker/migration");
module.exports = class ${args[0]} extends Migration {

  constructor(options = {
    database: '${args[1]}'
  }) {
    super(options);
  }

  up() {
    //
  }

  down() {
    //
  }

}
`;

fs.writeFile(`./migrations/${args[0].charAt(0).toLowerCase() + args[0].slice(1)}.migration.js`, template, function(error) {
    if(error) {
        throw new Error(error);
    }

    console.log(`make:migration -- Migration ${args[0]} created for database ${args[1]}`);
});
