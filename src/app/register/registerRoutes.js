const { Router } = require('express');
const router = Router();
const registerController = require('./registerController.js');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registers a new user
 *     description: |
 *       This endpoint allows new users to create an account by providing essential details such as name, email, password, and delivery address.  
 *       
 *       ### Workflow
 *       - The system verifies that all required fields are provided.
 *       - The email is checked for uniqueness to prevent duplicate accounts.
 *       - On success, a new user record is created in the database, and a success message is returned.
 *       - If registration fails, appropriate error messages are displayed for guidance.
 *
 *       ### Important Notes
 *       - Ensure **password encryption** for security.
 *       - Consider implementing **email confirmation** to verify valid registrations.
 *       - Recommended password policy: minimum 8 characters with uppercase, lowercase, and special characters.
 *
 *     operationId: post_register
 *     tags:
 *       - Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - delivery_address
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The user's **first name**.
 *                 example: "Ben"
 *               last_name:
 *                 type: string
 *                 description: The user's **last name**.
 *                 example: "Wheatley"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: |
 *                   The user's **email address** — must be unique.
 *                   This email will be used for login and communication.
 *                 example: "benjy@yahoo.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: |
 *                   The user's **password** — should follow security best practices.
 *                   Consider implementing password strength validation.
 *                 example: "Test123"
 *               delivery_address:
 *                 type: string
 *                 description: The user's **delivery address** for shipping purposes.
 *                 example: "123 New Street"
 *     responses:
 *       201:
 *         description: |
 *           **User Registered Successfully**  
 *           The user's account has been created successfully, and a success message is returned.
 *         content:
 *           application/json:
 *             example:
 *               message: "User created successfully"
 *               user:
 *                 id: 1
 *                 first_name: "Ben"
 *                 last_name: "Wheatley"
 *                 email: "benjy@yahoo.com"
 *                 created_at: "2025-03-18T10:00:00Z"
 *       400:
 *         description: |
 *           **Bad Request** - This occurs when:
 *           - One or more required fields are missing.
 *           - Invalid data types are provided (e.g., incorrect email format).
 *         content:
 *           application/json:
 *             example:
 *               error: "All fields are required"
 *       409:
 *         description: |
 *           **Conflict** - The provided email already exists in the system.
 *           Users should try logging in or use a different email address.
 *         content:
 *           application/json:
 *             example:
 *               error: "User email already exists"
 *       500:
 *         description: |
 *           **Internal Server Error** - Triggered if:
 *           - There’s a database error during user creation.
 *           - Unexpected issues occur in backend processing.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

router.post('/', registerController.registerUser);


module.exports = router;
