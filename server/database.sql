-- STORING INFORMATION ON PREVIOUSLY CREATED TABLES FOR EASY ACCESS

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(320),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_auth (
    user_id INT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- NOT YET CREATED
CREATE TABLE user_info (
    user_id INT PRIMARY KEY,
    display_name VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- QUERIES
SELECT users.id, user_auth.password_hash
FROM users
JOIN user_auth ON users.id = user_auth.user_id -- specifies what two columns from the tables to look for matches between
WHERE users.username = $1;