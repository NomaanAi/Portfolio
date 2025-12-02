const router = require('express').Router();
const ctrl = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
module.exports = router;
