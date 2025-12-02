const mongoose = require('mongoose');
const socialSchema = new mongoose.Schema({
  github: String,
  linkedin: String,
  twitter: String,
  instagram: String,
  email: String
});
module.exports = mongoose.model('Social', socialSchema);
