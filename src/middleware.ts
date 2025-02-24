import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

interface userJwtPayload extends jose.JWTPayload {
  userId: number;
}

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.has("auth_token") ? cookieStore.get("auth_token") : null;

  console.log(token);

  if (!token) {
    return NextResponse.json(
      { ok: false, message: "Access Denied: No token provided" },
      { status: 401 }
    );
  }

  try {
    console.log(process.env.JWT_SECRET);

    // Convert the secret string to a Uint8Array
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

    // Create a SecretKey object
    const key = await jose.importJWK(
        { kty: "oct", k: Buffer.from(secret).toString("base64") },
        "HS256"
    );

    // Verify the JWT
    const { payload } = await jose.jwtVerify(token.value, key);

    // Type assertion to your custom payload
    const decodedPayload = payload as userJwtPayload;

    request.headers.set("user_id", String(decodedPayload.userId));

    return NextResponse.next();

  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { ok: false, message: "Forbidden: invalid token" },
      { status: 403 }
    );
  }
}

export const config = {
  matcher: ["/profile/:path*"],
};
