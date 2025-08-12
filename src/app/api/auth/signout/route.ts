import { deleteSession } from "@/shared/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json(
      {
        message: "Logout successful",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao fazer logout:", error);

    return NextResponse.json(
      {
        message: "Logout failed",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
