const { Router } = require('express');
const router = Router();
const orderController = require('../controllers/orderController.js');

router.post('/', orderController.completeOrder);

module.exports = router;