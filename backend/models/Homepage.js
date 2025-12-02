const mongoose = require('mongoose');
const homepageSchema = new mongoose.Schema({
  heroTitle: String,
  heroSubtitle: String,
  aboutText: String,
  profileImage: String,
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Homepage', homepageSchema);
