const { Router } = require('express');
const router = Router();
const cartController = require('../controllers/cartController.js');


router.post('/', cartController.getOrCreateCart);  // Create/Get active cart
router.post('/item', cartController.addItemToCart);  // Add item to cart
router.get('/:cart_id', cartController.getCartDetails);  // Get cart details

router.get('/', cartController.getUserCarts) // Get all carts by user id

router.put('/item', cartController.updateCartItem);  // Update cart item quantity

router.delete('/item', cartController.removeItemFromCart);  // Remove item
router.post('/checkout', cartController.checkoutCart);  // Checkout

module.exports = router;
