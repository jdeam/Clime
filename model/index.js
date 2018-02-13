const knex = require('./db/db')
const axios = require('axios');
const moment = require('moment');
const dsKey = 'be80b5098f496ff72b37665ecc1b18f4';
const dsPath = `https://api.darksky.net/forecast/${dsKey}`;

function buildPath(crag) {
  return `${dsPath}/${crag.lat},${crag.lng}?extend=hourly`;
}

function extractForecast(data) {
  let schema = { time: [], temp: [], precip: [] };
  return data.reduce((forecast, hour, i, arr) => {
    let time = moment.unix(hour.time);
    if (!(time.hours()%3)) {
      forecast.time.push(moment.unix(hour.time));
      forecast.temp.push(hour.temperature.toFixed(0));
      forecast.precip.push((hour.precipProbability*130).toFixed(0));
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
    forecasts.push(axios.get(buildPath(crag)));
  });
  return Promise.all(forecasts).then(result => {
    result.forEach((forecast, i) => {
      crags[i].forecast = extractForecast(forecast.data.hourly.data);
    });
    return crags;
  })
}

function getAllCrags() {
  return knex('crags').then(result => {
    let crags = result;
    return appendForecasts(crags);
  });
}

//1 degree lat/long ~= 69 miles
const dist = 1.45;

function getCragsByLoc(coords) {
  coords = coords.split(',');
  let lat = parseFloat(coords[0]);
  let lng = parseFloat(coords[1]);
  coords = { lat, lng };
  return knex('crags')
    .whereBetween('lat', [coords.lat-dist, coords.lat+dist])
    .andWhereBetween('lng', [coords.lng-dist, coords.lng+dist])
    .then(result => {
      let crags = result;
      return appendForecasts(crags);
    });
}

// getAllCrags().then(result => console.log(result));
// getCragsByLoc('47.66,-122.34').then(result => console.log(result));

module.exports = { getAllCrags, getCragsByLoc };
