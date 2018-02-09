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

app.get('/crags', controller.getAllCrags);
app.get('/crags/:id', controller.getCragById);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ...`);
});
