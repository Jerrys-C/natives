import { getNamespaces, getNativesForNamespace } from "@/lib/natives";
import { notFound } from "next/navigation";
import { NamespaceSearch } from "./NamespaceSearch";

export function generateStaticParams() {
  return getNamespaces().map((ns) => ({ namespace: ns.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  return {
    title: `${namespace} - Natives Reference`,
    description: `GTA V ${namespace} native functions reference`,
  };
}

export default async function NamespacePage({
  params,
}: {
  params: Promise<{ namespace: string }>;
}) {
  const { namespace } = await params;
  const natives = getNativesForNamespace(namespace);

  if (natives.length === 0) {
    notFound();
  }

  const nativeSummaries = natives.map((n) => ({
    name: n.name,
    hash: n.hash,
    signature: n.signature,
    hasDescription: !!n.description,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <a
          href="/"
          className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          Home
        </a>
        <span className="text-[var(--text-secondary)]">/</span>
        <span className="text-[var(--text-primary)] font-medium">
          {namespace}
        </span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{namespace}</h1>
        <p className="text-[var(--text-secondary)]">
          {natives.length} native function{natives.length !== 1 ? "s" : ""}
        </p>
      </div>

      <NamespaceSearch
        namespace={namespace}
        natives={nativeSummaries}
      />
    </div>
  );
}
