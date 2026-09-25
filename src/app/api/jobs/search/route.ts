import { NextRequest, NextResponse } from "next/server";
import { searchJobtechJobs } from "@/lib/jobtech";

function splitParam(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const offset = Number(sp.get("offset") ?? "0");
  const limit = Number(sp.get("limit") ?? "8");

  try {
    const result = await searchJobtechJobs({
      q: sp.get("q") ?? undefined,
      categories: splitParam(sp.get("categories")),
      cities: splitParam(sp.get("cities")),
      employment: splitParam(sp.get("employment")),
      setups: splitParam(sp.get("setups")),
      published: sp.get("published") ?? "any",
      sort: sp.get("sort") ?? "senaste",
      offset: Number.isFinite(offset) ? offset : 0,
      limit: Number.isFinite(limit) ? Math.min(limit, 100) : 8,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/jobs/search]", error);
    return NextResponse.json({ error: "Kunde inte hämta lediga tjänster just nu." }, { status: 502 });
  }
}
