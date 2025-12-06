import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_EMPLOYMENT_TYPES = ["REMOTE", "HYBRID", "ONSITE"] as const;

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const employmentType =
      body.employmentType && VALID_EMPLOYMENT_TYPES.includes(body.employmentType)
        ? body.employmentType
        : null;

    let dateApplied = null;
    if (body.dateApplied) {
      const d = new Date(body.dateApplied);
      if (!isNaN(d.getTime())) {
        dateApplied = d;
      }
    }

    const app = await prisma.application.create({
      data: {
        jobTitle: body.jobTitle,
        companyName: body.companyName,
        location: body.location || null,
        employmentType,
        salary: body.salary || null,
        dateApplied,
        source: body.source || null,
        applicationMethod: body.applicationMethod || null,
        requirementsShortlist: body.requirementsShortlist || null,
        urlToJobPosting: body.urlToJobPosting || null,
        includedCoverLetter: body.includedCoverLetter || false,
        autoExtracted: false,
        importSourceType: "MANUAL",
      },
    });

    return NextResponse.json(app, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
