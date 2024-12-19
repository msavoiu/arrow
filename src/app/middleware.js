import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function jwtVerify(request) {
    try {
        const token = request.cookies.get("token");

        if (!token) {
            return NextResponse.redirect('/auth/login');
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET); // returns decoded payload, in this case, it contains "user_id" (see jwtGenerator.js)

        if (!payload) {
            return NextResponse.redirect('/auth/login');
        }

        return NextResponse.json(
            { valid: true, payload },
            { status: 200 }
        );

    } catch (err) {
        console.error(err.message)
        return NextResponse.redirect('/auth/login');
    }
}
