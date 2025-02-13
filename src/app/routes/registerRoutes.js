const { Router } = require('express');
const router = Router();
const registerController = require('../controllers/registerController.js');

router.post('/', registerController.registerUser);

module.exports = router;
