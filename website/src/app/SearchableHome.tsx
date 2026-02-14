"use client";

import { useState, useMemo } from "react";

interface NamespaceInfo {
  name: string;
  count: number;
}

interface NativeSummary {
  name: string;
  namespace: string;
  hash: string;
  signature: string;
}

export function SearchableHome({
  namespaces,
  allNatives,
}: {
  namespaces: NamespaceInfo[];
  allNatives: NativeSummary[];
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allNatives
      .filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.hash.toLowerCase().includes(q) ||
          n.namespace.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [query, allNatives]);

  return (
    <>
      {/* Search */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]"
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
            placeholder="Search natives by name or hash..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {query.trim() && (
        <div className="max-w-4xl mx-auto mb-10">
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            {results.length === 0
              ? "No results found"
              : `${results.length}${results.length === 50 ? "+" : ""} results`}
          </p>
          <div className="border border-[var(--border-color)] rounded-xl overflow-hidden divide-y divide-[var(--border-color)]">
            {results.map((native) => (
              <a
                key={`${native.namespace}/${native.name}`}
                href={`/natives/${native.namespace}/${native.name}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--accent)] border border-[var(--border-color)] shrink-0">
                  {native.namespace}
                </span>
                <span className="font-mono text-sm truncate">
                  {native.name}
                </span>
                {native.hash && (
                  <span className="ml-auto text-xs text-[var(--text-secondary)] font-mono hidden sm:inline">
                    {native.hash}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Namespace Grid */}
      {!query.trim() && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {namespaces.map((ns) => (
            <a
              key={ns.name}
              href={`/natives/${ns.name}`}
              className="group p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-tertiary)] transition-all"
            >
              <div className="font-mono text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                {ns.name}
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                {ns.count} native{ns.count !== 1 ? "s" : ""}
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
