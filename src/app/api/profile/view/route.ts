import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// takes middleware by default?
export async function POST(request: NextRequest) {
    try {
        const userId = Number(request.headers.get("user_id"));

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                username: true
            }
        });

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
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        if (!userProfile) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Profile not found"
                },
                { status: 404 }
            );
        }

        const tags = userProfile.tags.map(tagOnProfile => tagOnProfile.tag.tagName); // Extracting just the tag names

        return NextResponse.json(
            {
                ok: true,
                message: "Profile data retrieved",
                data: {
                    username: user.username,
                    display_name: userProfile.displayName,
                    bio: userProfile.bio,
                    tags: tags
                },
            },
        );

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Bad request" }, { status: 500 });
    }
}
