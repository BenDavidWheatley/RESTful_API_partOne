const pool = require('../../../db.js');
const queries = require('./cartQueries.js');
const userQueries = require('../user/userQueries.js');
const orderQueries = require('../orders/orderQueries.js');

/******** CREATE OR GET ACTIVE CART FOR A USER ********/
/* POST - http://localhost:3000/api/v1/restfulapi/cart/


Body example - {
    "id": 1
} */

const getOrCreateCart = (req, res) => {
    const { id } = req.body; // get the User ID from the request body
    console.log(`The following info has been requested to get or create a cart should on not exist for the user- 
        \nUser = ${id}`);


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
                    console.log("New cart created")
                    return res.status(201).json(result.rows[0]); // Return new cart
                });
            } else {
                console.log("User has an existing cart and has been returned")
                return res.status(200).json(result.rows[0]); // Return existing cart
            }
        });
    });
};

/********* SEE ALL CARTS BY USER ID *********/ 

// example -  http://localhost:3000/api/v1/restfulapi/cart/?user_id=3

const getUserCarts = (req, res) => {
    const { user_id } = req.query;
    console.log(`Info requested with user ID - ${user_id}`); // Log the user 
    if(user_id == undefined){
        console.log("User undefined");
        return res.status(404).json({ error: "User undefined" });
    }
    pool.query(queries.getUserCarts, [user_id], (error, result) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        console.log("Users carts have been returned"); //This message won't run if the cart was returned in the above post that creates a new cart but returns an existing
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
    const { cart_id, product_id, quantity } = req.body; //Gets the information within the request
    console.log(`The following info has been requested to add an item to the cart- 
                    \nCart id: ${cart_id}. 
                      Product ID: ${product_id}. 
                      Quantity: ${quantity}`);

    //First check if cart exists;
    pool.query(queries.checkForCart, [cart_id], (error, result) => {
        if(error) throw error;
        if (result.rows.length === 0) {
            console.log("Cart does not exist");
            return res.status(404).json({ error: "Cart does not exist" });
        }
        //If the cart exists we then update the cart with the requested information
        pool.query(queries.addOrUpdateItem, [cart_id, product_id, quantity], (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            console.log("Items have been added to the cart")
            res.status(200).json({ message: 'Item added to cart', item: result.rows[0] });
        });
    })
   
};


/******** GET CART DETAILS ********/
// example - http://localhost:3000/api/v1/restfulapi/cart/2

const getCartDetails = (req, res) => {
    // Get the requested cart id and log this to the console.
    const { cart_id } = req.params;
    console.log(`Cart id : ${cart_id}`);

    pool.query(queries.getCartDetails, [cart_id], (error, result) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found or empty' });
        }
        console.log(`Cart with the id of ${cart_id} exists and was returned`)
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

    //Get the requested information and log the details to the console.
    const { cart_id, product_id, quantity } = req.body;
    console.log(`The following info has been requested to update an item in the cart - 
                  \nCart id: ${cart_id}. 
                    Product ID: ${product_id}. 
                    Quantity: ${quantity}`);

    // Check if cart exists first
    pool.query(queries.getCartDetails, [cart_id], (error, cartResult) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Internal server error when checking for cart' });
        }

        if (cartResult.rows.length === 0) {
            console.log("Cart not found");
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
    // Get the requested information and log this to the console.
    const { cart_id, product_id } = req.body;
    console.log(`The following info has been requested to remove an item from the cart - 
        \nCart id: ${cart_id}. 
          Product ID: ${product_id}.`);


    // Check if cart exists
    pool.query(queries.getCartDetails, [cart_id], (error, result) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Internal server error when checking for cart' });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        //If the cart exists then we remove the ite from the cart
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
    "user_id": 3
    "cart_id": 6
}
*/

const checkoutCart = (req, res) => {
    // Get the requested information and log this to the console.
    const { cart_id, user_id } = req.body;
    console.log(`The following info has been requested to check out the cart- 
        \nCart id: ${cart_id}. 
          User id: ${user_id}.`);

    // Check if cart exists
    pool.query(queries.getCartDetails, [cart_id], (error, cartResult) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Internal server error getting cart details" });
        }

        if (cartResult.rows.length === 0) {
            console.log(`Cart not found or empty for user ${user_id} with cart id : ${cart_id}`);
            return res.status(404).json({ error: "Cart not found or empty" });
        }

        // if cart exists then get total price of cart
        pool.query(orderQueries.getCartTotal, [cart_id], (error, totalResult) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ error: "Internal server error getting total price" });
            }

            const total_price = totalResult.rows[0]?.total_price || 0;

            console.log(`The total price on cart id - ${cart_id} is ${total_price}`);

            // Get user's delivery address
            pool.query(orderQueries.getUserAddress, [user_id], (error, addressResult) => {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).json({ error: "Internal server error getting users address" });
                }

                if (addressResult.rows.length === 0) {
                    return res.status(404).json({ error: "User address not found" });
                }
/*const getUserAddress = `
    SELECT delivery_address 
    FROM users 
    WHERE user_id = $1`;*/
                const delivery_address = addressResult.rows[0].delivery_address;

                console.log(`the delivery address for user - ${user_id} is ${delivery_address}`);
                // Insert order into orders table
                pool.query(orderQueries.createOrder, [user_id, cart_id, total_price, delivery_address], (error, orderResult) => {
                    if (error) {
                        console.error("Database error:", error);
                        return res.status(500).json({ error: "Internal server error creating the order" });
                    }

                    console.log(`Order created successfully for user ${user_id} on cart - ${cart_id}`);
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
