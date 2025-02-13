/* Get all products */
const getAllProducts = `
    SELECT * 
    FROM products`;

/* Get single product */
const getSingleProduct = `
    SELECT * 
    FROM products 
    WHERE id = $1`;

/* Add product */
const addProduct = `
    INSERT INTO products (name, description, price, inventory, updated_at) 
    VALUES ($1,$2,$3,$4)`;

/* Delete a product */
const deleteProduct = `
    DELETE FROM products 
    WHERE id=$1`;

/* Update a product */
const updateProductQuery = (updates) => {
    return `
        UPDATE products 
        SET ${updates.join(', ')}, updated_at = NOW() 
        WHERE id = $${updates.length + 1} 
        RETURNING *`;
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    addProduct,
    deleteProduct,
    updateProductQuery
}