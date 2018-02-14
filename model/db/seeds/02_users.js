
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { uuid: "c5b03bc0-11c9-11e8-8c5c-ff2744128466" },
      ]);
    });
};
