import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const markers = await prisma.location.findMany({
            select: {
                userId: true,
                address: true,
                lat: true,
                lng: true
            }
        });

        return NextResponse.json(
            {
                ok: true,
                message: "Marker data retrieved",
                data: markers
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Bad request" }, { status: 500 });
    }
}
