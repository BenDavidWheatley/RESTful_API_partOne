const pool = require('../../../db.js');
const queries = require('../queries/cartQueries.js');
const userQueries = require('../queries/userQueries.js');
const orderQueries = require('../queries/orderQueries.js');

/******** CREATE OR GET ACTIVE CART FOR A USER ********/
/* POST - http://localhost:3000/api/v1/restfulapi/cart/

Body example - {
    "id": 1
} */

const getOrCreateCart = (req, res) => {
    const { id } = req.body; // User ID
    console.log(`This is the user's ID: ${id}`);

    // Check if user exists
    pool.query(userQueries.getUser, [id], (error, result) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.rows.length === 0) {
            console.log("User does not exist");
            return res.status(404).json({ error: "User does not exist" });
        }

        // If user exists, check if they have an active cart
        pool.query(queries.getActiveCart, [id], (error, result) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (result.rows.length === 0) {
                // No active cart, create a new one
                pool.query(queries.createCart, [id], (error, result) => {
                    if (error) {
                        console.error("Database error:", error);
                        return res.status(500).json({ error: "Internal server error" });
                    }
                    return res.status(201).json(result.rows[0]); // Return new cart
                });
            } else {
                return res.status(200).json(result.rows[0]); // Return existing cart
            }
        });
    });
};

/********* SEE ALL CARTS BY USER ID *********/ 

// example -  http://localhost:3000/api/v1/restfulapi/cart/?user_id=3

const getUserCarts = (req, res) => {
    const { user_id } = req.query;
    console.log(user_id);

    pool.query(queries.getUserCarts, [user_id], (error, result) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(201).json(result.rows);
    })
}


/******** ADD ITEM TO CART ********/

/*
POST http://localhost:3000/api/v1/restfulapi/cart/item
Body -    {
    "cart_id": 5,
    "product_id": 10,
    "quantity": 10
}
*/
const addItemToCart = (req, res) => {
    const { cart_id, product_id, quantity } = req.body;
    console.log(cart_id);

    //First check if cart exists;
    pool.query(queries.checkForCart, [cart_id], (error, result) => {
        if(error) throw error;
        if (result.rows.length === 0) {
            console.log("Cart does not exist");
            return res.status(404).json({ error: "Cart does not exist" });
        }
        pool.query(queries.addOrUpdateItem, [cart_id, product_id, quantity], (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json({ message: 'Item added to cart', item: result.rows[0] });
        });
    })
   
};



/******** GET CART DETAILS ********/
// example - http://localhost:3000/api/v1/restfulapi/cart/2

const getCartDetails = (req, res) => {
    const { cart_id } = req.params;

    pool.query(queries.getCartDetails, [cart_id], (error, result) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found or empty' });
        }

        res.status(200).json(result.rows);
    });
};


/******** UPDATE ITEM QUANTITY ********/
// note - this replaces the quantity instead of adding
/*
put - http://localhost:3000/api/v1/restfulapi/cart/item

Body - {
    "cart_id": 2,
    "product_id": 5,
    "quantity": 3
}
*/
const updateCartItem = (req, res) => {
    const { cart_id, product_id, quantity } = req.body;

    // Check if cart exists first
    pool.query(queries.getCartDetails, [cart_id], (error, cartResult) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Internal server error when checking for cart' });
        }

        if (cartResult.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Check if the item exists in the cart
        pool.query(queries.getCartItem, [cart_id, product_id], (error, itemResult) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ error: 'Internal server error when checking for item within the cart' });
            }

            if (itemResult.rows.length === 0) {
                return res.status(404).json({ error: 'Item not found in the cart' });
            }

            // If quantity <= 0, remove item
            if (quantity <= 0) {
                return pool.query(queries.removeItem, [cart_id, product_id], (error) => {
                    if (error) {
                        console.error('Database error:', error);
                        return res.status(500).json({ error: 'Internal server error when removing the item form the cart' });
                    }
                    res.status(200).json({ message: 'Item removed from cart' });
                });
            }

            // Update the cart item if it exists
            pool.query(queries.updateCartItem, [cart_id, product_id, quantity], (error, updateResult) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(200).json({ message: 'Cart item updated', item: updateResult.rows[0] });
            });
        });
    });
};


/******** REMOVE ITEM FROM CART ********/
/*
DELETE - http://localhost:3000/api/v1/restfulapi/cart/item
Body - {
    "cart_id": 2,
    "product_id": 2,
}
*/
const removeItemFromCart = (req, res) => {
    const { cart_id, product_id } = req.body;

    // Check if cart exists

    pool.query(queries.getCartDetails, [cart_id], (error, result) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Internal server error when checking for cart' });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        pool.query(queries.removeItem, [cart_id, product_id], (error) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json({ message: 'Item removed from cart' });
        });
    });
   
};

/******** CHECKOUT (Complete the Cart) ********/

/*
Post - http://localhost:3000/api/v1/restfulapi/cart/checkout
Body - {
    "cart_id": 2
}
*/

/*
const checkoutCart = (req, res) => {
    const { cart_id } = req.body;

    pool.query(queries.completeCart, [cart_id], (error) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ message: 'Cart checked out successfully' });
    });
};*/
/******** CHECKOUT CART ********/

const checkoutCart = (req, res) => {
    const { cart_id, user_id } = req.body;

    console.log(`Checking out cart: ${cart_id} for user: ${user_id}`);

    // Check if cart exists
    pool.query(queries.getCartDetails, [cart_id], (error, cartResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Internal server error getting cart details" });
        }

        if (cartResult.rows.length === 0) {
            console.log("Cart not found or empty");
            return res.status(404).json({ error: "Cart not found or empty" });
        }

        // Get total price of cart
        pool.query(orderQueries.getCartTotal, [cart_id], (error, totalResult) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ error: "Internal server error getting total price" });
            }

            const total_price = totalResult.rows[0]?.total_price || 0;

            console.log(total_price);

            // Get user's delivery address
            pool.query(orderQueries.getUserAddress, [user_id], (error, addressResult) => {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).json({ error: "Internal server error getting users address" });
                }

                if (addressResult.rows.length === 0) {
                    return res.status(404).json({ error: "User address not found" });
                }

                const delivery_address = addressResult.rows[0].delivery_address;

                console.log(delivery_address);
                // Insert order into orders table
                pool.query(orderQueries.createOrder, [user_id, cart_id, total_price, delivery_address], (error, orderResult) => {
                    if (error) {
                        console.error("Database error:", error);
                        return res.status(500).json({ error: "Internal server error creating the order" });
                    }

                    console.log("Order created successfully");
                    return res.status(201).json({ message: "Order placed successfully", order: orderResult.rows[0] });
                }); 
            }); 
        });
    });
};

module.exports = {
    getOrCreateCart,
    addItemToCart,
    getCartDetails,
    updateCartItem,
    removeItemFromCart,
    checkoutCart,
    getUserCarts
};
