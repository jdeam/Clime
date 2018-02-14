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

function createUser(req, res) {
  let newUser = req.body.newUser;
  return model.createUser(newUser).then(result => {
    let user = result[0];
    return res.status(201).json({ user });
  });
}

module.exports = { getAllCrags, getCragsByLoc, createUser };
