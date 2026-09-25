import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ available: false, message: "Ange en giltig e-postadress." }, { status: 400 });
    }

    await connectDatabase();
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ available: false, message: "Det finns redan ett konto med den e-postadressen." }, { status: 409 });
    }

    return NextResponse.json({ available: true, message: "E-posten är ledig." }, { status: 200 });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json({ available: false, message: "Ett serverfel uppstod." }, { status: 500 });
  }
}
