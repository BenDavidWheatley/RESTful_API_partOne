
const checkUserExists = `SELECT * FROM users WHERE email = $1;`;

const registerUser = `
    INSERT INTO users (first_name, last_name, email, password, delivery_address) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id, first_name, last_name, email, created_at;
`;

module.exports = {
    checkUserExists,
    registerUser,
};
