const router = require('express').Router();
const ctrl = require('../controllers/skillController');
const auth = require('../middleware/authMiddleware');
router.get('/', ctrl.getAll);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
module.exports = router;
