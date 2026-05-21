import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="page">
      <nav className="nav">
        <Link href="/" className="logo"><span className="logo-mark">M</span>MiaFlow</Link>
        <div className="nav-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/internships">Internships</Link>
          <Link href="/support">Support</Link>
        </div>
      </nav>

      <section className="container">
        <div className="card card-pad">
          <span className="badge">About MiaFlow</span>
          <h1>Built to make AI useful for small businesses.</h1>
          <p>
            MiaFlow was created to help small-business owners save time, reduce guesswork,
            and make better daily decisions using AI. The platform turns sales, inventory,
            orders, and customer activity into simple recommendations.
          </p>
        </div>

        <div className="grid-2" style={{ marginTop: 24 }}>
          <div className="card card-pad">
            <h2>Our mission</h2>
            <p>Make AI practical, safe, and useful for small businesses.</p>
          </div>
          <div className="card card-pad">
            <h2>Our principle</h2>
            <p>The AI recommends and drafts. The owner approves.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
