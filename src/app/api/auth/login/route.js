import { NextResponse } from 'next/server';
import { pool } from '@/app/db.js';
import { generateJWT } from '@/app/jwtGenerator.js';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        // 1. destructure request body
        const { username, password } = await request.json(); // await the request.json() call
        
        // 2. check if user exists
        const user = await pool.query(
            "SELECT * FROM users WHERE users.username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            return NextResponse.json(
                { message: "Username and/or password is incorrect." },
                { status: 401 }
            );
        }

        // 3. check if the passwords match
        const loginQuery = `
        SELECT users.id, user_auth.password_hash
        FROM users JOIN user_auth ON users.id = user_auth.user_id
        WHERE users.username = $1;`; // retrieving data from both tables that match the ID

        const login = await pool.query(loginQuery, [username]);

        if (login.rows.length === 0) {
            return NextResponse.json(
                { message: "Username and/or password is incorrect." },
                { status: 401 }
            );
        }

        const loginAttempt = login.rows[0];
        const isMatching = await bcrypt.compare(password, loginAttempt.password_hash);

        if (isMatching) {
            const successfulLoginQuery = `
            UPDATE user_auth
            SET last_login = NOW()
            WHERE user_id = $1;`;

            await pool.query(successfulLoginQuery, [loginAttempt.id]);

            // 4. give user the jwt
            const token = generateJWT(loginAttempt.id);

            // 5. store the jwt server-side for the user session
            const response = NextResponse.redirect('/dashboard', 302);

            // 5. store the jwt for the user session
            response.cookies.set('token', token, { httpOnly: true, secure: true });

            return response;

        } else {
            const unsuccessfulLoginQuery = `
            UPDATE user_auth SET failed_attempts = failed_attempts + 1
            WHERE user_id = $1;`;

            await pool.query(unsuccessfulLoginQuery, [loginAttempt.id]);
            
            return NextResponse.json(
                { message: "Username and/or password is incorrect." },
                { status: 401 }
            );
        }

    } catch (err) {
        console.error(err.message);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
