import { NextResponse } from "next/server";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { connectDatabase } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { User } from "@/lib/models/user";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const jobTypes = Array.isArray(body.jobTypes) ? body.jobTypes.filter((item): item is string => typeof item === "string") : [];
    const jobAreas = Array.isArray(body.jobAreas) ? body.jobAreas.filter((item): item is string => typeof item === "string") : [];
    const preferredLocations = Array.isArray(body.preferredLocations) ? body.preferredLocations.filter((item): item is string => typeof item === "string") : [];
    const emailProvider = typeof body.emailProvider === "string" ? body.emailProvider : null;
    const autoApply = Boolean(body.autoApply);
    const notifyNewJobs = Boolean(body.notifyNewJobs);
    const weeklyReport = Boolean(body.weeklyReport);

    if (name.length < 2 || name.length > 120) {
      return NextResponse.json({ message: "Namn måste vara mellan 2 och 120 tecken." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: "Ange en giltig e-postadress." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "Lösenordet måste vara minst 8 tecken." }, { status: 400 });
    }

    await connectDatabase();
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Det finns redan ett konto med den e-postadressen." }, { status: 409 });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      role: "user",
      title: title || null,
      phone: phone || null,
      city: city || null,
      jobTypes: jobTypes.length ? jobTypes : null,
      jobAreas: jobAreas.length ? jobAreas : null,
      preferredLocations: preferredLocations.length ? preferredLocations : null,
      emailProvider,
      autoApply,
      notifyNewJobs,
      weeklyReport,
    });
    await setSessionCookie(user.id, user.role);

    return NextResponse.json(
      {
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
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
      return NextResponse.json({ message: "Kunde inte skapa kontot med de uppgifterna." }, { status: 400 });
    }
    console.error("Register error:", error);
    return NextResponse.json({ message: "Ett serverfel uppstod." }, { status: 500 });
  }
}