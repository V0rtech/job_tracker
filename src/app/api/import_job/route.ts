import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || body.type !== "url" || !body.url) {
    return NextResponse.json(
      { error: "Only URL import supported in this stub" },
      { status: 400 }
    );
  }

  // TODO: fetch URL, extract text, call LLM, parse JSON.
  // For now, return fake values so you can see the UX.
  const fake = {
    jobTitle: "Software Engineer",
    companyName: "Example Corp",
    location: "Remote",
    employmentType: "REMOTE",
    salary: "€60–80k",
    requirementsShortlist:
      "- 3+ years of experience\n- JavaScript/TypeScript\n- React or similar framework",
    urlToJobPosting: body.url,
  };

  return NextResponse.json(fake, { status: 200 });
}
