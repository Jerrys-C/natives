import { getNamespaces, getAllNativeSummaries } from "@/lib/natives";
import { SearchableHome } from "./SearchableHome";

export default function Home() {
  const namespaces = getNamespaces();
  const totalNatives = namespaces.reduce((sum, ns) => sum + ns.count, 0);
  const allNatives = getAllNativeSummaries();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          GTA V Native Reference
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          <span className="text-[var(--accent)] font-semibold">
            {totalNatives.toLocaleString()}
          </span>{" "}
          native functions across{" "}
          <span className="text-[var(--accent)] font-semibold">
            {namespaces.length}
          </span>{" "}
          namespaces
        </p>
      </div>

      <SearchableHome namespaces={namespaces} allNatives={allNatives} />
    </div>
  );
}
