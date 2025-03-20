const { Router } = require('express');
const router = Router();

const controller = require('./productController.js');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     description: |
 *       This endpoint retrieves a comprehensive list of all available products in the database. 
 *       Each product entry includes detailed information such as name, description, pricing, inventory levels, and timestamps. 
 *       
 *       **Key Notes:**
 *       - The endpoint does not require authentication.
 *       - Pagination or filtering logic may be implemented separately if the dataset is extensive.
 *       - The `inventory` field indicates the number of items currently in stock.
 *     operationId: getAllProducts
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successfully retrieved all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique identifier for the product
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the product
 *                     example: "Wireless Mouse"
 *                   description:
 *                     type: string
 *                     description: A brief overview of the product's features
 *                     example: "Ergonomic wireless mouse with USB connectivity."
 *                   price:
 *                     type: string
 *                     description: The retail price of the product in USD
 *                     example: "29.99"
 *                   inventory:
 *                     type: integer
 *                     description: The available stock count for the product
 *                     example: 100
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp indicating when the product was added
 *                     example: "2025-03-18T12:34:56Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp indicating when the product details were last updated
 *                     example: "2025-03-20T15:00:00Z"
 *       500:
 *         description: Database query error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database query failed"
 */
router.get('/', controller.getAllProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add one or multiple products
 *     description: |
 *       This endpoint allows adding one or multiple products to the database in a **single request**. 
 *       
 *       **Key Notes:**
 *       - Each product must include `name`, `description`, `price`, and `inventory`.
 *       - To add multiple products, pass an **array** of product objects.
 *       - Ensure that `price` values are correctly formatted as strings (e.g., `"12.99"`).
 *       
 *       **Usage Examples:**
 *       - Adding a **single product**:
 *         ```json
 *         {
 *           "name": "t-shirt",
 *           "description": "red t-shirt with logo on the sleeve",
 *           "price": "12.99",
 *           "inventory": 200
 *         }
 *         ```
 *       - Adding **multiple products**:
 *         ```json
 *         [
 *           {
 *             "name": "hat",
 *             "description": "green wooly hat",
 *             "price": "19.99",
 *             "inventory": 100
 *           },
 *           {
 *             "name": "scarf",
 *             "description": "blue knitted scarf",
 *             "price": "14.99",
 *             "inventory": 150
 *           }
 *         ]
 *         ```
 *     operationId: addProduct
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the product
 *                     example: "t-shirt"
 *                   description:
 *                     type: string
 *                     description: A brief overview of the product's features
 *                     example: "red t-shirt with logo on the sleeve"
 *                   price:
 *                     type: string
 *                     description: The retail price of the product (formatted as a string for precision)
 *                     example: "12.99"
 *                   inventory:
 *                     type: integer
 *                     description: The available stock count for the product
 *                     example: 200
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the product
 *                       example: "hat"
 *                     description:
 *                       type: string
 *                       description: A brief overview of the product's features
 *                       example: "green wooly hat"
 *                     price:
 *                       type: string
 *                       description: The retail price of the product (formatted as a string for precision)
 *                       example: "19.99"
 *                     inventory:
 *                       type: integer
 *                       description: The available stock count for the product
 *                       example: 100
 *     responses:
 *       201:
 *         description: Product(s) added successfully
 *         content:
 *           application/json:
 *             example: 
 *               message: "Product(s) added successfully."
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             example:
 *               error: "Missing some data. Ensure all products have: name, description, price, and inventory."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error."
 */
router.post('/', controller.addProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     description: |
 *       This endpoint fetches detailed information about a **single product** based on its unique `ID`.
 *       
 *       **Key Notes:**
 *       - The `ID` must be provided in the URL path as a required parameter.
 *       - If the specified product does not exist, a `404 Not Found` error will be returned.
 *       
 *       **Example Request URL:** `/api/v1/restfulapi/products/5`
 *       
 *       **Example Successful Response:**
 *       ```json
 *       {
 *         "id": 5,
 *         "name": "Wireless Mouse",
 *         "description": "Ergonomic wireless mouse with USB connectivity.",
 *         "price": "29.99",
 *         "inventory": 100,
 *         "created_at": "2025-03-18T12:34:56Z",
 *         "updated_at": "2025-03-20T15:00:00Z"
 *       }
 *       ```
 *     operationId: getSingleProduct
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: |
 *           The unique identifier of the product.  
 *           **Must be a valid integer.**
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Successfully retrieved the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier for the product
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The product's name
 *                   example: "Wireless Mouse"
 *                 description:
 *                   type: string
 *                   description: Detailed information about the product's features
 *                   example: "Ergonomic wireless mouse with USB connectivity."
 *                 price:
 *                   type: string
 *                   description: The retail price of the product (stored as a string for precision)
 *                   example: "29.99"
 *                 inventory:
 *                   type: integer
 *                   description: The number of available units in stock
 *                   example: 100
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp indicating when the product was added to the database
 *                   example: "2025-03-18T12:34:56Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp indicating when the product details were last updated
 *                   example: "2025-03-20T15:00:00Z"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Product with an ID of 5 does not exist"
 */
router.get('/:id', controller.getSingleProduct)

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product information
 *     description: |
 *       This endpoint updates the details of an **existing product** identified by its unique `ID`.
 *       
 *       **Key Notes:**
 *       - The `ID` must be specified in the path as a required parameter.
 *       - Only the provided fields will be updated. Fields that are omitted will remain unchanged.
 *       - If no fields are provided in the request body, a `400 Bad Request` error will be returned.
 *       - If the product ID does not exist, a `404 Not Found` error will be returned.
 *       
 *       **Example Request URL:** `/api/v1/restfulapi/products/5`
 *       
 *       **Example Successful Response:**
 *       ```json
 *       {
 *         "message": "Product updated successfully",
 *         "product": {
 *           "id": 4,
 *           "name": "Hat",
 *           "description": "Green wooly hat",
 *           "price": "19.99",
 *           "inventory": 100,
 *           "created_at": "2025-02-11T11:17:55.221Z",
 *           "updated_at": "2025-03-18T14:18:54.662Z"
 *         }
 *       }
 *       ```
 *     operationId: updateProduct
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: |
 *           The unique identifier of the product to update.  
 *           **Must be a valid integer.**
 *         schema:
 *           type: integer
 *           example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the product
 *                 example: "Hat"
 *               description:
 *                 type: string
 *                 description: A brief description of the product
 *                 example: "Green wooly hat"
 *               price:
 *                 type: string
 *                 description: The updated price of the product (stored as a string for precision)
 *                 example: "19.99"
 *               inventory:
 *                 type: integer
 *                 description: The updated stock count for the product
 *                 example: 200
 *     responses:
 *       200:
 *         description: Successfully updated the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating successful update
 *                   example: "Product updated successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique identifier for the updated product
 *                       example: 4
 *                     name:
 *                       type: string
 *                       description: Updated product name
 *                       example: "Hat"
 *                     description:
 *                       type: string
 *                       description: Updated product description
 *                       example: "Green wooly hat"
 *                     price:
 *                       type: string
 *                       description: Updated product price
 *                       example: "19.99"
 *                     inventory:
 *                       type: integer
 *                       description: Updated inventory count
 *                       example: 100
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Original creation timestamp
 *                       example: "2025-02-11T11:17:55.221Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the product details were last updated
 *                       example: "2025-03-18T14:18:54.662Z"
 *       400:
 *         description: Bad request - No fields provided for update
 *         content:
 *           application/json:
 *             example:
 *               error: "No fields provided for update."
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Product not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to update product due to server error."
 */
router.put('/:id', controller.updateProduct)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: |
 *       This endpoint allows the deletion of a **specific product** identified by its unique `ID`.
 *       
 *       ### Important Notes:
 *       - The `ID` parameter must be included in the request path.
 *       - If the product with the specified `ID` exists, it will be permanently removed from the database.
 *       - If the product ID does **not exist**, a `404 Not Found` response is returned.
 *       - If an internal server error occurs during the deletion process, a `500 Internal Server Error` response will be returned.
 *       
 *       ### Example Use Case:
 *       - **Request URL:** `/products/5`
 *       - **Response (200):** `{ "message": "Product removed successfully" }`
 *       
 *     operationId: deleteProduct
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: |
 *           The **unique identifier** of the product to delete. 
 *           Only valid numeric IDs that match an existing product are accepted.
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Product removed successfully"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Product does not exist"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error"
 */



router.delete('/:id', controller.deleteProduct);


module.exports = router;

