const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

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
})

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
