const { Router } = require('express');
const router = Router();
const cartController = require('./cartController.js');


/**
 * @swagger
 * /api/v1/restfulapi/cart:
 *   post:
 *     summary: Create or Get Active Cart
 *     description: |
 *       This endpoint is used to either **create a new cart** or **retrieve an active cart** for a user.
 *       
 *       ### Workflow:
 *       - If the user already has an **active cart**, it will be returned.
 *       - If no active cart exists, a **new cart** will be created for the user.
 *       - If the user is not found, a `404 Not Found` error will be returned.
 *       
 *       ### Example Request Body:
 *       ```json
 *       {
 *         "id": 1
 *       }
 *       ```
 *       
 *     operationId: createCartgetActiveCart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: |
 *                   The **unique identifier** of the user for whom the cart is being created or retrieved.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Active cart retrieved successfully."
 *               cart:
 *                 id: 12
 *                 user_id: 1
 *                 items: []
 *       201:
 *         description: New cart created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "New cart created."
 *               cart:
 *                 id: 15
 *                 user_id: 1
 *                 items: []
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User with ID 1 not found."
*/

router.post('/', cartController.getOrCreateCart);  // Create/Get active cart

/**
 * @swagger
 * /api/v1/restfulapi/cart:
 *   get:
 *     summary: Get All Carts by User ID
 *     description: |
 *       This endpoint retrieves **all carts** that belong to a specified user.
 *       
 *       ### Important Notes:
 *       - The `user_id` must be provided as a **query parameter**.
 *       - If no carts are found for the given `user_id`, a `404 Not Found` response is returned.
 *       
 *       ### Example Request URL:
 *       ```
 *       /api/v1/restfulapi/cart?user_id=1
 *       ```
 *       
 *     operationId: getCartsByUserId
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: user_id
 *         in: query
 *         required: true
 *         description: |
 *           The **unique identifier** of the user whose carts are to be retrieved.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: List of carts retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Carts retrieved successfully."
 *               carts:
 *                 - id: 10
 *                   user_id: 1
 *                   items: [ { "product_id": 5, "quantity": 2 } ]
 *                 - id: 11
 *                   user_id: 1
 *                   items: [ { "product_id": 7, "quantity": 1 } ]
 *       404:
 *         description: User undefined or not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User with ID 1 not found."
 */

router.get('/', cartController.getUserCarts) // Get all carts by user id

/**
 * @swagger
 * /api/v1/restfulapi/cart/{cart_id}:
 *   get:
 *     summary: Get Cart Details
 *     description: |
 *       This endpoint retrieves **detailed information** about a specific cart using its unique `cart_id`.
 *       
 *       ### Key Details:
 *       - The `cart_id` must be provided in the **path parameters**.
 *       - If the cart exists, the full details, including items, quantities, and timestamps, will be returned.
 *       - If the cart does not exist or is empty, a `404 Not Found` response will be returned.
 *       
 *       ### Example Request URL:
 *       ```
 *       /api/v1/restfulapi/cart/12
 *       ```
 *       
 *     operationId: getSingleCart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: cart_id
 *         in: path
 *         required: true
 *         description: |
 *           The **unique identifier** of the cart whose details are being requested.
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Cart details returned successfully
 *         content:
 *           application/json:
 *             example:
 *               cart:
 *                 id: 12
 *                 user_id: 1
 *                 items:
 *                   - product_id: 5
 *                     product_name: "Wireless Mouse"
 *                     quantity: 2
 *                     price: "29.99"
 *                   - product_id: 7
 *                     product_name: "USB Keyboard"
 *                     quantity: 1
 *                     price: "49.99"
 *                 total_price: "109.97"
 *                 created_at: "2025-03-18T10:15:30Z"
 *                 updated_at: "2025-03-20T12:45:00Z"
 *       404:
 *         description: Cart not found or empty
 *         content:
 *           application/json:
 *             example:
 *               error: "Cart with ID 12 not found or is empty."
 */

router.get('/:cart_id', cartController.getCartDetails);  // Get cart details

