const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');

const dsKey = 'be80b5098f496ff72b37665ecc1b18f4'
const path = `https://api.darksky.net/forecast/${key}/47.82,-121.556`;

let forecast;
axios.get(path).then(result => {
  forecast = result;
})

const db = {
  users: [],
  favorites: [],
  crags: []
};

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  const foundUser = db.users.find(user => user.id === id);
  if (foundUser) {
    return res.status(200).json({ data: foundUser });
  }
  res.status(404).json({ error: { message: 'User not found.' } });
});

app.get('/forecast', (req, res) => {
  res.status(200).json({ data: forecast });
});

app.post('/users', (req, res) => {
  const newUser = {
    id: req.body.id,
  }
  db.users.push(newUser);
  return res.status(201).json({ data: newUser });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ...`);
});
