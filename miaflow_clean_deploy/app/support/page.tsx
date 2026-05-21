import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="page">
      <nav className="nav">
        <Link href="/" className="logo"><span className="logo-mark">M</span>MiaFlow</Link>
        <div className="nav-links">
          <Link href="/about">About</Link>
          <Link href="/internships">Internships</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <section className="container">
        <div className="card card-pad">
          <span className="badge">Support</span>
          <h1>MiaFlow Support</h1>
          <p>
            Need help with MiaFlow? This page is here for business owners, interns,
            and early users.
          </p>
        </div>

        <div className="grid-3" style={{ marginTop: 24 }}>
          <div className="card card-pad"><h3>Business Owners</h3><p>Get help joining the waitlist, uploading sales data, and reviewing recommendations.</p></div>
          <div className="card card-pad"><h3>Interns</h3><p>Get help with onboarding, GitHub access, tasks, and communication.</p></div>
          <div className="card card-pad"><h3>Technical Issues</h3><p>Send your name, email, screenshot, and a short description of the issue.</p></div>
        </div>
      </section>
    </main>
  );
}
