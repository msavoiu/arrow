import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// takes middleware by default?
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, bio }: {userId: number, bio: string } = body;

        // https://www.prisma.io/docs/orm/reference/prisma-client-reference#update
        const updateBio = await prisma.profile.update({
            where: {
                id: userId
            },
            data: {
                bio: bio
            }
        });

        if (!updateBio) { // empty objects are truthy, so this check may not work
            return NextResponse.json(
                {
                    ok: false,
                    message: "Could not update bio"
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                ok: true,
                message: "Bio updated",
                redirect: "/profile"
            },
        );

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Bad request" }, { status: 500 });
    }
}
