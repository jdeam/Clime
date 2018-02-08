const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const moment = require('moment');
const crags = require('./crags')

const dsKey = 'be80b5098f496ff72b37665ecc1b18f4';
const dsPath = `https://api.darksky.net/forecast`;

function buildPath(crag) {
  return `${dsPath}/${dsKey}/${crag.coords}?extend=hourly`;
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
      forecast.minTemp = Math.floor(forecast.temp
        .reduce((min, hour) => Math.min(hour, min))/5)*5;
      forecast.maxTemp = Math.ceil(forecast.temp
        .reduce((max, hour) => Math.max(hour, max))/5)*5;
    }
    return forecast;
  }, schema);
}

crags.forEach(crag => {
  axios.get(buildPath(crag)).then(result => {
    crag.forecast = extractForecast(result.data.hourly.data);
  });
});

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/crags', (req, res) => {
  res.status(200).json({ crags });
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ...`);
});
