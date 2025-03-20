const { Router } = require('express');
const router = Router();
const orderController = require('./orderController.js');
/**
 * @swagger
 * /order:
 *   get:
 *     summary: Retrieve All Orders
 *     description: |
 *       This endpoint fetches **all orders** from the database. 
 *       
 *       ### Workflow
 *       - The system queries the database for all existing orders.
 *       - Each order object includes details like the **user ID**, **cart ID**, **total cost**, and **delivery status**.
 *       
 *       ### Use Case
 *       - Ideal for **admin dashboards**, **report generation**, or **order management systems** to view bulk order data.
 *       - This endpoint may require **admin privileges** or appropriate role-based access control (RBAC).
 *       
 *       ### Important Notes
 *       - Orders with sensitive information (e.g., payment details) should be handled securely.
 *       - Consider adding **pagination**, **filtering**, or **sorting** to improve performance and usability for large datasets.
 *
 *     operationId: getAllOrders
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The **unique identifier** for the order.
 *                     example: 101
 *                   user_id:
 *                     type: integer
 *                     description: The **ID of the user** who placed the order.
 *                     example: 23
 *                   cart_id:
 *                     type: integer
 *                     description: The **ID of the cart** associated with this order.
 *                     example: 45
 *                   total:
 *                     type: number
 *                     format: float
 *                     description: |
 *                       The **total amount** for the order, including taxes and discounts.
 *                     example: 99.99
 *                   delivery_address:
 *                     type: string
 *                     description: The **address** where the order should be delivered.
 *                     example: "123 Main St, Springfield, IL 62704"
 *                   delivery_status:
 *                     type: string
 *                     description: |
 *                       The **current delivery status** of the order.
 *                       Common statuses may include:
 *                       - `"Pending"`
 *                       - `"Shipped"`
 *                       - `"Delivered"`
 *                       - `"Cancelled"`
 *                     example: "Pending"
 *       500:
 *         description: Database error or internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error while retrieving orders"
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: |
 *                     An error message indicating the server encountered a problem
 *                     while processing the request.
 *                   example: "Internal server error - unable to fetch orders."
 */

router.get('/', orderController.getAllOrders);


/**
 * @swagger
 * /order:
 *   post:
 *     summary: Complete an Order
 *     description: |
 *       This endpoint finalizes an order by transferring cart items to the `order_items` table
 *       and then **clearing the cart**.  
 *
 *       ### Workflow
 *       - The system verifies the provided `order_id`.
 *       - It transfers the associated **cart items** to the `order_items` table.
 *       - The cart is cleared to ensure no duplicate purchases.
 *       - The order's status is marked as **"Completed"**.
 *
 *       ### Use Case
 *       - Used when a customer finalizes their purchase.
 *       - Suitable for e-commerce checkout flows, subscription confirmations, or service order processing.
 *
 *       ### Important Notes
 *       - Ensure **transactional integrity** to prevent data inconsistencies.
 *       - Implement **rollback mechanisms** in case any step fails during the process.
 *
 *     operationId: completeOrders
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: |
 *                   The **unique identifier** of the order to be marked as complete.
 *                   This ID links to the corresponding cart data.
 *                 example: 205
 *     responses:
 *       200:
 *         description: Order completed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   description: |
 *                     A confirmation message that the order has been successfully completed.
 *                   example: "Order completed successfully."
 *       400:
 *         description: |
 *           **Invalid Request** – This error occurs when:
 *           - The `order_id` is missing from the request body.
 *           - The provided `order_id` is in an invalid format.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid request. Missing order_id."
 *       404:
 *         description: |
 *           **Order Not Found** – Occurs when:
 *           - The specified `order_id` does not exist.
 *           - The order may have been deleted or already marked as completed.
 *         content:
 *           application/json:
 *             example:
 *               error: "Order with ID 205 not found."
 *       500:
 *         description: |
 *           **Internal Server Error** – Triggered if:
 *           - A database issue occurs during cart clearing or order transfer.
 *           - Unexpected errors happen during backend processing.
 *         content:
 *           application/json:
 *             example:
 *               error: "Server error during order completion."
 */

router.post('/', orderController.completeOrder);

module.exports = router;
