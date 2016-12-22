const LocationTypeSeeder = require("./locationTypeSeeder.seeder");
const ArticlesSeeder = require("./articlesSeeder.seeder");
const EducationSeeder = require("./educationSeeder.seeder");
const LocationSeeder = require("./locationSeeder.seeder");
const PeopleSeeder = require("./peopleSeeder.seeder");
const WorkSeeder = require("./workSeeder.seeder");

let seeds = [
  LocationTypeSeeder,
  ArticlesSeeder,
  EducationSeeder,
  LocationSeeder,
  PeopleSeeder,
  WorkSeeder
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
