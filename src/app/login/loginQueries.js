const getUserByEmail = `
    SELECT *
    FROM users 
    WHERE email = $1;`;

module.exports = {
    getUserByEmail,
};