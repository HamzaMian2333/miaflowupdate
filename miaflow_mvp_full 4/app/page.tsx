"use client";

import Link from "next/link";
import { useState } from "react";

const endpoint = "https://formspree.io/f/meedayyg";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submitWaitlist(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "MiaFlow waitlist" })
      });
      if (!res.ok) throw new Error("Could not save your email right now. Please try again.");
      setStatus("success");
      setMessage("You are on the waitlist. We will be in touch soon.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not save your email right now.");
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="container">
          <nav className="nav">
            <Link href="/" className="logo"><span className="logo-mark">M</span>MiaFlow</Link>
            <div className="nav-links">
              <Link href="/about">About</Link>
              <a href="#features">Features</a>
              <Link href="/internships">Internships</Link>
              <Link href="/support">Support</Link>
              <Link href="/dashboard" className="btn btn-white">Open MVP</Link>
            </div>
          </nav>

          <div className="hero-grid">
            <div>
              <div className="eyebrow">AI operations assistant for small businesses</div>
              <h1>AI agents that help small businesses run smarter.</h1>
              <p>
                MiaFlow helps business owners understand sales, predict restock needs, draft phone orders, and approve AI-recommended actions from one simple dashboard.
              </p>
              <div className="btn-row">
                <a href="#waitlist" className="btn btn-primary">Join the waitlist</a>
                <Link href="/dashboard" className="btn btn-secondary">Try the dashboard demo</Link>
              </div>
            </div>

            <div className="mock-card">
              <div className="mock-inner">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
                  <div><div className="small">MiaFlow Dashboard</div><h3>Today’s action plan</h3></div>
                  <span className="badge badge-ok">Safe mode on</span>
                </div>
                <div className="kpi-grid">
                  <div className="kpi"><div className="kpi-label">Revenue</div><div className="kpi-value">$1,248</div><p className="small">+14% today</p></div>
                  <div className="kpi"><div className="kpi-label">Top product</div><div className="kpi-value">Cupcakes</div><p className="small">Trending up</p></div>
                  <div className="kpi"><div className="kpi-label">Restock</div><div className="kpi-value">Oat Milk</div><p className="small">Low stock</p></div>
                </div>
                <div className="card card-pad" style={{ marginTop: 14 }}>
                  <strong>AI recommendation</strong>
                  <p>Prepare 25 extra cupcakes for Friday. Reduce croissant prep by 15%. Review 2 phone order drafts.</p>
                </div>
                <div className="card card-pad" style={{ marginTop: 14 }}>
                  <span className="badge badge-pending">Needs owner review</span>
                  <p>Customer order draft: 24 cupcakes for Saturday pickup at 3 PM.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="container">
          <h2>Everything owners need to see, decide, and approve.</h2>
          <p>MiaFlow turns business data into clear next steps so owners can spend less time guessing and more time running the business.</p>
          <div className="features">
            {[
              ["📈", "Sales Insights", "See what is selling, what is slowing down, and how the business is performing."],
              ["📦", "Restock Recommendations", "Get suggestions on what to restock, prep, or reduce before waste happens."],
              ["☎️", "Phone Order Drafts", "Create structured order drafts for owner review and approval."],
              ["✅", "Approval Dashboard", "The AI recommends and drafts, but the owner approves important actions."]
            ].map(([icon, title, copy]) => (
              <div className="card feature" key={title}><div className="icon">{icon}</div><h3>{title}</h3><p>{copy}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "rgba(255,255,255,.03)" }}>
        <div className="container two-col">
          <div className="card card-pad"><h2>Safety-first AI for real businesses.</h2><p>MiaFlow does not automatically charge customers, place supplier orders, change inventory, or send important messages. It recommends, drafts, and organizes. The owner makes the final decision.</p></div>
          <div className="card card-pad"><h2>Built for real MVP testing.</h2><p>This package includes a working dashboard demo with CSV upload, rule-based agents, phone-order drafts, approvals, and activity logs. OpenAI can be added later, but the MVP works without paid API credits.</p></div>
        </div>
      </section>

      <section id="waitlist" className="section">
        <div className="container" style={{ maxWidth: 760, textAlign: "center" }}>
          <h2>Join the early access list.</h2>
          <p>We are building for bakeries, cafés, restaurants, salons, retailers, and local businesses that want smarter daily operations.</p>
          <form onSubmit={submitWaitlist} className="form">
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            <button className="btn btn-primary" disabled={status === "loading"}>{status === "loading" ? "Submitting..." : "Request access"}</button>
          </form>
          {message && <p className={status === "error" ? "message-error" : "message-success"}>{message}</p>}
        </div>
      </section>
    </main>
  );
}
