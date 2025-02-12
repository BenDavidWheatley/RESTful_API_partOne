const getActiveCart = `
    SELECT * FROM cart WHERE user_id = $1 AND status = 'active' LIMIT 1;
`;

const createCart = `
    INSERT INTO cart (user_id) VALUES ($1) RETURNING *;
`;


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

const checkForCart = 'SELECT * FROM cart WHERE id = $1';

const addOrUpdateItem = `
    INSERT INTO cart_items (cart_id, product_id, quantity) 
    VALUES ($1, $2, $3) 
    ON CONFLICT (cart_id, product_id) 
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity 
    RETURNING *;

`;

const getCartDetails = `
    SELECT ci.id AS item_id, ci.cart_id, ci.product_id, p.name, p.price, ci.quantity 
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = $1;
`;
const getCartItem = `
    SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2;
`;

const updateCartItem = `
    UPDATE cart_items SET quantity = $3 WHERE cart_id = $1 AND product_id = $2 RETURNING *;
`;

const removeItem = `
    DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *;
`;

const completeCart = `
    UPDATE cart SET status = 'completed', updated_at = NOW() WHERE id = $1 RETURNING *;
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
