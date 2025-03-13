import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// takes middleware by default?
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const userId: number = body.userId;

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

        const tags = userProfile.tags.map(tagOnProfile => {
            tagOnProfile.tag.tagName
        }); // Extracting just the tag names

        return NextResponse.json(
            {
                ok: true,
                message: "Profile data retrieved",
                data: {
                    username: user.username,
                    displayName: userProfile.displayName,
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
