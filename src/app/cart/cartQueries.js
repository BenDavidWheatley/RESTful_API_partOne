/********* QUERY OPTIONS ********/

/*
1 - Check if user has a cart and is active
2 - Create a cart in the database for user
3 - Get all the carts for a specified user
4 - Check if a cart exists 
5 - Add or update an item 
6 - Get details of a cart
7 - Get item in a cart
8 - Update the item in the cart
9 - Remove the item in the cart
10 - Complete cart - THIS WILL BE MOVED TO ORDERSCONTROLLER 
*/


/* 1 - Check if user has a cart and is active */
const getActiveCart = `
    SELECT * 
    FROM cart 
    WHERE user_id = $1 
    AND status = 'active' 
    LIMIT 1;
`;

/* 2 - Create a cart in the database for user */
const createCart = `
    INSERT INTO cart (user_id) 
    VALUES ($1) 
    RETURNING *;
`;

/* 3 - Get all the carts for a specified user */
const getUserCarts = `
    SELECT 
        users.id AS user_id, 
        users.first_name, 
        users.last_name, 
        cart.id AS cart_id, 
        cart.status, 
        cart.created_at, 
        COALESCE(json_agg(
            json_build_object(
                'product_id', cart_items.product_id,
                'quantity', cart_items.quantity,
                'product_name', products.name,
                'product_price', products.price
            )
        ) FILTER (WHERE cart_items.product_id IS NOT NULL), '[]') AS products
    FROM users 
    LEFT JOIN cart ON users.id = cart.user_id  
    LEFT JOIN cart_items ON cart_items.cart_id = cart.id  
    LEFT JOIN products ON products.id = cart_items.product_id  
    WHERE users.id = $1
    GROUP BY users.id, cart.id
    ORDER BY cart.created_at DESC;

`;

/* 4 - Check if a cart exists */
const checkForCart = `
    SELECT * FROM cart 
    WHERE id = $1`;

/* 5 - Add or update an item */
const addOrUpdateItem = `
    INSERT INTO cart_items (cart_id, product_id, quantity) 
    VALUES ($1, $2, $3) 
    ON CONFLICT (cart_id, product_id) 
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity 
    RETURNING *;
`;

/* 6 - Get details of a cart */
const getCartDetails = `
    SELECT ci.id AS item_id, ci.cart_id, ci.product_id, p.name, p.price, ci.quantity 
    FROM cart_items ci
    JOIN products p 
    ON ci.product_id = p.id
    WHERE ci.cart_id = $1;
`;

/* 7 - Get item in a cart */
const getCartItem = `
    SELECT * 
    FROM cart_items 
    WHERE cart_id = $1 
    AND product_id = $2;
`;

/* 8 - Update the item in the cart */
const updateCartItem = `
    UPDATE cart_items 
    SET quantity = $3 
    WHERE cart_id = $1 
    AND product_id = $2 
    RETURNING *;
`;

/* 9 - Remove the item in the cart */
const removeItem = `
    DELETE FROM cart_items 
    WHERE cart_id = $1 
    AND product_id = $2 
    RETURNING *;
`;

/* 10 - Complete cart - THIS WILL BE MOVED TO ORDERSCONTROLLER */
const completeCart = `
    UPDATE cart 
    SET status = 'completed', updated_at = NOW() 
    WHERE id = $1 
    RETURNING *;
`;

module.exports = {
    getActiveCart,
    createCart,
    getUserCarts,
    getCartItem,
    checkForCart,
    addOrUpdateItem,
    getCartDetails,
    updateCartItem,
    removeItem,
    completeCart
};
