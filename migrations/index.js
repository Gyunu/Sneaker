let migrations = [
]

//TODO make it so the migrations don't have to hit the database to check the table exists each iteration.

function runMigrations() {
  migrations.forEach(function(migration) {
    let mig = new migration();

    if(!mig.checkMigrationsTable()) {
      mig.createMigrationsTable();
    }

    if(!mig.checkMigrationHasRun()) {
      mig.up();
      mig.saveMigration();
      console.log(`Migration ${migration.name} finished`);
    }
    else {
      console.warn(`Migration ${migration.name} already run`);
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
