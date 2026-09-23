import { Op } from "sequelize";
import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { hashPassword, hashResetToken } from "@/lib/auth-core";
import { User } from "@/lib/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!token) {
      return NextResponse.json({ message: "Ogiltig eller saknad återställningslänk." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "Lösenordet måste vara minst 8 tecken." }, { status: 400 });
    }

    await connectDatabase();
    const user = await User.findOne({
      where: {
        resetTokenHash: hashResetToken(token),
        resetTokenExpiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Länken är ogiltig eller har gått ut." }, { status: 400 });
    }

    await user.update({
      passwordHash: await hashPassword(password),
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Reset-password error:", error);
    return NextResponse.json({ message: "Ett serverfel uppstod." }, { status: 500 });
  }
}
