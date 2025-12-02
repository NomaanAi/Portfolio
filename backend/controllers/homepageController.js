const Homepage = require('../models/Homepage');
exports.get = async (req, res) => {
  let h = await Homepage.findOne();
  if (!h) h = await Homepage.create({ heroTitle: 'Hi, I am Your Name', heroSubtitle: 'Web Developer', aboutText: 'About me...' });
  res.json(h);
};
exports.update = async (req, res) => {
  let h = await Homepage.findOne();
  if (!h) h = await Homepage.create(req.body);
  else h = await Homepage.findByIdAndUpdate(h._id, req.body, { new: true });
  res.json(h);
};
