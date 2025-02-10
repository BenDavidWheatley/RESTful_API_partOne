const selectAllUsers = "SELECT * FROM users";
const getUser = "SELECT * FROM users WHERE id=$1";
const checkEmailExists = "SELECT * FROM users WHERE email=$1";
const addUser = "INSERT INTO users (first_name, last_name, email, password, delivery_address) VALUES ($1, $2, $3, $4, $5)";
const deleteUser = "DELETE FROM users WHERE id=$1";

const updateUser = (updates, values) => {
    return `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
};

module.exports = {
    selectAllUsers,
    getUser,
    checkEmailExists,
    addUser,
    deleteUser,
    updateUser,
};