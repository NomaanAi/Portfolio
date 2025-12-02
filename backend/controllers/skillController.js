const Skill = require('../models/Skill');
exports.getAll = async (req, res) => res.json(await Skill.find());
exports.create = async (req, res) => res.json(await Skill.create(req.body));
exports.remove = async (req, res) => { await Skill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
