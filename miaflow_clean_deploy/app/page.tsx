"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitWaitlist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("https://formspree.io/f/meedayyg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email,
          source: "MiaFlow waitlist"
        })
      });

      if (!response.ok) {
        throw new Error("Could not save your email right now. Please try again.");
      }

      setStatus("success");
      setMessage("You are on the waitlist. We will be in touch soon.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not save your email right now. Please try again.");
    }
  }

  return (
    <main className="page">
      <nav className="nav">
        <Link href="/" className="logo"><span className="logo-mark">M</span>MiaFlow</Link>
        <div className="nav-links">
          <Link href="/about">About</Link>
          <Link href="/internships">Internships</Link>
          <Link href="/support">Support</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <section className="container hero">
        <div>
          <span className="badge">AI operations assistant for small businesses</span>
          <h1>AI agents that help small businesses run smarter.</h1>
          <p>
            MiaFlow helps owners understand sales, predict restock needs, draft phone orders,
            and approve AI-recommended actions from one simple dashboard.
          </p>
          <div className="btn-row">
            <a href="#waitlist" className="btn btn-primary">Join the waitlist</a>
            <Link href="/dashboard" className="btn btn-white">Try dashboard demo</Link>
          </div>
        </div>

        <div className="card card-pad">
          <div className="dashboard-preview">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <p className="small">MiaFlow Dashboard</p>
                <h2 style={{ fontSize: 28 }}>Today’s action plan</h2>
              </div>
              <span className="badge badge-ok">Safe mode on</span>
            </div>

            <div className="grid-3" style={{ marginTop: 18 }}>
              <div className="card card-pad"><p className="small">Revenue</p><h3>$1,248</h3><p className="small">+14%</p></div>
              <div className="card card-pad"><p className="small">Top item</p><h3>Cupcakes</h3><p className="small">Trending up</p></div>
              <div className="card card-pad"><p className="small">Alert</p><h3>Oat Milk</h3><p className="small">Low stock</p></div>
            </div>

            <div className="card card-pad" style={{ marginTop: 18 }}>
              <span className="badge">AI recommendation</span>
              <p>Prepare 25 extra cupcakes for Friday and review 2 pending phone-order drafts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <h2>Everything owners need to see, decide, and approve.</h2>
        <div className="feature-grid">
          {[
            ["Sales Insights", "See what is selling and what is slowing down."],
            ["Restock Recommendations", "Know what to restock, prep, or reduce."],
            ["Phone Order Drafts", "Turn customer requests into owner-reviewed drafts."],
            ["Approval Dashboard", "The AI recommends. The owner approves."]
          ].map(([title, text]) => (
            <div className="card card-pad" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="waitlist" className="container">
        <div className="card card-pad" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h2>Join the early access list.</h2>
          <p>We are building for cafés, bakeries, restaurants, salons, local retailers, and service businesses.</p>
          <form onSubmit={submitWaitlist} className="btn-row" style={{ justifyContent: "center" }}>
            <input
              className="input"
              style={{ maxWidth: 380 }}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button className="btn btn-primary" disabled={status === "loading"} type="submit">
              {status === "loading" ? "Submitting..." : "Request access"}
            </button>
          </form>
          {message && <p className={status === "error" ? "message-error" : "message-ok"}>{message}</p>}
        </div>
      </section>
    </main>
  );
}
