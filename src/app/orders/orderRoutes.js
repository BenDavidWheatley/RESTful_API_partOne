const { Router } = require('express');
const router = Router();
const orderController = require('./orderController.js');

router.post('/', orderController.completeOrder);
router.get('/', orderController.getAllOrders)

module.exports = router;