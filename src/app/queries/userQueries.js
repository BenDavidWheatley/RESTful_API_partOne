/* Select all the users */
const selectAllUsers = `
    SELECT * 
    FROM users`;

/* Get single user */
const getUser = `
    SELECT * 
    FROM users 
    WHERE id=$1`;

/* Check if user email exists */
const checkEmailExists = `
    SELECT * 
    FROM users 
    WHERE email=$1`;

/* Add user to the database */
const addUser = `
    INSERT INTO users (first_name, last_name, email, password, delivery_address) 
    VALUES ($1, $2, $3, $4, $5)`;

/* Delete user */
const deleteUser = `
    DELETE FROM users 
    WHERE id=$1`;

const updateUser = (updates, values) => {
    return `
        UPDATE users 
        SET ${updates.join(', ')}, updated_at = NOW() 
        WHERE id = $${values.length} 
        RETURNING *`;
};

module.exports = {
    selectAllUsers,
    getUser,
    checkEmailExists,
    addUser,
    deleteUser,
    updateUser,
};