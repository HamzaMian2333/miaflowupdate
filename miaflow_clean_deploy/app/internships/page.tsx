"use client";

import Link from "next/link";
import { useState } from "react";

export default function InternshipsPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formspree.io/f/meedayyg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          ...payload,
          source: "MiaFlow internship application"
        })
      });

      if (!response.ok) throw new Error("Could not submit application. Please try again.");

      setStatus("success");
      setMessage("Application submitted. Thank you for applying.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not submit application. Please try again.");
    }
  }

  return (
    <main className="page">
      <nav className="nav">
        <Link href="/" className="logo"><span className="logo-mark">M</span>MiaFlow</Link>
        <div className="nav-links">
          <Link href="/about">About</Link>
          <Link href="/support">Support</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <section className="container">
        <div className="card card-pad">
          <span className="badge">Internships</span>
          <h1>Internships at MiaFlow</h1>
          <p>
            MiaFlow is looking for motivated undergraduate students who want hands-on
            experience building and growing an AI startup. Prior experience is helpful
            but not required.
          </p>
        </div>

        <div className="feature-grid">
          {[
            ["AI Agent Intern", "Prompts, AI workflows, structured outputs, and safety rules."],
            ["Frontend Intern", "Dashboard UI, cards, pages, forms, and responsive design."],
            ["Backend Intern", "APIs, CSV handling, data structure, and approval workflows."],
            ["Outreach Intern", "Contact small businesses and help grow the waitlist."]
          ].map(([title, text]) => (
            <div className="card card-pad" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <div className="card card-pad" style={{ marginTop: 24 }}>
          <h2>Internship Application</h2>
          <form onSubmit={submitApplication} style={{ marginTop: 20 }}>
            <div className="grid-2">
              <input className="input" name="full_name" placeholder="Full name" required />
              <input className="input" name="email" type="email" placeholder="Email" required />
              <input className="input" name="college" placeholder="College / University" required />
              <input className="input" name="graduation_year" placeholder="Graduation year" required />
            </div>
            <select className="input" name="role" required style={{ marginTop: 14 }}>
              <option value="">Role interested in</option>
              <option>AI Agent Intern</option>
              <option>Frontend Engineering Intern</option>
              <option>Backend Engineering Intern</option>
              <option>Business Development / Outreach Intern</option>
              <option>Marketing Intern</option>
              <option>Not sure yet</option>
            </select>
            <div className="grid-2" style={{ marginTop: 14 }}>
              <input className="input" name="linkedin" placeholder="LinkedIn" />
              <input className="input" name="github_or_portfolio" placeholder="GitHub or portfolio" />
            </div>
            <textarea className="input" name="why_interested" placeholder="Why are you interested in MiaFlow?" required style={{ marginTop: 14 }} />
            <textarea className="input" name="skills" placeholder="What skills can you contribute?" required style={{ marginTop: 14 }} />
            <button className="btn btn-primary" type="submit" disabled={status === "loading"} style={{ marginTop: 14 }}>
              {status === "loading" ? "Submitting..." : "Submit Application"}
            </button>
          </form>
          {message && <p className={status === "error" ? "message-error" : "message-ok"}>{message}</p>}
        </div>
      </section>
    </main>
  );
}
