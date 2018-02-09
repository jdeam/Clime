
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('crags').del()
    .then(function () {
      // Inserts seed entries
      return knex('crags').insert([
        { id: 1, name: 'Index', state: 'WA', coords: '47.82,-121.556' },
        { id: 2, name: 'Leavenworth', state: 'WA', coords: '47.543,-120.711' },
        { id: 3, name: 'Little Si', state: 'WA', coords: '47.499,-121.755' },
        { id: 4, name: 'Squamish', state: 'BC', coords: '49.68,-123.145' },
        { id: 5, name: 'Smith Rock', state: 'OR', coords: '44.366,-121.143' },
        { id: 6, name: 'Vantage', state: 'WA', coords: '47.025,-119.969' },
        { id: 7, name: 'Tieton', state: 'WA', coords: '46.684,-120.958' },
        { id: 8, name: 'Trout Creek', state: 'OR', coords: '44.802,-121.109' },
        { id: 9, name: 'Washington Pass', state: 'WA', coords: '48.512,-120.654' }
      ]);
    });
};
