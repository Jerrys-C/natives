import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="home-hero">
      <h1 className="home-title">🎮 GTA V Natives Reference</h1>
      <p className="home-desc">
        Comprehensive documentation for 6000+ GTA V native functions.
        Search, browse, and explore with ease.
      </p>
      <div className="home-actions">
        <Link href="/natives" className="btn-primary">
          Browse Natives
        </Link>
        <Link href="/docs" className="btn-secondary">
          Read Docs
        </Link>
      </div>
    </div>
  )
}
