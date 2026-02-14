'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

function NativeDetail({ native }) {
  return (
    <div className="native-detail">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/natives">Natives</Link>
        <span>/</span>
        <Link href={`/natives/${native.ns}`}>{native.ns}</Link>
        <span>/</span>
        <span className="breadcrumb-current">{native.name}</span>
      </nav>

      {/* Title */}
      <h1>{native.name}</h1>

      {/* Hash & Aliases */}
      <div className="native-badges">
        {native.hash && (
          <span className="badge badge-gray">{native.hash}</span>
        )}
        <span className="badge badge-blue">{native.ns}</span>
        {native.aliases && native.aliases.filter(a => a).map(alias => (
          <span key={alias} className="badge badge-yellow">{alias}</span>
        ))}
      </div>

      {/* Signature */}
      {native.signature && (
        <div className="native-sig-block">
          <pre><code className="native-signature">{native.signature}</code></pre>
        </div>
      )}

      {/* Description */}
      {native.description && (
        <div className="native-section">
          <h2>Description</h2>
          <div className="native-desc">
            {native.description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* Parameters */}
      {native.params && native.params.length > 0 && (
        <div className="native-section">
          <h2>Parameters</h2>
          <table className="params-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {native.params.map((param, i) => (
                <tr key={i}>
                  <td className="param-name">{param.name}</td>
                  <td className="param-desc">{param.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Return Value */}
      {native.returnValue && (
        <div className="native-section">
          <h2>Return Value</h2>
          <p className="return-value">{native.returnValue}</p>
        </div>
      )}

      {/* Examples */}
      {native.examples && native.examples.length > 0 && (
        <div className="native-section">
          <h2>Examples</h2>
          {native.examples.map((example, i) => (
            <div key={i} className="example-block">
              <div className="example-lang">{example.lang}</div>
              <pre className="example-code"><code>{example.code}</code></pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function NativesIndex({ data }) {
  const [search, setSearch] = useState('')

  const namespaces = useMemo(() => {
    if (!data) return []
    return Object.values(data).sort((a, b) => a.name.localeCompare(b.name))
  }, [data])

  const searchResults = useMemo(() => {
    if (!data || !search.trim()) return null
    const q = search.toLowerCase()
    const results = []
    for (const ns of Object.values(data)) {
      for (const native of ns.natives) {
        if (
          native.name.toLowerCase().includes(q) ||
          (native.hash && native.hash.toLowerCase().includes(q)) ||
          (native.description && native.description.toLowerCase().includes(q))
        ) {
          results.push(native)
          if (results.length >= 50) break
        }
      }
      if (results.length >= 50) break
    }
    return results
  }, [data, search])

  const totalNatives = useMemo(() => {
    if (!data) return 0
    return Object.values(data).reduce((sum, ns) => sum + ns.count, 0)
  }, [data])

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">GTA V Native Functions</h1>
        <p className="page-subtitle">
          {totalNatives.toLocaleString()} natives across {namespaces.length} namespaces
        </p>
      </div>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search natives by name, hash, or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Search Results */}
      {searchResults ? (
        <div>
          <h2 className="section-title">
            Search Results ({searchResults.length}{searchResults.length >= 50 ? '+' : ''})
          </h2>
          <div className="list-section">
            {searchResults.map(native => (
              <Link
                key={`${native.ns}-${native.name}`}
                href={`/natives/${native.ns}/${encodeURIComponent(native.name)}`}
                className="search-result"
              >
                <div className="search-result-header">
                  <span className="badge badge-blue">{native.ns}</span>
                  <span className="native-item-name">{native.name}</span>
                  {native.hash && (
                    <span className="native-item-hash">{native.hash}</span>
                  )}
                </div>
                {native.signature && (
                  <span className="search-result-sig">{native.signature}</span>
                )}
                {native.description && (
                  <p className="search-result-desc">{native.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        /* Namespace Grid */
        <div className="ns-grid">
          {namespaces.map(ns => (
            <Link key={ns.name} href={`/natives/${ns.name}`} className="ns-card">
              <div className="ns-card-title">{ns.name}</div>
              <div className="ns-card-count">{ns.count} natives</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function NamespacePage({ nsName, natives }) {
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    if (!filter.trim()) return natives
    const q = filter.toLowerCase()
    return natives.filter(n =>
      n.name.toLowerCase().includes(q) ||
      (n.hash && n.hash.toLowerCase().includes(q)) ||
      (n.description && n.description.toLowerCase().includes(q))
    )
  }, [natives, filter])

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/natives">Natives</Link>
        <span>/</span>
        <span className="breadcrumb-current">{nsName}</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">{nsName}</h1>
        <p className="page-subtitle">{natives.length} native functions</p>
      </div>

      {/* Filter */}
      <div className="search-section">
        <input
          type="text"
          placeholder={`Filter ${nsName} natives...`}
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="search-input search-input-sm"
        />
      </div>

      {/* Natives List */}
      <div className="list-section">
        {filtered.map(native => (
          <Link
            key={native.name}
            href={`/natives/${nsName}/${encodeURIComponent(native.name)}`}
            className="native-item"
          >
            <div className="native-item-header">
              <span className="native-item-name">{native.name}</span>
              {native.hash && (
                <span className="native-item-hash">{native.hash}</span>
              )}
            </div>
            {native.signature && (
              <span className="native-item-sig">{native.signature}</span>
            )}
            {native.description && (
              <p className="native-item-desc">{native.description}</p>
            )}
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            No natives found matching &ldquo;{filter}&rdquo;
          </div>
        )}
      </div>
    </div>
  )
}

export default function NativeSlugPage() {
  const params = useParams()
  const slug = params.slug || []
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/natives-data.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="center-message">
        <p>Loading natives data...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="center-message">
        <p style={{ color: 'var(--x-color-red-500)' }}>Failed to load natives data</p>
      </div>
    )
  }

  // /natives (index - no slug)
  if (slug.length === 0) {
    return <NativesIndex data={data} />
  }

  // /natives/[NAMESPACE]
  if (slug.length === 1) {
    const nsName = slug[0]
    const ns = data[nsName]
    if (!ns) {
      return (
        <div className="center-message">
          <h1>Namespace Not Found</h1>
          <p>The namespace &ldquo;{nsName}&rdquo; does not exist.</p>
          <Link href="/natives">Back to Natives</Link>
        </div>
      )
    }
    return <NamespacePage nsName={nsName} natives={ns.natives} />
  }

  // /natives/[NAMESPACE]/[NATIVE_NAME]
  if (slug.length === 2) {
    const nsName = slug[0]
    const nativeName = decodeURIComponent(slug[1])
    const ns = data[nsName]
    if (!ns) {
      return (
        <div className="center-message">
          <h1>Not Found</h1>
          <Link href="/natives">Back to Natives</Link>
        </div>
      )
    }
    const native = ns.natives.find(n => n.name === nativeName)
    if (!native) {
      return (
        <div className="center-message">
          <h1>Native Not Found</h1>
          <p>&ldquo;{nativeName}&rdquo; was not found in {nsName}.</p>
          <Link href={`/natives/${nsName}`}>Back to {nsName}</Link>
        </div>
      )
    }
    return <NativeDetail native={native} />
  }

  // Fallback
  return (
    <div className="center-message">
      <h1>Not Found</h1>
      <Link href="/natives">Back to Natives</Link>
    </div>
  )
}
