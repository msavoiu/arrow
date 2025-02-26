import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { JWTVerifyResult } from "jose";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.has("auth_token") ? cookieStore.get("auth_token") : null;

        console.log("token:", token);

        if (!token) {
            return NextResponse.json(
                { ok: false, message: "Access Denied: No token provided" },
                { status: 401 }
            );
        }

        // Convert the secret string to a Uint8Array
        const key = new TextEncoder().encode(process.env.JWT_SECRET);
        
        // Verify the JWT
        // https://github.com/panva/jose/blob/main/docs/jwt/verify/functions/jwtVerify.md
        const decoded: JWTVerifyResult = await jose.jwtVerify(token.value, key);

        // console.log("decoded:", decoded)

        const userId = decoded.payload.userId; // payload has this property when checking with jwt.io
        console.log("decoded userId:", userId);

        // // SET HEADERS
        // const headers = new Headers(request.headers);
        // headers.set("user_id", userId);

        return NextResponse.json(
            {
                ok: true,
                userId: userId,
                message: "User authenticated"
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json(
            { ok: false, message: "Forbidden: invalid token" },
            { status: 403 }
        );
    }
};
