const router = require('express').Router();
const ctrl = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');
router.get('/', auth, ctrl.list);
router.post('/track', ctrl.create);
module.exports = router;
