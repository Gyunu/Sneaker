const fs = require('fs');
let args = process.argv.slice(2);

if(!args[0]) {
  throw new Error("make:model -- No model name passed");
}

if(!args[1]) {
  throw new Error("make:model -- No database name passed");
}

if(!args[2]) {
  throw new Error("make:model -- No table name passed");
}

const template = `const Model = require("../sneaker/model");

class ${args[0]} extends Model {

  constructor(options = {
    fillable: [],
    hidden: [],
    database: '${args[1]}'
  }) {

    super(options);
  }
}

${args[0]}.prototype.table = '${args[2]}';

module.exports = ${args[0]};
`;

fs.writeFile(`./models/${args[0].charAt(0).toLowerCase() + args[0].slice(1)}.model.js`, template, function(error) {
    if(error) {
        throw new Error(error);
    }

    console.log(`make:model -- Model ${args[0]} created`);
});
