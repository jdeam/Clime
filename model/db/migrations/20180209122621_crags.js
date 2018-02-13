
exports.up = function(knex, Promise) {
  return knex.schema.createTable('crags', table => {
    table.increments();
    table.string('name').notNullable();
    table.string('state').notNullable();
    table.float('lat').notNullable();
    table.float('lng').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('crags');
};
