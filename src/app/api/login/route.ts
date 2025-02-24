import bcrypt from "bcryptjs";
import * as jose from "jose";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    const cookieStore = await cookies();

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        password: true,
      },
    });

    console.log(user!.id);

    if (user === null) {
      return NextResponse.json(
        {
          ok: false,
          message: "Username and/or password is incorrect.",
        },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        {
          ok: false,
          message: "Username and/or password is incorrect.",
        },
        { status: 401 }
      );
    }

    console.log(process.env.JWT_SECRET);

    // Generate JWT using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const key = await jose.importJWK(
      { kty: "oct", k: Buffer.from(secret).toString("base64") },
      "HS256"
    );

    const token = await new jose.SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1800s") // 30 minutes
      .sign(key);

    console.log(token);

    // Set cookies in response
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.ENV === "production",
      maxAge: 1800,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Login successful.",
        redirect: "/",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Bad request" }, { status: 500 });
  }
};
