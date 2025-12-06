"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function DeleteApplicationButton({ id }: { id: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [deleting, setDeleting] = useState(false);

  // Check if we're on the detail page
  const isDetailPage = pathname === `/applications/${id}`;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (isDetailPage) {
          router.push("/applications");
        } else {
          router.refresh();
        }
      } else {
        alert("Failed to delete application");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
      title="Delete application"
    >
      {deleting ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
    </button>
  );
}

