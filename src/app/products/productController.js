const pool = require('../../../db.js')
const queries = require('../products/productQueries.js');

/******** GET ALL PRODUCTS ********/

/*
GET - http://localhost:3000/api/v1/restfulapi/products
*/

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
/*

Attach id to the end of the url
GET http://localhost:3000/api/v1/restfulapi/products/6

*/

const getSingleProduct = (req, res) => {
    const id = (req.params.id);
    console.log(`product id ${id} requested`);

    pool.query(queries.getSingleProduct, [id], (error, results) => {
        if(error) throw error;
        if (results.rows.length === 0) {
            console.log(`Product with an id of ${id} does not exist`)
            return res.status(404).send(`Product with an id of ${id} does not exist`);
        }
        console.log(`Product with an id of ${id} was found and information returned`)
        res.status(200).json(results.rows);
    })
}

/******** ADD PRODUCT *********/
/*
POST http://localhost:3000/api/v1/restfulapi/products

body example for a single product  - 
    {
        "name" : "t-shirt",
        "description" : "red t-shirt with logo on the sleeve",
        "price" : "12.99",
        "inventory" : 200
    }

body example for an array of products
[
    {
        "name" : "trouser",
        "description" : "blue cargo trousers",
        "price" : "45",
        "inventory" : 10
    },
    {
        "name" : "hat",
        "description" : "green wooly hat",
        "price" : "19.99",
        "inventory" : 100
    }
]
*/

const addProduct = (req, res) => {
    console.log("Received data:", req.body);

    const products = Array.isArray(req.body) ? req.body : [req.body];

    let successCount = 0;

    for (const product of products) {
        const { name, description, price, inventory } = product;

        if (!name || !description || price === undefined || inventory === undefined) {
            console.log(`Missing data for product: ${JSON.stringify(product)}`);
            return res.status(400).send("Missing some data. Ensure all products have: name, description, price, and inventory.");
        }

        // Add the updated_at field with the current timestamp
        const updatedAt = new Date().toISOString();

        pool.query(
            queries.addProduct,
            [name, description, price, inventory, updatedAt], // Now includes `updated_at`
            (error, result) => {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).send("Internal server error.");
                }

                successCount++;
                if (successCount === products.length) {
                    res.status(201).send("Product(s) added successfully.");
                }
            }
        );
    }
};

/******** UPDATE PRODUCT  *********/

/*
POST http://localhost:3000/api/v1/restfulapi/products/16
    {
            "name" : "hat",
            "description" : "green wooly hat",
            "price" : "19.99",
            "inventory" : 100
    }
*/


const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, price, inventory } = req.body;
    console.log(`The following product has been requested for update -
                Name : ${name? name : "not updating"},
                Description : ${description? description : "not updating"},
                Price : ${price? price : "not updating"},
                inventory : ${inventory? inventory : "not updating"}`)

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
            return res.status(500).json({ error: "Failed to update product due to server error." });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: results.rows[0] });
    });
};


/******** DELETE PRODUCT *********/

/**
 * Deletes a product from the database by its ID.
 * 
 * Endpoint Example:
 * DELETE http://localhost:3000/api/v1/restfulapi/products/{id}
 *
 * Responses:
 * - 200: Product deleted successfully
 * - 404: Product not found
 * - 500: Internal server error
 */

const deleteProduct = (req, res) => {
    // Extract the product ID from the request parameters
    const id = parseInt(req.params.id);
    console.log(`The following product ID has been requested for deletion: ${id}`);

    // Check if the product exists before attempting deletion
    pool.query(queries.getSingleProduct, [id], (error, results) => {
        // Handle potential database error during the lookup
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Internal server error while checking product existence." });
        }

        // Handle case where the product does not exist
        const noProductFound = !results.rows.length;
        if (noProductFound) {
            console.log(`Product with ID ${id} not found.`);
            return res.status(404).json({ error: "Product does not exist" });
        }

        // Proceed to delete the product if found
        pool.query(queries.deleteProduct, [id], (error) => {
            // Handle potential database error during the deletion process
            if (error) {
                console.error("Error during product deletion:", error);
                return res.status(500).json({ error: "Internal server error during product deletion." });
            }

            // Successfully deleted the product
            console.log(`Product ID ${id} deleted successfully.`);
            return res.status(200).json({ message: "Product deleted successfully." });
        });
    });
};


module.exports =({
    getAllProducts,
    getSingleProduct,
    addProduct,
    deleteProduct,
    updateProduct
})