const Contact = require('../models/Contact');
exports.create = async (req, res) => { const c = await Contact.create(req.body); res.json(c); };
exports.list = async (req, res) => res.json(await Contact.find().sort({ createdAt: -1 }));
exports.markRead = async (req, res) => { await Contact.findByIdAndUpdate(req.params.id, { isRead: true }); res.json({ message: 'Marked' }); };
exports.remove = async (req, res) => { await Contact.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
