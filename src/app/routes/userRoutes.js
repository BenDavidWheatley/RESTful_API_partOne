const { Router } = require('express');
const router = Router();

const controller = require('../controllers/userController.js');

router.get('/', controller.getUsers);

module.exports = router;

