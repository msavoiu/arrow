import bcrypt from "bcryptjs"
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

dotenv.config();

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json(); // do we need to type the destructured constants?
        const cookieStore = await cookies();

        const user = await prisma.user.findUnique({
            where: {
                username: username
            },
            select : {
                id: true,
                password: true
            }
        });

        if (!user) { // would userId be null if the user doesn't exist?
            return NextResponse.json(
                {
                    ok: false,
                    message: "Username and/or password is incorrect."
                },
                { status: 401 }
            );
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Username and/or password is incorrect."
                },
                { status: 401 }
            );
        }

        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: 1800 });
        
        // Set cookies in response
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.ENV === "production",
            maxAge: 1800000
        });

        return NextResponse.json(
            { 
                ok: true,
                message: "Login successful.",
                redirect: "/"
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error processing request:", error)
        return NextResponse.json({ error: "Bad request" }, { status: 500 });
    }
}
