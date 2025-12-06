"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ImportResult = {
  jobTitle?: string;
  companyName?: string;
  location?: string;
  employmentType?: "REMOTE" | "HYBRID" | "ONSITE" | null;
  salary?: string | null;
  requirementsShortlist?: string | null;
  urlToJobPosting?: string | null;
};

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export default function NewApplicationPage() {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    employmentType: "",
    salary: "Undisclosed",
    dateApplied: getTodayDate(),
    source: "",
    applicationMethod: "",
    requirementsShortlist: "",
    urlToJobPosting: "",
    includedCoverLetter: false,
  });

  function updateField<K extends keyof typeof form>(key: K, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/applications", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/applications");
    } else {
      alert("Error saving application");
    }
  }

  async function handleImportFromUrl(formData: FormData) {
    const url = formData.get("url") as string;
    if (!url) return;

    setImporting(true);
    setImportError(null);

    try {
      const res = await fetch("/api/import-job", {
        method: "POST",
        body: JSON.stringify({ type: "url", url }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Import failed");
      const data: ImportResult = await res.json();

      setForm((prev) => ({
        ...prev,
        jobTitle: data.jobTitle ?? prev.jobTitle,
        companyName: data.companyName ?? prev.companyName,
        location: data.location ?? prev.location,
        employmentType: data.employmentType ?? prev.employmentType,
        salary: data.salary ?? prev.salary,
        requirementsShortlist:
          data.requirementsShortlist ?? prev.requirementsShortlist,
        urlToJobPosting: data.urlToJobPosting ?? url,
        source: prev.source || "Imported",
      }));
    } catch (err: any) {
      setImportError(err.message || "Import error");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
      <div className="flex items-center gap-4 border-b pb-6">
        <Link
          href="/applications"
          className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add New Application</h1>
          <p className="text-gray-500 mt-1">Manually enter job details or import from a URL.</p>
        </div>
      </div>

      {/* Import box */}
      <form
        className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-4"
        action={handleImportFromUrl}
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600 hidden sm:block">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="font-semibold text-blue-900">Import from Job URL</h2>
             <p className="text-sm text-blue-700">
              Paste a job posting URL to auto-fill fields (Stub implementation).
            </p>
            <div className="flex gap-3 mt-2">
              <input
                name="url"
                type="url"
                placeholder="https://linkedin.com/jobs/..."
                className="flex-1 border-blue-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={importing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {importing ? "Importing..." : "Import"}
              </button>
            </div>
            {importError && (
              <p className="text-xs text-red-600 font-medium mt-1">{importError}</p>
            )}
          </div>
        </div>
      </form>

      {/* Manual form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm border rounded-xl p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
              value={form.jobTitle}
              onChange={(e) => updateField("jobTitle", e.target.value)}
              required
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              required
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              required
              placeholder="e.g. London, UK"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow appearance-none bg-white"
                value={form.employmentType}
                onChange={(e) => updateField("employmentType", e.target.value)}
                required
              >
                <option value="">Select Employment Type</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-site</option>
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Salary
            </label>
            <input
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
              value={form.salary}
              onChange={(e) => updateField("salary", e.target.value)}
              placeholder="e.g. €60k - €80k"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Date Applied <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
              value={form.dateApplied}
              onChange={(e) => updateField("dateApplied", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Source <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
              value={form.source}
              onChange={(e) => updateField("source", e.target.value)}
              placeholder="e.g. LinkedIn, Company Site"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Application Method <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
              value={form.applicationMethod}
              onChange={(e) =>
                updateField("applicationMethod", e.target.value)
              }
              placeholder="e.g. Easy Apply, Email"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 shadow-sm transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    checked={form.includedCoverLetter}
                    onChange={(e) => updateField("includedCoverLetter", e.target.checked)}
                  />
                  <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Included Cover Letter</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Job URL <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
            value={form.urlToJobPosting}
            onChange={(e) => updateField("urlToJobPosting", e.target.value)}
            placeholder="https://..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Requirements (Shortlist) <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow min-h-[120px]"
            value={form.requirementsShortlist}
            onChange={(e) =>
              updateField("requirementsShortlist", e.target.value)
            }
            placeholder="- 3+ years React experience&#10;- TypeScript knowledge&#10;- Remote work capable"
            required
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t">
          <button
            type="button"
            onClick={() => router.push("/applications")}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Application
          </button>
        </div>
      </form>
    </div>
  );
}
    