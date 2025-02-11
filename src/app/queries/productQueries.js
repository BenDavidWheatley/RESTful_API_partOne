const getAllProducts = 'SELECT * FROM products';
const getSingleProduct = "SELECT * FROM products WHERE id = $1";
const addProduct = "INSERT INTO products (name, description, price, inventory, updated_at) VALUES ($1,$2,$3,$4)";
const deleteProduct = "DELETE FROM products WHERE id=$1";

const updateProductQuery = (updates) => {
    return `UPDATE products SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${updates.length + 1} RETURNING *`;
};



module.exports = {
    getAllProducts,
    addProduct,
    getSingleProduct,
    deleteProduct,
    updateProductQuery
}