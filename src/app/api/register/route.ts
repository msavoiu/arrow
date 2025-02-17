import bcrypt from "bcryptjs"
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
// import { UNSTABLE_REVALIDATE_RENAME_ERROR } from "next/dist/lib/constants";

dotenv.config();

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json(); // do we need to type the destructured constants?
        const cookieStore = await cookies();

        const userCheck = await prisma.user.findUnique({
            where: {
                username: username
            },
            select: {
                username: true
            }
        });

        if (userCheck) { // If the username is already in use, it won't return a null object?
            return NextResponse.json(
                {
                    ok: false,
                    message: "Username is already in use. Please choose a different one."
                },
                { status: 409 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: passwordHash
            }
        });

        const token = jwt.sign({ user_id: newUser.id }, process.env.JWT_SECRET, { expiresIn: 1800 });
        
        // Set cookies in response
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.ENV === "production",
            maxAge: 1800000
        });

        return NextResponse.json(
            { 
                ok: true,
                message: "Registration successful.",
                redirect: "/onboarding"
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error processing request:", error)
        return NextResponse.json({ error: "Bad request" }, { status: 500 });
    }
}
