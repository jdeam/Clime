
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { uuid: 'f52ffb90-11b7-11e8-97ac-a3e2b3012dbc' },
      ]);
    });
};
