const Skill = require('../models/Skill');
exports.getAll = async (req, res) => res.json(await Skill.find());
exports.create = async (req, res) => res.json(await Skill.create(req.body));
exports.update = async (req, res) => res.json(await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.remove = async (req, res) => { await Skill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