/**
 * @swagger
 * /api/v1/restfulapi/cart/item:
 *   post:
 *     summary: Add Item to Cart
 *     description: |
 *       This endpoint allows you to **add** a new item to an existing cart or **update** the quantity of an item already present in the cart.
 *       
 *       ### Workflow:
 *       - The `cart_id` identifies the cart where the item will be added.
 *       - The `product_id` identifies the product being added or updated.
 *       - The `quantity` specifies how many units of the product should be added.
 *       
 *       If the specified cart does not exist, a `404 Not Found` response will be returned.
 *
 *       ### Example Request Body:
 *       ```json
 *       {
 *         "cart_id": 12,
 *         "product_id": 5,
 *         "quantity": 3
 *       }
 *       ```
 *       
 *       ### Example Response (Success - 200):
 *       ```json
 *       {
 *         "message": "Item added to cart successfully",
 *         "cart": {
 *           "cart_id": 12,
 *           "items": [
 *             {
 *               "product_id": 5,
 *               "product_name": "Wireless Mouse",
 *               "quantity": 3,
 *               "price": "29.99"
 *             }
 *           ],
 *           "total_price": "89.97"
 *         }
 *       }
 *       ```
 *       
 *       ### Example Response (Error - 404):
 *       ```json
 *       {
 *         "error": "Cart with ID 12 not found"
 *       }
 *       ```
 *       
 *     operationId: addToCart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_id:
 *                 type: integer
 *                 description: The **unique identifier** of the cart where the item will be added.
 *                 example: 12
 *               product_id:
 *                 type: integer
 *                 description: The **unique identifier** of the product being added to the cart.
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 description: The **number of units** of the product to add.
 *                 example: 3
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Item added to cart successfully"
 *               cart:
 *                 cart_id: 12
 *                 items:
 *                   - product_id: 5
 *                     product_name: "Wireless Mouse"
 *                     quantity: 3
 *                     price: "29.99"
 *                 total_price: "89.97"
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Cart with ID 12 not found"
 */

router.post('/item', cartController.addItemToCart);  // Add item to cart

/**
 * @swagger
 * /api/v1/restfulapi/cart/item:
 *   put:
 *     summary: Update Cart Item Quantity
 *     description: |
 *       This endpoint allows you to **update the quantity** of a specific product within a cart.
 *       
 *       ### Workflow:
 *       - The `cart_id` identifies the cart where the item exists.
 *       - The `product_id` identifies the product whose quantity needs to be updated.
 *       - The `quantity` specifies the new number of units for that product.
 *       
 *       If the provided `cart_id` or `product_id` does not exist, a `404 Not Found` response will be returned.
 *       
 *       ### Example Request Body:
 *       ```json
 *       {
 *         "cart_id": 12,
 *         "product_id": 5,
 *         "quantity": 4
 *       }
 *       ```
 *       
 *       ### Example Response (Success - 200):
 *       ```json
 *       {
 *         "message": "Cart item updated successfully",
 *         "cart": {
 *           "cart_id": 12,
 *           "items": [
 *             {
 *               "product_id": 5,
 *               "product_name": "Wireless Mouse",
 *               "quantity": 4,
 *               "price": "29.99"
 *             }
 *           ],
 *           "total_price": "119.96"
 *         }
 *       }
 *       ```
 *       
 *       ### Example Response (Error - 404):
 *       ```json
 *       {
 *         "error": "Cart with ID 12 or product with ID 5 not found"
 *       }
 *       ```
 *
 *     operationId: updateItemInCart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_id:
 *                 type: integer
 *                 description: The **unique identifier** of the cart containing the item to be updated.
 *                 example: 12
 *               product_id:
 *                 type: integer
 *                 description: The **unique identifier** of the product to be updated.
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 description: The **new quantity** for the specified product.
 *                 example: 4
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Cart item updated successfully"
 *               cart:
 *                 cart_id: 12
 *                 items:
 *                   - product_id: 5
 *                     product_name: "Wireless Mouse"
 *                     quantity: 4
 *                     price: "29.99"
 *                 total_price: "119.96"
 *       404:
 *         description: Cart or item not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Cart with ID 12 or product with ID 5 not found"
 */

