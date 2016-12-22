const fs = require('fs');
let args = process.argv.slice(2);

if(!args[0]) {
  throw new Error("make:database -- No database name passed");
}

const template = `const Database = require("../lib/database");

module.exports = class ${args[0]} extends Database {
  constructor(options = {
    name: "${args[0]}"
  })
  {
    super(options);
  }

}
`;

fs.writeFile(`./databases/${args[0].charAt(0).toLowerCase() + args[0].slice(1)}.database.js`, template, function(error) {
    if(error) {
        throw new Error(error);
    }

    console.log(`make:database -- Database ${args[0]} created`);
});
