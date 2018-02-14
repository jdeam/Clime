
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('favorites').del()
    .then(function () {
      // Inserts seed entries
      return knex('favorites').insert([
        {
          user_id: "c5b03bc0-11c9-11e8-8c5c-ff2744128466",
          crag_id: 1,
        },
        {
          user_id: "c5b03bc0-11c9-11e8-8c5c-ff2744128466",
          crag_id: 4,
        },
        {
          user_id: "c5b03bc0-11c9-11e8-8c5c-ff2744128466",
          crag_id: 9,
        },
      ]);
    });
};
