const Social = require('../models/Social');
exports.get = async (req, res) => {
  let s = await Social.findOne();
  if (!s) s = await Social.create({});
  res.json(s);
};
exports.update = async (req, res) => {
  let s = await Social.findOne();
  if (!s) s = await Social.create(req.body);
  else s = await Social.findByIdAndUpdate(s._id, req.body, { new: true });
  res.json(s);
};
