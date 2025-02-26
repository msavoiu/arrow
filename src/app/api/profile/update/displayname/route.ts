import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// takes middleware by default?
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, displayName }: {userId: number, displayName: string } = body;

        // https://www.prisma.io/docs/orm/reference/prisma-client-reference#update
        const updateDisplayName = await prisma.profile.update({
            where: {
                id: userId
            },
            data: {
                displayName: displayName
            }
        });

        console.log("updateDisplayName:", updateDisplayName);

        if (!updateDisplayName) { // empty objects are truthy, so this check may not work
            return NextResponse.json(
                {
                    ok: false,
                    message: "Could not update display name"
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                ok: true,
                message: "Profile updated"
            },
        );

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Bad request" }, { status: 500 });
    }
}
