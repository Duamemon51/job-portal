import { NextResponse } from "next/server";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { connectDatabase } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { JobApplication } from "@/lib/models/job-application";

export const runtime = "nodejs";

function serialize(app: JobApplication) {
  return {
    id: String(app.id),
    jobId: app.jobId,
    title: app.title,
    company: app.company,
    city: app.city,
    category: app.category,
    webpageUrl: app.webpageUrl,
    logoUrl: app.logoUrl,
    status: app.status,
    appliedAt: app.appliedAt.toISOString(),
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Inte inloggad." }, { status: 401 });
  }

  try {
    await connectDatabase();
    const applications = await JobApplication.findAll({
      where: { userId: session.userId },
      order: [["appliedAt", "DESC"]],
    });
    return NextResponse.json({ applications: applications.map(serialize) });
  } catch (error) {
    console.error("List applications error:", error);
    return NextResponse.json({ message: "Ett serverfel uppstod." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Inte inloggad." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const jobId = typeof body.jobId === "string" ? body.jobId.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : null;
    const category = typeof body.category === "string" ? body.category.trim() : null;
    const webpageUrl = typeof body.webpageUrl === "string" ? body.webpageUrl.trim() : null;
    const logoUrl = typeof body.logoUrl === "string" ? body.logoUrl.trim() : null;

    if (!jobId || !title || !company) {
      return NextResponse.json({ message: "jobId, title och company krävs." }, { status: 400 });
    }

    await connectDatabase();

    const existing = await JobApplication.findOne({ where: { userId: session.userId, jobId } });
    if (existing) {
      return NextResponse.json({ application: serialize(existing) }, { status: 200 });
    }

    const application = await JobApplication.create({
      userId: session.userId,
      jobId,
      title,
      company,
      city,
      category,
      webpageUrl,
      logoUrl,
    });

    return NextResponse.json({ application: serialize(application) }, { status: 201 });
  } catch (error) {
    if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
      return NextResponse.json({ message: "Ogiltig ansökan." }, { status: 400 });
    }
    console.error("Create application error:", error);
    return NextResponse.json({ message: "Ett serverfel uppstod." }, { status: 500 });
  }
}
