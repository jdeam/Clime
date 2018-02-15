
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', table => {
    table.string('user_id').notNullable();
    table.integer('crag_id').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
