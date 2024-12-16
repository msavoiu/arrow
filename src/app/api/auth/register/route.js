import { NextResponse } from 'next/server';
import { pool } from '@/app/db.js';
import { generateJWT } from '@/app/jwtGenerator.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const {username, email, password} = await request.json(); // need to await bc request.json() is an async function

        console.log(username);

        const usernameCheck = await pool.query(
            "SELECT * FROM users WHERE users.username = $1;",
            [username]
        );

        const emailCheck = await pool.query(
            "SELECT * FROM users WHERE users.email = $1;",
            [email]
        );

        if (usernameCheck.rows.length > 0) {
            return NextResponse.json(
                { message: "Username is already in use." },
                { status: 401 }
            );
        } else if (emailCheck.rows.length > 0) {
            return NextResponse.json(
                { message: "Email is already in use." },
                { status: 401 }
            );
        }

        const newUser = await pool.query(        
            "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;", // the dollar signs refer to the array
            [username, email]);

        // inserting the password into the related database
        const hashedPassword = await bcrypt.hash(password, 10);

        const userID = newUser.rows[0].id; // get the user ID created with the new user to reuse as foreign key

        await pool.query(
            "INSERT INTO user_auth (user_id, password_hash) VALUES ($1, $2) RETURNING *;",
            [userID, hashedPassword]
        );

        const token = generateJWT(userID); // getting the user_id fomr the data sent to be added to the database

        return NextResponse.json({ token }); // send token in response

    } catch (err) {
        console.error(err.message);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });    }
}