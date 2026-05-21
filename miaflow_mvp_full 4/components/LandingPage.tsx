"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  LineChart,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Store,
  Users
} from "lucide-react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const formEndpoint = "https://formspree.io/f/meedayyg";

const features = [
  {
    icon: LineChart,
    title: "Sales insights",
    description:
      "See what is selling, what is slowing down, and where revenue is changing day by day."
  },
  {
    icon: ClipboardCheck,
    title: "Restock recommendations",
    description:
      "Get suggestions on what to restock, what to prep, and what to reduce before waste happens."
  },
  {
    icon: PhoneCall,
    title: "Phone order drafts",
    description:
      "Let AI collect order details and send drafts to the owner dashboard for review."
  },
  {
    icon: ShieldCheck,
    title: "Owner approval built in",
    description:
      "The AI recommends and drafts actions, but the owner stays in control of important decisions."
  }
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleWaitlistSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(formEndpoint, {
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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || "Could not save your email right now. Please try again."
        );
      }

      setStatus("success");
      setMessage("You are on the waitlist. We will be in touch soon.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save your email right now. Please try again."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.25),_transparent_30%)]" />

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight">MiaFlow</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#how" className="hover:text-white">
              How it works
            </a>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
            <Link href="/internships" className="hover:text-white">
              Internships
            </Link>
            <Link href="/support" className="hover:text-white">
              Support
            </Link>
          </div>

          <Link
            href="/dashboard"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Open MVP
          </Link>
        </nav>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-32 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              <Bot className="h-4 w-4" />
              AI operations assistant for small businesses
            </div>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              AI agents that help small businesses run smarter.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              MiaFlow helps business owners understand sales, predict restock
              needs, draft phone orders, and approve AI-recommended actions from
              one simple dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                Join the waitlist
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Try dashboard demo
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-400" /> Restock
                recommendations
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-400" /> Phone order
                drafts
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-400" /> Owner
                approval controls
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-slate-900 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">MiaFlow Dashboard</p>
                  <h2 className="text-2xl font-semibold">Today’s action plan</h2>
                </div>
                <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
                  Safe mode on
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Today’s revenue", "$1,248", "+14% from last Tuesday"],
                  ["Top product", "Cupcakes", "Trending up for Friday"],
                  ["Restock alert", "Oat Milk", "Low stock"]
                ].map(([label, value, note]) => (
                  <div key={label} className="rounded-2xl bg-white/[0.06] p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold">{value}</p>
                    <p className="mt-1 text-sm text-slate-400">{note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-blue-500 p-2">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">AI recommendation</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      Prepare 25 extra cupcakes for Friday. Reduce croissant
                      batch by 15%. Review 2 phone order drafts before 4 PM.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/[0.06] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold">Pending approval</p>
                  <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                    Needs owner review
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  Customer order draft: 24 cupcakes for Saturday pickup at 3:00
                  PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Features
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Everything owners need to see, decide, and approve.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            MiaFlow turns business data into clear next steps, so owners can
            spend less time guessing and more time running the business.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.07]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="how" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              How it works
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              From data to daily action plan.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Upload sales data, let MiaFlow analyze trends, review AI
              recommendations, and approve what should happen next.
            </p>
          </div>
          <div className="space-y-4">
            {[
              "Upload sales data",
              "MiaFlow analyzes product trends",
              "AI agents create recommended actions",
              "Owner approves, edits, or rejects"
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-900 p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-950">
                  {index + 1}
                </div>
                <p className="text-lg font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8">
            <Users className="mb-5 h-8 w-8 text-blue-300" />
            <h2 className="text-3xl font-bold">Internship-ready project</h2>
            <p className="mt-4 text-slate-300">
              MiaFlow includes clear frontend, backend, AI agent, outreach, and
              marketing roles so interns can contribute to real startup
              features.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8">
            <ShieldCheck className="mb-5 h-8 w-8 text-blue-300" />
            <h2 className="text-3xl font-bold">Safety-first design</h2>
            <p className="mt-4 text-slate-300">
              The AI can recommend and draft actions, but important business
              decisions stay in the owner approval queue.
            </p>
          </div>
        </div>
      </section>

      <section id="waitlist" className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 md:p-12">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500">
            <Store className="h-7 w-7" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            Join the early access list.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            We are building for bakeries, cafés, dessert shops, restaurants,
            salons, and local retailers that want smarter daily operations
            without complicated software.
          </p>
          <form
            onSubmit={handleWaitlistSubmit}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              className="min-h-12 flex-1 rounded-full border border-white/10 bg-slate-950 px-5 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="min-h-12 rounded-full bg-blue-500 px-6 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Submitting..." : "Request access"}
            </button>
          </form>
          {message && (
            <p
              className={`mx-auto mt-4 max-w-xl text-sm ${
                status === "error" ? "text-red-300" : "text-emerald-300"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
