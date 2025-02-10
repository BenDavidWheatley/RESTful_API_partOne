const pool = require('../../../db.js')
const queries = require('../queries/userQueries.js');

const getUsers = (req, res) => {
    pool.query(queries.selectAllUsers, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(200).json(results.rows);
    });
}

module.exports = ({
    getUsers,
});