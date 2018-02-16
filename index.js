const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const controller = require('./controller');

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/crags/:loc', controller.getCragsByLoc);
app.get('/users/:uuid/favorites', controller.getFavoritesByUser);

app.post('/users', controller.createUser);
app.post('/crags', controller.createCrag);
app.post('/users/:uuid/favorites', controller.createFavorite);

app.delete('/users/:uuid/favorites/:cragId', controller.deleteFavorite);

app.use((req, res, next) => {
  res.status(404).json({ error: { message: 'Resouce not found.' } });
});

app.use((err, req, res, next) => {
  let status = err.status || 500;
  res.status(status).json({ error: err });
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ...`);
});
