import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
 
// This function can be marked `async` if using `await` inside
export async function checkJWT(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.has("auth_token") ? cookieStore.get("auth_token") : null;

    if (!token) {
        return NextResponse.json(
            {   ok: false,
                message: "Access Denied: No token provided"
            },
            { status: 401 }
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.headers.set("user_id", decoded.user_id);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                message: "Forbidden: invalid token"
            },
            { status: 403 }
        );
    }
}

export const config = {
    matcher: ["/profile/:path*"]
}
