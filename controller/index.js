const model = require('../model');

function getCragsByLoc(req, res) {
  let loc = req.params.loc;
  return model.getCragsByLoc(loc).then(result => {
    let crags = result;
    return res.status(200).json({ crags });
  })
}

function createCrag(req, res) {
  let newCrag = req.body;
  return model.createCrag(newCrag).then(result => {
    let crag = result;
    return res.status(201).json({ crag });
  });
}

function createUser(req, res) {
  return model.createUser().then(result => {
    let user = result[0];
    return res.status(201).json({ user });
  });
}

function getFavoritesByUser(req, res) {
  let uuid = req.params.uuid;
  return model.getFavoritesByUser(uuid).then(result => {
    let crags = result;
    return res.status(200).json({ crags });
  });
}

function createFavorite(req, res) {
  let user_id = req.params.uuid;
  let crag_id = req.body.cragId;
  return model.createFavorite({ user_id, crag_id}).then(result => {
    let favorite = result[0];
    return res.status(201).json({ favorite });
  });
}

function deleteFavorite(req, res) {
  let user_id = req.params.uuid;
  let crag_id = req.params.cragId;
  return model.deleteFavorite({ user_id, crag_id }).then(result => {
    let deleted = result;
    return res.status(200).json({ deleted });
  })
}

module.exports = {
  getCragsByLoc,
  createCrag,
  createUser,
  getFavoritesByUser,
  createFavorite,
  deleteFavorite
};
