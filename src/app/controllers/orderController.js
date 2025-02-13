const pool = require('../../../db.js');
const queries = require('../queries/orderQueries.js');
const cartQuery = require('../queries/cartQueries.js');


/******** COMPLETE ORDER *********/

const completeOrder = (req, res) => {
    const { order_id } = req.body;

    console.log(`Completing order: ${order_id}`);

    // Check if order exists
    pool.query(queries.getOrderDetails, [order_id], (error, orderResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Internal server error checking if order exists " });
        }

        if (orderResult.rows.length === 0) {
            console.log("Order not found");
            return res.status(404).json({ error: "Order not found" });
        }

        const orderStatus = orderResult.rows[0].delivery_status;
        console.log(`This is the order status - ${orderStatus}`);
        if(orderStatus === 'completed'){
            
        }

        const cart_id = orderResult.rows[0].cart_id; 


        // Move cart items to order_items
        pool.query(queries.moveCartToOrderItems, [order_id, cart_id], (error) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ error: "Internal server error moving cart_items to order_items" });
            }

            // Update order status to 'completed'
            pool.query(queries.updateOrderStatus, ["completed", order_id], (error) => {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).json({ error: "Internal server error updated the order status" });
                }

                // Clear cart items after moving them
                pool.query(queries.clearCartItems, [cart_id], (error) => {
                    console.log(cart_id);
                    if (error) {
                        console.error("Database error:", error);
                        return res.status(500).json({ error: "Internal server error clearing the cart_items after moving them" });
                    }

                    console.log("Order completed successfully");
                    res.status(200).json({ message: "Order completed successfully" });
                });
            });
        }); 
    }); 
};


module.exports = {
    completeOrder
}
