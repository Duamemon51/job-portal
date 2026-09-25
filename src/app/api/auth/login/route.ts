import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { User } from "@/lib/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ message: "E-post och lösenord krävs." }, { status: 400 });
    }

    await connectDatabase();
    const user = await User.findOne({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ message: "Fel e-postadress eller lösenord." }, { status: 401 });
    }

    await setSessionCookie(user.id, user.role);
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        phone: user.phone,
        city: user.city,
        jobTypes: user.jobTypes,
        jobAreas: user.jobAreas,
        preferredLocations: user.preferredLocations,
        emailProvider: user.emailProvider,
        autoApply: user.autoApply,
        notifyNewJobs: user.notifyNewJobs,
        weeklyReport: user.weeklyReport,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Ett serverfel uppstod." }, { status: 500 });
  }
}