router.put('/item', cartController.updateCartItem);  // Update cart item quantity

/**
 * @swagger
 * /api/v1/restfulapi/cart/item:
 *   delete:
 *     summary: Remove an item from the cart
 *     description: |
 *       This endpoint allows you to **remove a specific item** from a user's cart.
 *       
 *       ### Workflow:
 *       - Provide the `cart_id` to specify which cart to modify.
 *       - Provide the `product_id` to identify the item that should be removed.
 *       
 *       ### Important Notes:
 *       - If either `cart_id` or `product_id` is missing, a `400 Bad Request` will be returned.
 *       - If the specified cart or product is not found, a `404 Not Found` will be returned.
 *       
 *       ### Example Request (Query Parameters):
 *       ```
 *       DELETE /api/v1/restfulapi/cart/item?cart_id=10&product_id=3
 *       ```
 *       
 *       ### Example Response (Success - 200):
 *       ```json
 *       {
 *         "message": "Item removed from cart"
 *       }
 *       ```
 *       
 *       ### Example Response (Error - 400):
 *       ```json
 *       {
 *         "error": "Both cart_id and product_id are required."
 *       }
 *       ```
 *       
 *       ### Example Response (Error - 404):
 *       ```json
 *       {
 *         "error": "Cart not found"
 *       }
 *       ```
 *
 *     operationId: deleteFromCart
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: cart_id
 *         in: query
 *         required: true
 *         description: |
 *           The **unique identifier** of the cart from which the item should be removed.
 *           This is mandatory to locate the correct cart.
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: product_id
 *         in: query
 *         required: true
 *         description: |
 *           The **unique identifier** of the product to be removed from the specified cart.
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Item successfully removed from the cart
 *         content:
 *           application/json:
 *             example:
 *               message: "Item removed from cart"
 *       400:
 *         description: Missing cart_id or product_id
 *         content:
 *           application/json:
 *             example:
 *               error: "Both cart_id and product_id are required."
 *       404:
 *         description: Cart or item not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Cart not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

router.delete('/item', cartController.removeItemFromCart);  // Remove item

/**
 * @swagger
 * /api/v1/restfulapi/cart/checkout:
 *   post:
 *     summary: Checkout Cart
 *     description: |
 *       This endpoint finalizes the cart checkout process by converting the selected cart into an order.
 *       
 *       ### Workflow:
 *       1. Provide the `cart_id` to identify which cart should be checked out.
 *       2. Provide the `user_id` to validate the ownership of the cart.
 *       
 *       ### Key Details:
 *       - If the specified cart does not exist or is empty, a `404 Not Found` error will be returned.
 *       - Successful checkout creates a new order, depletes inventory, and marks the cart as complete.
 *       
 *       ### Example Request Body:
 *       ```json
 *       {
 *         "cart_id": 25,
 *         "user_id": 102
 *       }
 *       ```
 *       
 *       ### Example Response (Success - 201):
 *       ```json
 *       {
 *         "message": "Order placed successfully",
 *         "order_id": 507
 *       }
 *       ```
 *       
 *       ### Example Response (Error - 404):
 *       ```json
 *       {
 *         "error": "Cart not found or empty"
 *       }
 *       ```
 *
 *     operationId: checkoutCart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_id:
 *                 type: integer
 *                 description: |
 *                   The **unique identifier** of the cart that is being checked out. 
 *                   This value ensures the correct cart is converted into an order.
 *                 example: 25
 *               user_id:
 *                 type: integer
 *                 description: |
 *                   The **unique identifier** of the user completing the checkout process. 
 *                   Ensures ownership verification before processing the order.
 *                 example: 102
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Order placed successfully"
 *               order_id: 507
 *       404:
 *         description: Cart not found or empty
 *         content:
 *           application/json:
 *             example:
 *               error: "Cart not found or empty"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to process checkout due to server error"
 */

router.post('/checkout', cartController.checkoutCart);  // Checkout

module.exports = router;
