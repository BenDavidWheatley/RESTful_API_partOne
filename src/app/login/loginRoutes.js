const { Router } = require('express');
const router = Router();
const loginController = require('./loginController.js');
const passport = require('../../../passportConfig.js');

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User Login
 *     description: |
 *       This endpoint allows users to log in by providing their **email** and **password**.
 *       
 *       ### Workflow
 *       - The user submits their email and password in the request body.
 *       - If the credentials are valid:
 *         - A **JWT token** is generated for secure session management.
 *         - User details are included in the response for reference.
 *       - If the credentials are incorrect or the user does not exist, an error response is returned.
 *       
 *       ### Security Details
 *       - The JWT token should be included in the `Authorization` header (using `Bearer <token>`) for subsequent authenticated requests.
 *       - The token typically expires after a set duration for security purposes.
 *       
 *       ### Example Request Body:
 *       ```json
 *       {
 *         "email": "user@example.com",
 *         "password": "password123"
 *       }
 *       ```
 *
 *     operationId: UserLogin
 *     tags:
 *       - User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: |
 *                   The **registered email address** of the user attempting to log in.
 *                   The email format should follow the standard `example@domain.com` pattern.
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: |
 *                   The **password** associated with the user's account.
 *                   Ensure the password is securely hashed in your database.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating successful login.
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: |
 *                     A **JWT token** issued for session management. 
 *                     This token must be included in the `Authorization` header for authenticated requests.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   description: Details of the authenticated user.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The **unique identifier** of the user.
 *                       example: 1
 *                     first_name:
 *                       type: string
 *                       description: The **first name** of the user.
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       description: The **last name** of the user.
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       description: The **email address** of the user.
 *                       example: "user@example.com"
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               error: "incorrect credentials"
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: |
 *                     An error message indicating that the provided credentials are incorrect 
 *                     or the user does not exist.
 *                   example: "incorrect credentials"
 *       500:
 *         description: Internal server error during authentication
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error during authentication"
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: |
 *                     An error message indicating that the server encountered an issue
 *                     while processing the login request.
 *                   example: "Internal server error during authentication"
 */

router.post('/', loginController.loginUser);

module.exports = router;
