import { prisma } from "@/infrastructure";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { createSession } from "@/shared/lib/session";
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({
        message: "email e senha são obrigatórios",
      });

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json({
        message: "Signin failed",
      });
    }
    const verifyPassword = await argon2.verify(user.password, password);
    if (!verifyPassword) {
      return NextResponse.json({
        message: "Usuario ou Senha incorreta ",
        status: 400,
      });
    }
    await createSession(user.email);
    return NextResponse.json(
      {
        message: "Signin successful",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Signin failed",
    });
  }
}
