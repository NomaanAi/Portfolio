const Analytics = require('../models/Analytics');
exports.list = async (req, res) => res.json(await Analytics.find().sort({ createdAt: -1 }).limit(200));
exports.create = async (req, res) => res.json(await Analytics.create(req.body));
