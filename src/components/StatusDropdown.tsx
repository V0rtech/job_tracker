"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "NO_RESPONSE", label: "No response" },
  { value: "FIRST_INTERVIEW", label: "First Interview" },
  { value: "SECOND_INTERVIEW", label: "Second Interview" },
  { value: "FINAL_INTERVIEW", label: "Final Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ACCEPTED", label: "Accepted" },
];

export default function StatusDropdown({
  id,
  currentStatus,
}: {
  id: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  async function handleChange(newStatus: string) {
    if (newStatus === status) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={updating}
      className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border-0 cursor-pointer hover:bg-blue-200 disabled:opacity-50 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

