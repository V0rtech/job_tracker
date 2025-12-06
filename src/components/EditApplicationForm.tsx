"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditApplicationFormProps {
  application: {
    id: number;
    jobTitle: string;
    companyName: string;
    location: string | null;
    employmentType: string | null;
    salary: string | null;
    dateApplied: Date | null;
    source: string | null;
    applicationMethod: string | null;
    requirementsShortlist: string | null;
    urlToJobPosting: string | null;
    includedCoverLetter: boolean;
  };
  onCancel: () => void;
}

export default function EditApplicationForm({
  application,
  onCancel,
}: EditApplicationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    jobTitle: application.jobTitle,
    companyName: application.companyName,
    location: application.location || "",
    employmentType: application.employmentType || "",
    salary: application.salary || "",
    dateApplied: application.dateApplied
      ? new Date(application.dateApplied).toISOString().split("T")[0]
      : "",
    source: application.source || "",
    applicationMethod: application.applicationMethod || "",
    requirementsShortlist: application.requirementsShortlist || "",
    urlToJobPosting: application.urlToJobPosting || "",
    includedCoverLetter: application.includedCoverLetter ?? false,
  });

  function updateField<K extends keyof typeof form>(key: K, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.refresh();
        onCancel();
      } else {
        alert("Failed to update application");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
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
          required
        />
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

