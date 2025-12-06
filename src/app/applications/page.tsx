import { prisma } from "@/lib/db";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import DeleteApplicationButton from "@/components/DeleteApplicationButton";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import TypeFilter from "@/components/TypeFilter";
import ApplicationStats from "@/components/ApplicationStats";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 30;

const STATUS_LABELS: Record<string, string> = {
  NO_RESPONSE: "No response",
  FIRST_INTERVIEW: "First interview",
  SECOND_INTERVIEW: "Second interview",
  FINAL_INTERVIEW: "Final interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

const TYPE_LABELS: Record<string, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
};

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

function typeLabel(type: string | null) {
  if (!type) return "-";
  return TYPE_LABELS[type] ?? type;
}

interface ApplicationRow {
  id: number;
  jobTitle: string;
  companyName: string;
  location: string | null;
  employmentType: string | null;
  status: string;
  dateApplied: Date | null;
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; type?: string }>;
}) {
  const { q, page, type } = await searchParams;
  const searchQuery = q?.toLowerCase() || "";
  const typeFilter = type as any;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);

  const whereClause: any = {
    AND: [],
  };

  if (searchQuery) {
    whereClause.AND.push({
      OR: [
        { jobTitle: { contains: searchQuery } },
        { companyName: { contains: searchQuery } },
        { location: { contains: searchQuery } },
      ],
    });
  }

  if (typeFilter) {
    whereClause.AND.push({
      employmentType: typeFilter,
    });
  }

  // Get total count for pagination
  const totalItems = await prisma.application.count({ where: whereClause });
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Fetch raw data for stats (no filters except implicit "all")
  // We need ALL applications to calculate the daily graph and totals correctly
  // Note: You could cache this or optimize if data gets huge
  const allApplications = await prisma.application.findMany({
    select: {
      dateApplied: true,
    },
  });

  const totalApplications = allApplications.length;
  const today = new Date().toISOString().split("T")[0];
  
  const todayCount = allApplications.filter((a: any) => {
    if (!a.dateApplied) return false;
    const date = new Date(a.dateApplied).toISOString().split("T")[0];
    return date === today;
  }).length;

  // Prepare last 14 days data
  const dailyStats = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    
    const count = allApplications.filter((a: any) => {
      if (!a.dateApplied) return false;
      const appDate = new Date(a.dateApplied).toISOString().split("T")[0];
      return appDate === dateStr;
    }).length;
    
    dailyStats.push({ date: dateStr, count });
  }

  const applications: ApplicationRow[] = await prisma.application.findMany({
    where: whereClause,
    orderBy: { dateApplied: "desc" },
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Job Applications</h1>
          <p className="text-gray-500 mt-1">Manage and track your job search progress.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/applications/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Application
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Stats */}
      <ApplicationStats
        todayCount={todayCount}
        totalCount={totalApplications}
        dailyStats={dailyStats}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchInput />
        </div>
        <div className="w-full sm:w-48">
          <TypeFilter />
        </div>
      </div>

      {applications.length === 0 && !searchQuery && !typeFilter && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new job application.</p>
          <div className="mt-6">
            <Link
              href="/applications/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Application
            </Link>
          </div>
        </div>
      )}

      {applications.length === 0 && (searchQuery || typeFilter) && (
        <div className="text-center py-12">
           <p className="text-gray-500">No applications found matching your filters.</p>
        </div>
      )}

      {applications.length > 0 && (
        <>
          <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Job Title</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Company</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Location</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Type</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Applied</th>
                  <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Link
                        href={`/applications/${a.id}`}
                        className="hover:text-blue-600 hover:underline decoration-2 decoration-blue-600/20 underline-offset-2"
                      >
                        {a.jobTitle}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{a.companyName}</td>
                    <td className="px-6 py-4 text-gray-600">{a.location ?? "-"}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {typeLabel(a.employmentType)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${a.status === 'ACCEPTED' || a.status === 'OFFER' ? 'bg-green-100 text-green-800' : 
                          a.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                          a.status === 'NO_RESPONSE' ? 'bg-gray-100 text-gray-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {statusLabel(a.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {a.dateApplied
                        ? new Date(a.dateApplied).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteApplicationButton id={a.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
          />
        </>
      )}
    </div>
  );
}
