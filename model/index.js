const knex = require('./db/db')
const axios = require('axios');
const moment = require('moment');
const uuid = require('uuid');
const dsKey = process.env.DS_KEY;
const dsPath = `https://api.darksky.net/forecast/${dsKey}`;
const gKey = process.env.G_KEY;

function buildDSPath(crag) {
  return `${dsPath}/${crag.lat},${crag.lng}?extend=hourly`;
}

function buildGPath(loc) {
  let url = 'https://maps.googleapis.com/maps/api/geocode/';
  return `${url}json?address=${loc}&key=${gKey}`;
}

function extractForecast(data) {
  let schema = { time: [], temp: [], precip: [] };
  return data.reduce((forecast, hour, i, arr) => {
    let time = moment.unix(hour.time);
    if (!(time.hours()%3)) {
      forecast.time.push(moment.unix(hour.time));
      forecast.temp.push(hour.temperature.toFixed(0));
      forecast.precip.push((hour.precipProbability*110).toFixed(0));
    }
    if (i===arr.length-1) {
      let minTemp = forecast.temp.reduce((min, hour) => Math.min(hour, min));
      forecast.minTemp = Math.floor(minTemp/5)*5;
      let maxTemp = forecast.temp.reduce((max, hour) => Math.max(hour, max));
      forecast.maxTemp = Math.ceil(maxTemp/5)*5;
      if (forecast.minTemp === minTemp) { forecast.minTemp -= 5 }
      if (forecast.maxTemp === maxTemp) { forecast.maxTemp += 5 }
    }
    return forecast;
  }, schema);
}

function appendForecasts(crags) {
  let forecasts = [];
  crags.forEach(crag => {
    forecasts.push(axios.get(buildDSPath(crag)));
  });
  return Promise.all(forecasts).then(result => {
    result.forEach((forecast, i) => {
      crags[i].forecast = extractForecast(forecast.data.hourly.data);
    });
    return crags;
  })
}

//1 degree lat/long ~= 69 miles
const dist = 2;

function getCragsByLoc(loc) {
  return axios.get(buildGPath(loc)).then(result => {
    let coords = result.data.results[0].geometry.location;
    return knex('crags')
      .whereBetween('lat', [coords.lat-dist, coords.lat+dist])
      .andWhereBetween('lng', [coords.lng-dist, coords.lng+dist])
  }).then(result => {
      let crags = result;
      return appendForecasts(crags);
  });
}

function getState(crag) {
  return axios.get(buildGPath(`${crag.lat},${crag.lng}`))
    .then(result => {
      return result.data.results[0].address_components[3].short_name;
    })
}

function createCrag(crag) {
  return getState(crag).then(result => {
    crag.state = result;
    return crag;
  }).then(result => {
    result.lat = parseFloat(result.lat);
    result.lng = parseFloat(result.lng);
    return knex('crags').insert(result).returning('*')
  }).then(result => {
    return appendForecasts(result);
  });
}

function createUser() {
  let id = uuid();
  return knex('users').insert({ uuid: id }).returning('*');
}

function getFavoritesByUser(uuid) {
  return knex('favorites')
    .join('crags', 'crags.id', '=', 'favorites.crag_id')
    .where('favorites.user_id', uuid)
    .select('id', 'name', 'state', 'lat', 'lng')
    .then(result => {
      let crags = result;
      return appendForecasts(crags);
    });
}

function createFavorite(favorite) {
  return knex('favorites').insert(favorite).returning('*');
}

function deleteFavorite(favorite) {
  let { user_id, crag_id } = favorite;
  return knex('favorites').where('user_id', user_id)
    .andWhere('crag_id', crag_id).del();
}

// let test = { name: 'French\'s Dome', lat: '45.397', lng: '-121.86' };
// let test2 = { name: 'Ten Sleep', lat: '44.139', lng: '-107.245' };

// createCrag(test).then(result => console.log(result));
// createCrag(test2).then(result => console.log(result));

module.exports = {
  getCragsByLoc,
  createCrag,
  createUser,
  getFavoritesByUser,
  createFavorite,
  deleteFavorite
};
