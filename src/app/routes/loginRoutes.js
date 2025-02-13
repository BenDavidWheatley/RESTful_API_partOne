const { Router } = require('express');
const router = Router();
const loginController = require('../controllers/loginController.js');
const passport = require('../../../passportConfig.js');

//router.post('/register', loginController.registerUser);
router.post('/', loginController.loginUser);

module.exports = router;
