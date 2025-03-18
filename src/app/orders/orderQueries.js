/* ORDER QUERIES */
/* 
1 - Get total price of cart
2 - Get user's delivery address
3 - Insert order into orders table
4 - Get order details (to find cart_id)
5 - Move cart items to order_items
6 - Update order status
7 - Clear cart items after checkout
*/
/* Get total price of cart */
const getCartTotal = `
    SELECT SUM(p.price * ci.quantity) AS total_price
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = $1;
`;

/* Get user's delivery address */
const getUserAddress = `
    SELECT delivery_address
    FROM users 
    WHERE id = $1`;

/* Insert order into orders table */
const createOrder = `
    INSERT INTO orders (user_id, cart_id, total, delivery_address, delivery_status) 
    VALUES ($1, $2, $3, $4, 'pending') 
    RETURNING *`;

/* Get order details (to find cart_id) */
const getOrderDetails = `
    SELECT cart_id 
    FROM orders 
    WHERE id = $1`;

/*  Move cart items to order_items */
const moveCartToOrderItems = `
    INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
    SELECT $1, ci.product_id, ci.quantity, p.price 
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = $2;
`;

/* Update order status */
const updateOrderStatus = `
    UPDATE orders 
    SET delivery_status = $1 
    WHERE id = $2`;

/* Clear cart items after checkout */
const clearCartItems = `
    DELETE FROM cart_items 
    WHERE cart_id = $1`;

/* Get all orders*/ 
const getAllOrders = `
    SELECT *
    FROM orders
`;
  
module.exports = {
    getCartTotal,
    getUserAddress,
    createOrder,
    getOrderDetails,
    moveCartToOrderItems,
    updateOrderStatus,
    clearCartItems,
    getAllOrders
}
