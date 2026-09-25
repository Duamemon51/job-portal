import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { User } from "@/lib/models/user";

export const runtime = "nodejs";

const LOCATION_MODES = new Set(["ort", "distans", "avstand"]);

/** This MariaDB server stores DataTypes.JSON columns as longtext, and Sequelize
 * doesn't always deserialize them back into arrays on read — normalize defensively. */
function jsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

function serialize(user: User) {
  return {
    categories: jsonArray(user.jobAreas),
    cities: jsonArray(user.preferredLocations),
    employment: jsonArray(user.jobTypes),
    experience: jsonArray(user.experienceLevels),
    mode: user.locationMode,
    radius: user.radiusMil,
    nationwide: user.nationwide,
  };
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Inte inloggad." }, { status: 401 });
  }

  try {
    await connectDatabase();
    const user = await User.findByPk(session.userId);
    if (!user) {
      return NextResponse.json({ message: "Inte inloggad." }, { status: 401 });
    }
    return NextResponse.json(serialize(user));
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json({ message: "Ett serverfel uppstod." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Inte inloggad." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const categories = stringArray(body.categories);
    const cities = stringArray(body.cities);
    const employment = stringArray(body.employment);
    const experience = stringArray(body.experience);
    const mode = LOCATION_MODES.has(body.mode) ? body.mode : "ort";
    const radius = Number.isFinite(body.radius) ? Number(body.radius) : null;
    const nationwide = Boolean(body.nationwide);

    await connectDatabase();
    const user = await User.findByPk(session.userId);
    if (!user) {
      return NextResponse.json({ message: "Inte inloggad." }, { status: 401 });
    }

    user.jobAreas = categories.length ? categories : null;
    user.preferredLocations = cities.length ? cities : null;
    user.jobTypes = employment.length ? employment : null;
    user.experienceLevels = experience.length ? experience : null;
    user.locationMode = mode;
    user.radiusMil = radius;
    user.nationwide = nationwide;
    await user.save();

    return NextResponse.json(serialize(user));
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json({ message: "Ett serverfel uppstod." }, { status: 500 });
  }
}
