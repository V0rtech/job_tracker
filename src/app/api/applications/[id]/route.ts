import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_STATUSES = [
  "NO_RESPONSE",
  "FIRST_INTERVIEW",
  "SECOND_INTERVIEW",
  "FINAL_INTERVIEW",
  "OFFER",
  "REJECTED",
  "ACCEPTED",
] as const;

const VALID_EMPLOYMENT_TYPES = ["REMOTE", "HYBRID", "ONSITE"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id, 10);

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    // Validate status if provided
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Normalize employment type
    let employmentType = undefined;
    if (body.employmentType !== undefined) {
      if (body.employmentType === "" || body.employmentType === null) {
        employmentType = null;
      } else if (VALID_EMPLOYMENT_TYPES.includes(body.employmentType)) {
        employmentType = body.employmentType;
      }
    }

    // Handle date
    let dateApplied = undefined;
    if (body.dateApplied !== undefined) {
      if (body.dateApplied === "" || body.dateApplied === null) {
        dateApplied = null;
      } else {
        const d = new Date(body.dateApplied);
        if (!isNaN(d.getTime())) {
          dateApplied = d;
        }
      }
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        ...(body.jobTitle && { jobTitle: body.jobTitle }),
        ...(body.companyName && { companyName: body.companyName }),
        ...(body.location !== undefined && { location: body.location || null }),
        ...(employmentType !== undefined && { employmentType }),
        ...(body.salary !== undefined && { salary: body.salary || null }),
        ...(dateApplied !== undefined && { dateApplied }),
        ...(body.source !== undefined && { source: body.source || null }),
        ...(body.applicationMethod !== undefined && { applicationMethod: body.applicationMethod || null }),
        ...(body.requirementsShortlist !== undefined && { requirementsShortlist: body.requirementsShortlist || null }),
        ...(body.urlToJobPosting !== undefined && { urlToJobPosting: body.urlToJobPosting || null }),
        ...(body.includedCoverLetter !== undefined && { includedCoverLetter: body.includedCoverLetter }),
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id, 10);

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.application.delete({
      where: { id: applicationId },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
