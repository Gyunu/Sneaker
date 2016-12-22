const fs = require('fs');
let args = process.argv.slice(2);

if(!args[0]) {
  throw new Error("make:seeder -- No migration name passed");
}

if(!args[1]) {
  throw new Error("make:seeder -- No database name passed");
}

const template = `const Seeder = require('../lib/seeder');

module.exports = class ${args[0]} extends Seeder {

  constructor(options = {
    database: '${args[1]}'
  }) {
    super(options);
  }

  seed() {
    //
  }

}
`;

fs.writeFile(`./seeders/${args[0].charAt(0).toLowerCase() + args[0].slice(1)}.seeder.js`, template, function(error) {
    if(error) {
        throw new Error(error);
    }

    console.log(`make:migration -- Seeder ${args[0]} created for database ${args[1]}`);
});
