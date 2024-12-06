const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");

const app = express();

// MIDDLEWARE
app.use(cors({
    origin: "http://localhost:9000"
}));
app.use(express.json()); // req.body

// ROUTES

// JWT route
app.use("/auth", require("./aroace-app/routes/jwtAuth"));

// // create a user
// app.post("/register", async(req, res) => {
//     try {
//         const {username, email, password} = req.body; // destructuring assignment

//         const usernameCheck = await pool.query(
//             "SELECT * FROM users WHERE users.username = $1;",
//             [username]
//         );

//         const emailCheck = await pool.query(
//             "SELECT * FROM users WHERE users.email = $1;",
//             [email]
//         );

//         if (usernameCheck.rows.length > 0) {
//             console.log("username already exists. please try a different one.");
//             return;
//         } else if (emailCheck.rows.length > 0) {
//             console.log("email is already in use. please use a different one.");
//             return;
//         }

//         const newUser = await pool.query(        
//             "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;", // the dollar signs refer to the array
//             [username, email]);

//         // inserting the password into the related database
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const userID = newUser.rows[0].id; // get the user ID created with the new user to reuse as foreign key

//         await pool.query(
//             "INSERT INTO user_auth (user_id, password_hash) VALUES ($1, $2) RETURNING *;",
//             [userID, hashedPassword]
//         );

//         res.json(newUser.rows[0]); // convert the data to JSON

//     } catch (err) {
//         console.error(err.message);
//     }
// });

// // get a user_id & password hash pair (for login authentication)
// app.post("/login", async(req, res) => {
//     try {
//         const {username, password} = req.body; // get username and password sent through the request
        
//         console.log(username, password)

//         const loginQuery = `
//         SELECT users.id, user_auth.password_hash
//         FROM users JOIN user_auth ON users.id = user_auth.user_id
//         WHERE users.username = $1;`; // retrieving data from both tables that match the ID

//         const login = await pool.query(loginQuery, [username]);

//         if (login.rows.length === 0) {
//             console.log("invalid username. please try again.");
//             return;
//         }

//         const loginAttempt = login.rows[0];
//         const isMatching = await bcrypt.compare(password, loginAttempt.password_hash);

//         if (isMatching) {
//             const successfulLoginQuery = `
//             UPDATE user_auth
//             SET last_login = NOW()
//             WHERE user_id = $1;`;
//             await pool.query(successfulLoginQuery, [user.id]);
//             console.log("login successful.");

//         } else {
//             const unsuccessfulLoginQuery = `
//             UPDATE user_auth SET failed_attempts = failed_attempts + 1
//             WHERE user_id = $1;`;
//             await pool.query(unsuccessfulLoginQuery, [user.id]);
//             console.log("incorrect password.");
//         }

//         res.json(loginResult.rows[0]);

//     } catch (err) {
//         console.error(err.message);
//     }
// });

app.listen(5000, () => { // callback function syntax
    console.log("server has started on port 5000")
});
