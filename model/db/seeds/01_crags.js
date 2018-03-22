const crags = require('./crag_data');
const cragsWithIds = crags.map((crag, i) => {
  crag.id = i+1;
  delete crag.url;
  return crag;
});

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('crags').del()
    .then(function () {
      // Inserts seed entries
      return knex('crags').insert(cragsWithIds);
    }).then(() => {
      return knex.raw(
        `SELECT setval('crags_id_seq', (SELECT MAX(id) FROM crags));`
      );
    });
};
