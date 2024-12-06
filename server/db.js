// import Pool class from the pg library
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "incorrect",
    host: "localhost",
    port: 5432,
    database: "aroaceapp"
});

// exports the Pool object, making it available to use in other parts of the app
module.exports = pool;
