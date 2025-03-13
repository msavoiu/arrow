import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId }: { userId: number } = body;

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

        const userTagIds: number[] = userProfile.tags.map(tagOnProfile => tagOnProfile.tag.id);


        if (userTagIds.length === 0) {
            return NextResponse.json(
                { ok: false, message: "User has no tags assigned" },
                { status: 404 }
            );
        }

        const matchingProfiles = await prisma.profile.findMany({
            where: {
                tags: {
                    some: {
                        tagId: { in: userTagIds },
                    },
                },
                userId: { not: userId }, // exclude the user
            },
            include: {
                tags: {
                    include: { tag: true },
                },
                user: true,
            },
        });

        return NextResponse.json(
            {
                ok: true,
                data: matchingProfiles
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Bad request" }, { status: 500 });
    }
};
