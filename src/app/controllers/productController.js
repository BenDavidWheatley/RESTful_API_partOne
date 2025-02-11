const pool = require('../../../db.js')
const queries = require('../queries/productQueries.js');

/******** GET ALL PRODUCTS ********/

const getAllProducts = (req, res) => {
    pool.query(queries.getAllProducts, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(200).json(results.rows);
    });
}

/******* GET SINGLE PRODUCT BY ID*********/

const getSingleProduct = (req, res) => {
    const id = (req.params.id);
    pool.query(queries.getSingleProduct, [id], (error, results) => {
        if(error) throw error;
        if (results.rows.length === 0) {
            return res.status(404).send('Product does not exist');
        }
        res.status(200).json(results.rows);
    })
}

/******** ADD PRODUCT *********/

const addProduct = (req, res) => {
    console.log("Received data:", req.body); // Debugging line

    // Check if req.body is an array (multiple products) or an object (single product)
    const products = Array.isArray(req.body) ? req.body : [req.body]; 

    for (const product of products) {
        const { name, description, price, inventory } = product;

        if (!name || !description || price === undefined || inventory === undefined) {
            console.log(`Missing data for product: ${JSON.stringify(product)}`);
            return res.status(400).send("Missing some data, please make sure that all new products have the following fields: name, description, price, and inventory.");
        }

        pool.query(queries.addProduct, [name, description, price, inventory], (error, result) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).send("Internal server error");
            }
        });
    }

    res.status(201).send("Product(s) added successfully.");
};

/******** UPDATE PRODUCT  *********/

const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, price, inventory } = req.body;

    let updates = [];
    let values = [];

    if (name) {
        updates.push(`name = $${values.length + 1}`);
        values.push(name);
    }
    if (description) {
        updates.push(`description = $${values.length + 1}`);
        values.push(description);
    }
    if (price !== undefined) {
        updates.push(`price = $${values.length + 1}`);
        values.push(price);
    }
    if (inventory !== undefined) {
        updates.push(`inventory = $${values.length + 1}`);
        values.push(inventory);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: "No fields provided for update" });
    }

    values.push(id); // Add product ID to values array

    // Generate the query
    const query = queries.updateProductQuery(updates);

    pool.query(query, values, (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: results.rows[0] });
    });
};


/******** DELETE PRODUCT *********/

const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getSingleProduct, [id], (error, results) => {
        const noProductFound = !results.rows.length;
        if (noProductFound){
            return res.send("Product does not exist");
        }
        pool.query(queries.deleteProduct, [id], (error, results) => {
            if(error) throw error;
            return res.status(200).send("Product deleted");
        })
    })
}

module.exports =({
    getAllProducts,
    getSingleProduct,
    addProduct,
    deleteProduct,
    updateProduct
})