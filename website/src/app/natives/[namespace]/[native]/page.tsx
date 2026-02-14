import {
  getNamespaces,
  getNativesForNamespace,
  getNative,
} from "@/lib/natives";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const namespaces = getNamespaces();
  const params: { namespace: string; native: string }[] = [];

  for (const ns of namespaces) {
    const natives = getNativesForNamespace(ns.name);
    for (const n of natives) {
      params.push({ namespace: ns.name, native: n.name });
    }
  }

  return params;
}

export default async function NativePage({
  params,
}: {
  params: Promise<{ namespace: string; native: string }>;
}) {
  const { namespace, native: nativeName } = await params;
  const native = getNative(namespace, nativeName);

  if (!native) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
        <a
          href="/"
          className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          Home
        </a>
        <span className="text-[var(--text-secondary)]">/</span>
        <a
          href={`/natives/${namespace}`}
          className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          {namespace}
        </a>
        <span className="text-[var(--text-secondary)]">/</span>
        <span className="text-[var(--text-primary)] font-medium truncate">
          {native.name}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold font-mono mb-3 break-all">
          {native.name}
        </h1>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] text-[var(--accent)] border border-[var(--border-color)]">
            {namespace}
          </span>
          {native.hash && (
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
              {native.hash}
            </span>
          )}
          {native.jhash && (
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
              {native.jhash}
            </span>
          )}
          {native.apiset && (
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] text-[var(--purple)] border border-[var(--border-color)]">
              {native.apiset}
            </span>
          )}
        </div>
      </div>

      {/* Signature */}
      {native.signature && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Signature
          </h2>
          <pre className="!bg-[var(--bg-secondary)]">
            <code className="text-[var(--green)]">{native.signature}</code>
          </pre>
        </section>
      )}

      {/* Description */}
      {native.description && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Description
          </h2>
          <div className="prose prose-invert max-w-none text-[var(--text-primary)] text-sm leading-relaxed whitespace-pre-wrap">
            {native.description}
          </div>
        </section>
      )}

      {/* Aliases */}
      {native.aliases.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Aliases
          </h2>
          <div className="flex flex-wrap gap-2">
            {native.aliases.map((alias) => (
              <span
                key={alias}
                className="text-xs font-mono px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] text-[var(--yellow)] border border-[var(--border-color)]"
              >
                {alias}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Parameters */}
      {native.params.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Parameters
          </h2>
          <div className="border border-[var(--border-color)] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                  <th className="px-4 py-2.5 text-left font-medium">Name</th>
                  <th className="px-4 py-2.5 text-left font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {native.params.map((param) => (
                  <tr key={param.name}>
                    <td className="px-4 py-3 font-mono text-[var(--accent)] whitespace-nowrap align-top">
                      {param.name}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {param.description || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Examples */}
      {native.examples.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            Examples
          </h2>
          <div className="space-y-4">
            {native.examples.map((example, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[var(--text-secondary)] px-2 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                    {example.lang}
                  </span>
                </div>
                <pre className="!bg-[var(--bg-secondary)]">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
