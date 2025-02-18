import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { Prisma } from "@prisma/client";
// https://www.reddit.com/r/node/comments/14sfdzx/how_to_convert_prisma_schema_to_typescript_types/

// checkJWT() middleware runs on this route
export async function POST(request: NextRequest) {
    try {
        const userId = Number(request.headers.get("user_id")); // should be set by the middleware

        const user: Prisma.UserSelect = await prisma.user.findUnique({
            where: {
                id: userId // type is string in prisma schema but number as the RHS variable
            },
            select: {
                username: true // need to do a join query, this may not be the right syntax
            }
        });

        // Check if, for some reason, the user's profile could not be found
        if (!user) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Profile not found"
                },
                { status: 404 }
            );
        }

        const userProfile = await prisma.profile.findUnique({
            where: {
                userId: userId
            },
            select: {
                displayName: true,
                bio: true
            }
        });

        // CHECK THIS
        // https://www.prisma.io/docs/orm/more/help-and-troubleshooting/working-with-many-to-many-relations
        const userTags = await prisma.profile.findMany({
            where: {
                userId: userId
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });
        
        return NextResponse.json(
            {
                ok: true,
                message: "Profile data retrieved",
                data: {
                    username: user.username,
                    display_name: userProfile?.displayName, // can I do some typescript typing to fix the null issue?
                    bio: userProfile?.bio,
                    tags: userTags // How do I specify JUST the array of tags?
                }
            },
        );

    } catch (error) {
        console.error("Error processing request:", error)
        return NextResponse.json({ error: "Bad request" }, { status: 500 });
    }
}
