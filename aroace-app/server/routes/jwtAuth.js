const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/jwtGenerator");

// register
router.post("/register", async (req, res) => {
    try {
        const {username, email, password} = req.body; // destructuring assignment

        const usernameCheck = await pool.query(
            "SELECT * FROM users WHERE users.username = $1;",
            [username]
        );

        const emailCheck = await pool.query(
            "SELECT * FROM users WHERE users.email = $1;",
            [email]
        );

        if (usernameCheck.rows.length > 0) {
            return res.status(401).send("Username is already in use.");
        } else if (emailCheck.rows.length > 0) {
            return res.status(401).send("Email is already in use.");
        }

        const newUser = await pool.query(        
            "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;", // the dollar signs refer to the array
            [username, email]);

        // res.json(newUser.rows[0]);

        // inserting the password into the related database
        const hashedPassword = await bcrypt.hash(password, 10);

        const userID = newUser.rows[0].id; // get the user ID created with the new user to reuse as foreign key

        await pool.query(
            "INSERT INTO user_auth (user_id, password_hash) VALUES ($1, $2) RETURNING *;",
            [userID, hashedPassword]
        );

        const token = generateJWT(userID); // getting the user_id fomr the data sent to be added to the database

        res.json({token}); // convert the data to JSON to send as a response to the client to see what information was sent server-side

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// login route
router.post("/login", async(req, res) => {
    try {
        // 1. destructure request body
        const {username, password} = req.body; // get username and password sent through the request
        
        // 2. check if user exists
        const user = await pool.query(
            "SELECT * FROM users WHERE users.username = $1",
            [username]
        );

        // 3. check if the passwords match
        const loginQuery = `
        SELECT users.id, user_auth.password_hash
        FROM users JOIN user_auth ON users.id = user_auth.user_id
        WHERE users.username = $1;`; // retrieving data from both tables that match the ID

        const login = await pool.query(loginQuery, [username]);

        if (login.rows.length === 0) {
            return res.status(401).send("Username and/or password is incorrect."); // 401 for unauthorized
        }

        const loginAttempt = login.rows[0];
        const isMatching = await bcrypt.compare(password, loginAttempt.password_hash);

        if (isMatching) {
            const successfulLoginQuery = `
            UPDATE user_auth
            SET last_login = NOW()
            WHERE user_id = $1;`;
            await pool.query(successfulLoginQuery, [user.id]);
            console.log("login successful.");

        } else {
            const unsuccessfulLoginQuery = `
            UPDATE user_auth SET failed_attempts = failed_attempts + 1
            WHERE user_id = $1;`;
            await pool.query(unsuccessfulLoginQuery, [user.id]);
            return res.status(401).send("Username and/or password is incorrect.");
        }

        // 4. give user the jwt - same as for the register route
        const token = generateJWT(user.id);
        res.json({token});

    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
