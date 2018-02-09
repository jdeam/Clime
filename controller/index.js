const model = require('../model');

function getAllCrags(req, res) {
  return model.getAllCrags().then(result => {
    let crags = result;
    return res.status(200).json({ crags });
  });
}

function getCragById(req, res) {
  let id = parseInt(req.params.id);
  return model.getCragById(id).then(result => {
    let crag = result;
    return res.status(200).json({ crag });
  });
}

module.exports = { getAllCrags, getCragById };
