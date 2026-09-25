import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { clearSessionCookie, getSession } from "@/lib/auth";
import { User } from "@/lib/models/user";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Inte inloggad." }, { status: 401 });
  }

  try {
    await connectDatabase();
    const user = await User.findByPk(session.userId);
    if (!user) {
      await clearSessionCookie();
      return NextResponse.json({ message: "Inte inloggad." }, { status: 401 });
    }

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
    console.error("Session lookup error:", error);
    return NextResponse.json({ message: "Ett serverfel uppstod." }, { status: 500 });
  }
}
