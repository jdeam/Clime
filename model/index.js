const knex = require('./db/db')
const axios = require('axios');
const moment = require('moment');
const dsKey = 'be80b5098f496ff72b37665ecc1b18f4';
const dsPath = `https://api.darksky.net/forecast/${dsKey}`;
const gKey = 'AIzaSyARIp9NV4oT7T5BzWnBaR6Nq3DZ5p8Fe9s';

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
    forecasts.push(axios.get(buildDSPath(crag)));
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
const dist = 1.5;

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

function createUser(newUser) {
  let uuid = newUser;
  return knex('users').insert({ uuid }).returning('*');
}

module.exports = { getAllCrags, getCragsByLoc, createUser };
