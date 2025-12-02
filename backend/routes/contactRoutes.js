const router = require('express').Router();
const ctrl = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');
router.post('/', ctrl.create);
router.get('/', auth, ctrl.list);
router.patch('/:id/read', auth, ctrl.markRead);
router.delete('/:id', auth, ctrl.remove);
module.exports = router;
