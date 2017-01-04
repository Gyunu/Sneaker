const ArticlesSeeder = require('./articles.seeder');
let seeds = [
  ArticlesSeeder
]

function runSeeders() {

  seeds.forEach(function(seed) {
    let s = new seed();
    s.seed();
    console.log(`Seed ${seed.name} finished`);
  });
}

module.exports = {
  run: runSeeders
};
