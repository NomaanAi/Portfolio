const router = require('express').Router();
const ctrl = require('../controllers/homepageController');
const auth = require('../middleware/authMiddleware');
router.get('/', ctrl.get);
router.put('/', auth, ctrl.update);
module.exports = router;
