const bcrypt = require('bcrypt'); // For password hashing
const pool = require('../../../db.js')
const queries = require('../user/userQueries.js');

/********** GET ALL USERS  **********/

// http://localhost:3000/api/v1/restfulapi/user

const getAllUsers = (req, res) => {
    pool.query(queries.selectAllUsers, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(200).json(results.rows);
    });
}

/******** GET SINGLE USER  *********/

// http://localhost:3000/api/v1/restfulapi/user/1

const getUser = (req, res) => {
    const id = parseInt(req.params.id) // This id is taken from the params in the URL
    console.log(`requested single user id - ${id}`)
    pool.query(queries.getUser, [id], (error, results) => {
        if (error) throw error;
        
        if (results.rows.length === 0) {
            return res.status(404).send('User ID does not exist');
        }
        res.status(200).json(results.rows);
    })
}

/********* UPDATE USER *********/

/*PUT request 
http://localhost:3000/api/v1/restfulapi/user/5

Body example - 
{
    "first_name": "Ben",
    "last_name": "Wheatley",
    "email" : "benjy@yahoo.com",
    "password" : "Test123",
    "delivery_address" : "123 new street"
} 
*/

const updateUser = async (req, res) => {

    // Get info form requested body and console log a dynamic message based on the data
    const id = parseInt(req.params.id);
    const { first_name, last_name, email, password, delivery_address } = req.body;

    console.log(`The following data has been requested for change - 
        First name - ${first_name || "not requested an update"}
        Last name - ${last_name || "not requested an update"}
        Email - ${email || "not requested an update"}
        Password - ${password ? "Password change requested" : "not requested an update"} 
        Delivery address - ${delivery_address || "not requested an update"}`);
    
    // Empty array variables that will have the information pushed to them should it be provided.

    let updates = [];
    let values = [];

    if (first_name) {
        updates.push('first_name = $' + (values.length + 1));
        values.push(first_name);
    }
    if (last_name) {
        updates.push('last_name = $' + (values.length + 1));
        values.push(last_name);
    }
    if (email) {
        updates.push('email = $' + (values.length + 1));
        values.push(email);
    }

    // Hash the password if provided
    if (password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash with salt rounds = 10
            updates.push('password = $' + (values.length + 1));
            values.push(hashedPassword);
        } catch (error) {
            console.error('Error hashing password:', error);
            return res.status(500).json({ error: "Error hashing password" });
        }
    }

    if (delivery_address) {
        updates.push('delivery_address = $' + (values.length + 1));
        values.push(delivery_address);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: "No fields provided for update" });
    }

    values.push(id);

    // Generate the update query dynamically
    const query = queries.updateUser(updates, values);

    pool.query(query, values, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: results.rows[0] });
    });
};

/******** DELETE USER *********/

/*
DELETE - Provide the id of the user that requires deleting
http://localhost:3000/api/v1/restfulapi/user/5 
*/


const deleteUser = (req, res) => {
    //Get the requested id and log to the console
    const id = parseInt(req.params.id);
    console.log(`User with an id of ${id} has been requested for deletion`);

    pool.query(queries.getUser, [id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (noUserFound){
            res.send("User does not exist");
        }   
        pool.query(queries.deleteUser, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send("user removed successfully");
        })

    })
}

module.exports = ({
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
});