import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function jwtVerify(request) {
    try {
        const token = request.headers.get("token");

        if (!token) {
            return NextResponse.json(
                { valid: false, message: "Unauthorized" },
                { status: 403 }
            );
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET); // returns an authorization payload that can be used within routes

        if (!payload) {
            return NextResponse.json(
                { valid: false, message: "Unauthorized" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { valid: true, payload },
            { status: 200 }
        );

    } catch (err) {
        console.error(err.message)
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 403 }
        );  
    }
}
