import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

// checkJWT() middleware runs on this route
export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get("user_id"); // should be set by the middleware

        const userProfile = await prisma.profile.findUnique({
            where: {
                userId: userId // type is string in prisma schema but number as the RHS variable
            },
            select: {
                // need to do a join query, this may not be the right syntax
            }
        });

    } catch (error) {
        console.error("Error processing request:", error)
        return NextResponse.json({ error: "Bad request" }, { status: 500 });
    }
}