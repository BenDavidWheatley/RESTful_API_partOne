const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'restfulapi',
    password: 'Nameless1985',
    port: 5433
})

module.exports = pool;