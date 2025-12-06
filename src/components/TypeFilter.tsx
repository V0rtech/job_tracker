"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "On-site" },
];

export default function TypeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") || "all";

  function handleChange(type: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    // Reset page to 1 when filter changes
    params.delete("page");
    router.push(`/applications?${params.toString()}`);
  }

  return (
    <select
      value={currentType}
      onChange={(e) => handleChange(e.target.value)}
      className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
    >
      {TYPE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}



