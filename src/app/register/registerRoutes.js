const { Router } = require('express');
const router = Router();
const registerController = require('./registerController.js');

router.post('/', registerController.registerUser);

module.exports = router;
