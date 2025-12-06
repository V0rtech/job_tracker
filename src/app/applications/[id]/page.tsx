import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ApplicationDetailView from "@/components/ApplicationDetailView";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const applicationId = parseInt(id, 10);

  if (isNaN(applicationId)) {
    notFound();
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    notFound();
  }

  return <ApplicationDetailView application={application} />;
}
