import bcrypt from "bcryptjs"
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

dotenv.config();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password } = body;
        const cookieStore = await cookies();

        const userCheck = await prisma.user.findUnique({
            where: {
                username: username
            },
            select: {
                username: true
            }
        });

        if (userCheck) { // (is not null)
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
