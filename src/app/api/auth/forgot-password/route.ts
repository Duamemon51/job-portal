import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { createResetToken } from "@/lib/auth-core";
import { User } from "@/lib/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ message: "Ange en e-postadress." }, { status: 400 });
    }

    await connectDatabase();
    const user = await User.findOne({ where: { email } });

    // There's no email transport wired up in this project yet, so the reset link is
    // handed back directly instead of being sent — a stand-in for a real mail step.
    // Only returned when the account exists; a generic message otherwise so the
    // response doesn't flatly confirm or deny an email is registered either way.
    let resetUrl: string | null = null;
    if (user) {
      const { token, tokenHash, expiresAt } = createResetToken();
      await user.update({ resetTokenHash: tokenHash, resetTokenExpiresAt: expiresAt });
      resetUrl = new URL(`/aterstall-losenord?token=${token}`, request.url).toString();
    }

    return NextResponse.json({
      message: "Om det finns ett konto med den e-postadressen kan du återställa lösenordet via länken nedan.",
      resetUrl,
    });
  } catch (error) {
    console.error("Forgot-password error:", error);
    return NextResponse.json({ message: "Ett serverfel uppstod." }, { status: 500 });
  }
}
