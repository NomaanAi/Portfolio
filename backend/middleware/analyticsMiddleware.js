const Analytics = require('../models/Analytics');
module.exports = async (req, res, next) => {
  // simple tracking: record page requests to analytics collection (skip static assets)
  if (req.path.startsWith('/api/')) {
    try {
      await Analytics.create({ event: 'api_request', meta: { path: req.path, method: req.method } });
    } catch (e) {}
  }
  next();
};
