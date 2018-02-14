
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.string('uuid').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
