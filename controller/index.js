const model = require('../model');

function getAllCrags(req, res) {
  return model.getAllCrags().then(result => {
    let crags = result;
    return res.status(200).json({ crags });
  });
}

function getCragsByLoc(req, res) {
  let loc = req.params.loc;
  return model.getCragsByLoc(loc).then(result => {
    let crags = result;
    return res.status(200).json({ crags });
  })
}

module.exports = { getAllCrags, getCragsByLoc };
