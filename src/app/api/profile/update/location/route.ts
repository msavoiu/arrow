import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, address, lat, lng }: { userId: number, address: string, lat: number, lng: number } = body;

        if (!address || lat === undefined || lng === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Save the location in the database
        const location = await prisma.location.create({
            data: {
                address: address,
                lat: lat,
                lng: lng,
                userId: userId // foreign key
            },
        });

        return NextResponse.json(
            {
                ok: true,
                message: "Location updated",
                location
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error saving location:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
