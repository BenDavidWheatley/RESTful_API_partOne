const pool = require('../../../db.js')
const queries = require('../queries/userQueries.js');

/********** GET ALL USERS  **********/

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

const getUser = (req, res) => {
    const id = parseInt(req.params.id) // This id is taken from the params in the URL
    pool.query(queries.getUser, [id], (error, results) => {
        if (error) throw error;
        
        if (results.rows.length === 0) {
            return res.status(404).send('User ID does not exist');
        }
        res.status(200).json(results.rows);
    })
}
/********* ADD USER *********/

/*
const addUser = (req, res) => {
    const { first_name, last_name, email, password, delivery_address } = req.body;

    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if (results.rows.length) {
            res.send("Email already exists"); 
        };
        pool.query(queries.addUser, [first_name, last_name, email, password, delivery_address], (error, results) => {
            if (error) throw error;
            res.status(201).send("user created successfully");
        })
    })
}*/

/********* UPDATE USER *********/

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { first_name, last_name, email, password, delivery_address } = req.body;

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
    if (password) {
        updates.push('password = $' + (values.length + 1));
        values.push(password);
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

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

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
   // addUser,
    deleteUser
});