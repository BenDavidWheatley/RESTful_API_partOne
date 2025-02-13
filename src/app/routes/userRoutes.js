const { Router } = require('express');
const router = Router();

const controller = require('../controllers/userController.js');

router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUser);
//router.post('/', controller.addUser);
router.delete('/:id', controller.deleteUser);
router.put('/:id', controller.updateUser);

module.exports = router;

