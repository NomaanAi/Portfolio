const router = require('express').Router();
const ctrl = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');
router.get('/', auth, ctrl.list);
router.get('/stats', auth, ctrl.stats);
router.post('/track', ctrl.create);
module.exports = router;
