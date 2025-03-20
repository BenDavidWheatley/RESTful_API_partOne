const { Router } = require('express');
const router = Router();

const controller = require('./userController.js');

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve All Users
 *     description: |
 *       This endpoint fetches a complete list of all registered users from the database.  
 *       
 *       ### Workflow
 *       - The system queries the database and retrieves all user records.
 *       - Each user object includes details such as their ID, name, email, and delivery address.
 *
 *       ### Use Cases
 *       - **Admin Panels:** For administrators managing user accounts.
 *       - **Reporting & Analytics:** To generate comprehensive user data insights.
 *       - **Bulk Operations:** Ideal for exporting user data or mass communication campaigns.
 *
 *       ### Important Notes
 *       - Ensure proper **pagination** implementation if the database contains a large number of users.
 *       - Consider implementing **access control** to restrict this endpoint to authorized personnel.
 *       - User **passwords** and other sensitive details are **never exposed** via this endpoint.
 *       
 *     operationId: getAllUsers
 *     tags:
 *       - User Queries
 *     responses:
 *       200:
 *         description: |
 *           **Success** - The list of all registered users was retrieved successfully.
 *           Each user object contains essential user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique identifier for the user.
 *                     example: 1
 *                   first_name:
 *                     type: string
 *                     description: The user's first name.
 *                     example: "Jane"
 *                   last_name:
 *                     type: string
 *                     description: The user's last name.
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     description: The user's registered email address.
 *                     example: "jane.doe@example.com"
 *                   delivery_address:
 *                     type: string
 *                     description: The user's delivery address for orders.
 *                     example: "456 Elm Street"
 *       500:
 *         description: |
 *           **Internal Server Error** - This occurs if:
 *           - The database query fails.
 *           - Unexpected backend issues arise.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error while fetching users"
 */


router.get('/', controller.getAllUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a Single User by ID
 *     description: |
 *       This endpoint fetches details of a specific user based on the provided ID.  
 *
 *       ### Workflow
 *       - The system verifies if the provided `id` exists in the database.
 *       - If found, it returns the corresponding user's details.
 *       - If the `id` does not match any record, a `404 Not Found` response is returned.
 *
 *       ### Use Cases
 *       - **Profile Display:** Fetching user details for profile pages.
 *       - **Admin Tools:** Administrators reviewing or managing individual user records.
 *       - **Order History Links:** Identifying users linked to specific transactions.
 *
 *       ### Important Notes
 *       - The `id` parameter must be provided in the **URL path** and must be an **integer**.
 *       - This endpoint should implement **access control** to ensure only authorized users or admins can retrieve sensitive data.
 *       - The response excludes sensitive information such as **passwords**.
 *       
 *     operationId: getUser
 *     tags:
 *       - User Queries
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: |
 *           Unique identifier for the user to retrieve.  
 *           Example: `1` for John Doe or `2` for Jane Doe.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: |
 *           **Success** - The user's details were successfully retrieved.  
 *           The response includes key user details such as name, email, and delivery address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier for the user.
 *                   example: 1
 *                 first_name:
 *                   type: string
 *                   description: The user's first name.
 *                   example: "John"
 *                 last_name:
 *                   type: string
 *                   description: The user's last name.
 *                   example: "Doe"
 *                 email:
 *                   type: string
 *                   description: The user's registered email address.
 *                   example: "john.doe@example.com"
 *                 delivery_address:
 *                   type: string
 *                   description: The user's preferred delivery address.
 *                   example: "123 Elm Street"
 *       404:
 *         description: |
 *           **Not Found** - The requested user ID does not exist in the database.  
 *           Possible causes:
 *           - The user was deleted.
 *           - The provided ID was incorrect or mistyped.
 *         content:
 *           application/json:
 *             example:
 *               error: "User ID does not exist"
 *       500:
 *         description: |
 *           **Internal Server Error** - This occurs if:
 *           - The database query fails.
 *           - There’s an unexpected error in the backend logic.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error while fetching user"
 */

router.get('/:id', controller.getUser);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update an existing user
 *     description: |
 *       This endpoint allows updating user details by providing one or more fields.  
 *       - **Only the fields included in the request body will be updated** — unspecified fields remain unchanged.  
 *       - If a new password is provided, it will be securely hashed before being stored.  
 *       - The endpoint verifies the existence of the user before proceeding.  
 *
 *       ### Workflow
 *       1. The provided `id` is verified to ensure the user exists.
 *       2. The request body is checked for valid fields (e.g., `first_name`, `email`, etc.).
 *       3. If a `password` is provided, it undergoes secure hashing before saving.
 *       4. Successful updates return the modified user details.
 *
 *       ### Use Cases
 *       - **Profile Management:** Allow users to update their profile details.
 *       - **Admin Control:** Enable administrators to manage user data securely.
 *       - **Password Reset Support:** Update passwords with encryption.
 *       
 *     operationId: updateUser
 *     tags:
 *       - User Queries
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: |
 *           Unique identifier for the user to update.  
 *           Example: `5` for updating user "Ben Wheatley".
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
 *               first_name:
 *                 type: string
 *                 description: The user's updated first name.
 *                 example: "Ben"
 *               last_name:
 *                 type: string
 *                 description: The user's updated last name.
 *                 example: "Wheatley"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's updated email address.
 *                 example: "benjy@yahoo.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: |
 *                   The user's new password.  
 *                   This will be **securely hashed** before being stored.
 *                 example: "Test123"
 *               delivery_address:
 *                 type: string
 *                 description: The user's updated delivery address.
 *                 example: "123 new street"
 *     responses:
 *       200:
 *         description: |
 *           **Success** - The user was successfully updated, and the modified details are returned.  
 *           Only the updated fields are changed; others remain the same.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating successful update.
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     first_name:
 *                       type: string
 *                       example: "Ben"
 *                     last_name:
 *                       type: string
 *                       example: "Wheatley"
 *                     email:
 *                       type: string
 *                       example: "benjy@yahoo.com"
 *                     delivery_address:
 *                       type: string
 *                       example: "123 new street"
 *       400:
 *         description: |
 *           **Bad Request** - No valid fields were provided for updating the user.  
 *           The request body must include at least one valid field.
 *         content:
 *           application/json:
 *             example:
 *               error: "No fields provided for update"
 *       404:
 *         description: |
 *           **Not Found** - The requested user ID does not exist in the database.  
 *           Possible causes include:
 *           - The user was deleted.
 *           - The provided `id` is incorrect.
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 *       500:
 *         description: |
 *           **Internal Server Error** - This occurs if:
 *           - A database error occurs.
 *           - An unexpected issue occurs during the update process.
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error"
 */

router.put('/:id', controller.updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: |
 *       This endpoint allows you to delete a user from the database using their unique ID. 
 *       If the specified ID does not exist, a `404 Not Found` error is returned. 
 *       
 *       **Key Notes:**
 *       - The deletion process is permanent and cannot be undone.
 *       - Any associated data such as orders, cart items, or history may also be removed depending on database constraints.
 *     operationId: deleteUser
 *     tags:
 *       - User Queries
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: |
 *           The unique identifier of the user you wish to delete. 
 *           This value must be an integer and should correspond to an existing user in the database.
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User removed successfully"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User does not exist"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error"
 */
router.delete('/:id', controller.deleteUser);





module.exports = router;

