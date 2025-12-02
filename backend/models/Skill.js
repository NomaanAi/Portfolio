const mongoose = require('mongoose');
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Frontend','Backend','Tools','Other'], default: 'Other' },
  level: { type: String } // e.g. 'Advanced', 'Intermediate'
});
module.exports = mongoose.model('Skill', skillSchema);
