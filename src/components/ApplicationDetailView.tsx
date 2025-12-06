"use client";

import { useState } from "react";
import EditApplicationForm from "@/components/EditApplicationForm";
import DeleteApplicationButton from "@/components/DeleteApplicationButton";
import StatusDropdown from "@/components/StatusDropdown";
import Link from "next/link";

export default function ApplicationDetailView({ application }: { application: any }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Application</h1>
        </div>
        <EditApplicationForm
          application={application}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
    REMOTE: "Remote",
    HYBRID: "Hybrid",
    ONSITE: "On-site",
  };

  function employmentTypeLabel(type: string | null) {
    if (!type) return "-";
    return EMPLOYMENT_TYPE_LABELS[type] ?? type;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <Link
            href="/applications"
            className="mt-1 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            title="Back to applications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{application.jobTitle}</h1>
            <p className="text-lg text-gray-600 mt-1">{application.companyName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <DeleteApplicationButton id={application.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Card */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Current Status
            </h3>
            <StatusDropdown id={application.id} currentStatus={application.status} />
          </div>

          {/* Details Card */}
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Application Details</h3>
            </div>
            <div className="divide-y">
              <DetailRow label="Location" value={application.location} />
              <DetailRow label="Employment Type" value={employmentTypeLabel(application.employmentType)} />
              <DetailRow label="Salary" value={application.salary} />
              <DetailRow
                label="Date Applied"
                value={
                  application.dateApplied
                    ? new Date(application.dateApplied).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : null
                }
                suppressHydrationWarning
              />
              <DetailRow label="Source" value={application.source} />
              <DetailRow label="Application Method" value={application.applicationMethod} />
              <DetailRow
                label="Cover Letter Included"
                value={application.includedCoverLetter ? "Yes" : "No"}
              />
              {application.urlToJobPosting && (
                <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 hover:bg-gray-50 transition-colors">
                  <dt className="text-sm font-medium text-gray-500">Job URL</dt>
                  <dd className="text-sm text-gray-900 sm:col-span-2">
                    <a
                      href={application.urlToJobPosting}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all inline-flex items-center gap-1"
                    >
                      View Posting
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  </dd>
                </div>
              )}
            </div>
          </div>

          {/* Requirements Card */}
          {application.requirementsShortlist && (
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Requirements / Notes</h3>
              </div>
              <div className="p-6">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {application.requirementsShortlist}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-50 border rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Metadata</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900 font-medium" suppressHydrationWarning>
                  {new Date(application.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-900 font-medium" suppressHydrationWarning>
                  {new Date(application.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, suppressHydrationWarning }: { label: string; value: string | null; suppressHydrationWarning?: boolean }) {
  return (
    <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 hover:bg-gray-50 transition-colors">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 sm:col-span-2 font-medium" suppressHydrationWarning={suppressHydrationWarning}>{value || "-"}</dd>
    </div>
  );
}

