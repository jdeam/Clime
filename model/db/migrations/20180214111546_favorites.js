
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', table => {
    table.string('user_id').notNullable();
    table.foreign('user_id').references('users.uuid');

    table.integer('crag_id').notNullable();
    table.foreign('crag_id').references('crags.id');
    
    table.integer('position').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
