"use client";

import { useState, useMemo } from "react";

interface NativeSummary {
  name: string;
  hash: string;
  signature: string;
  hasDescription: boolean;
}

export function NamespaceSearch({
  namespace,
  natives,
}: {
  namespace: string;
  natives: NativeSummary[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return natives;
    const q = query.toLowerCase().trim();
    return natives.filter(
      (n) =>
        n.name.toLowerCase().includes(q) || n.hash.toLowerCase().includes(q)
    );
  }, [query, natives]);

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={`Filter ${namespace} natives...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-2">
          Showing {filtered.length} of {natives.length}
        </p>
      </div>

      {/* Native List */}
      <div className="border border-[var(--border-color)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-left text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">
                Hash
              </th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">
                Signature
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {filtered.map((native) => (
              <tr
                key={native.name}
                className="hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <td className="px-4 py-3">
                  <a
                    href={`/natives/${namespace}/${native.name}`}
                    className="font-mono text-[var(--accent)] hover:underline"
                  >
                    {native.name}
                  </a>
                  {native.hasDescription && (
                    <span
                      className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[var(--green)]"
                      title="Documented"
                    />
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)] hidden md:table-cell">
                  {native.hash}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)] hidden lg:table-cell truncate max-w-md">
                  {native.signature}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
