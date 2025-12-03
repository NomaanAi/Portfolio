const Analytics = require('../models/Analytics');
exports.list = async (req, res) => res.json(await Analytics.find().sort({ createdAt: -1 }).limit(200));
exports.create = async (req, res) => res.json(await Analytics.create(req.body));

exports.stats = async (req, res) => {
    const totalViews = await Analytics.countDocuments({ event: 'api_request' });
    const projectViews = await Analytics.countDocuments({ event: 'project_view' });
    const recent = await Analytics.find().sort({ createdAt: -1 }).limit(10);
    res.json({ totalViews, projectViews, recent });
};
