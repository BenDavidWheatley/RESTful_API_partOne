const { Router } = require('express');
const router = Router();

const controller = require('./productController.js');

router.get('/', controller.getAllProducts);
router.get('/:id', controller.getSingleProduct)
router.post('/', controller.addProduct);
router.delete('/:id', controller.deleteProduct);
router.put('/:id', controller.updateProduct)

module.exports = router;

