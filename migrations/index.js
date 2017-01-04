let migrations = []

//TODO make it so the migrations don't have to hit the database to check the table exists each iteration.

function runMigrations() {
  migrations.forEach((migration) => {
    let mig = new migration();
    mig.checkMigrationsTable()
    .then((results) => {
      // if(results.length) {
      //   checkMigration();
      // }
      // else {
      //   mig.createMigrationsTable()
      //   .then(() => {
      //     checkMigration();
      //   });
      // }
    });
  });
}

function runMigration(mig) {
  mig.up();
  mig.saveMigration();
  console.log(`Migration ${migration.name} finished`);
}

function checkMigration(mig) {
  mig.checkMigrationHasRun()
  .then((results) => {
    if(!results.length) {
      runMigration();
    }
    else {
      console.log(`Migration ${migration.name} already run`);
    }
  });
}

function rollbackMigrations() {
  migrations.forEach(function(migration) {
    let m = new migration();
    m.down();
    m.removeMigration();
  });
}

module.exports = {
  rollback: rollbackMigrations,
  run: runMigrations
}
