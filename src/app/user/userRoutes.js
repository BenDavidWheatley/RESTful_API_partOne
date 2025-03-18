const { Router } = require('express');
const router = Router();

const controller = require('./userController.js');

router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUser);
router.delete('/:id', controller.deleteUser);
router.put('/:id', controller.updateUser);

module.exports = router;

