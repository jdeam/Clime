
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('crags').del()
    .then(function () {
      // Inserts seed entries
      return knex('crags').insert([
        { id: 1, name: 'Index', state: 'WA', lat: 47.82, lng: -121.556 },
        { id: 2, name: 'Leavenworth', state: 'WA', lat: 47.543, lng: -120.711 },
        { id: 3, name: 'Little Si', state: 'WA', lat: 47.499, lng: -121.755 },
        { id: 4, name: 'Squamish', state: 'BC', lat: 49.68, lng: -123.145 },
        { id: 5, name: 'Smith Rock', state: 'OR', lat: 44.366, lng: -121.143 },
        { id: 6, name: 'Vantage', state: 'WA', lat: 47.025, lng: -119.969 },
        { id: 7, name: 'Tieton', state: 'WA', lat: 46.684, lng: -120.958 },
        { id: 8, name: 'Trout Creek', state: 'OR', lat: 44.802, lng: -121.109 },
        { id: 9, name: 'Washington Pass', state: 'WA', lat: 48.512, lng: -120.654 }
      ]);
    }).then(() => {
      return knex.raw(
        `SELECT setval('crags_id_seq', (SELECT MAX(id) FROM crags));`
      );
    });
};
