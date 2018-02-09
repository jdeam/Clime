const model = require('../model');

function getAllCrags(req, res) {
  let crags = model.getAllCrags();
  return res.status(200).json({ crags });
}

module.exports = { getAllCrags };
