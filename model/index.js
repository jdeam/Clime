const forecasts = require('./forecasts');
const knex = require('./db/db')
const axios = require('axios');
const moment = require('moment');
const dsKey = 'be80b5098f496ff72b37665ecc1b18f4';
const dsPath = `https://api.darksky.net/forecast/${dsKey}`;

function buildPath(crag) {
  return `${dsPath}/${crag.coords}?extend=hourly`;
}

function extractForecast(data) {
  let schema = { time: [], temp: [], precip: [] };
  return data.reduce((forecast, hour, i, arr) => {
    let time = moment.unix(hour.time);
    if (!(time.hours()%3)) {
      forecast.time.push(moment.unix(hour.time));
      forecast.temp.push(hour.temperature.toFixed(0));
      forecast.precip.push((hour.precipProbability*120).toFixed(0));
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

//Get forecast data for all crags
knex('crags').then(result => {
  let crags = result;
  crags.forEach(crag => {
    axios.get(buildPath(crag)).then(result => {
      let forecast = extractForecast(result.data.hourly.data);
      forecasts[`${crag.id}`] = forecast;
    });
  });
});

function getAllCrags() {
  return knex('crags').then(result => {
    let crags = result;
    crags.forEach(crag => {
      crag.forecast = forecasts[`${crag.id}`];
    });
    return crags;
  });
}

function getCragById(id) {
  return knex('crags').where('id', id).first().then(result => {
    let crag = result;
    crag.forecast = forecasts[`${crag.id}`];
    return crag;
  });
}

module.exports = { getAllCrags, getCragById };
