"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  Code2,
  Database,
  Loader2,
  Megaphone,
  PenTool,
  Send,
  Sparkles
} from "lucide-react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const roles = [
  {
    icon: Bot,
    title: "AI Agent Intern",
    skills: "Basic Python, APIs, AI prompts, JSON, interest in agents",
    tasks:
      "Create prompts, test inventory recommendations, define safety rules, document agent behavior."
  },
  {
    icon: Code2,
    title: "Frontend Engineering Intern",
    skills: "HTML, CSS, JavaScript, React, API calls, GitHub basics",
    tasks:
      "Build dashboard cards, approval queue UI, phone order cards, sales screens, and responsive layouts."
  },
  {
    icon: Database,
    title: "Backend Engineering Intern",
    skills:
      "Python or JavaScript, APIs, basic database knowledge, CSV handling, GitHub basics",
    tasks:
      "Build CSV upload logic, API endpoints, sales data structures, approval queue backend, and mock order APIs."
  },
  {
    icon: Megaphone,
    title: "Business Development / Outreach Intern",
    skills:
      "Clear communication, organization, professional messaging, interest in startups",
    tasks:
      "Contact small businesses, explain MiaFlow, help owners join the waitlist, and track outreach."
  },
  {
    icon: PenTool,
    title: "Marketing Intern",
    skills:
      "Writing, social media familiarity, basic design sense, interest in AI and startups",
    tasks:
      "Create social posts, write product explanations, help with campaigns, and create content for owners."
  }
];

export default function InternshipsPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleApplicationSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      source: "MiaFlow internship application",
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      college: formData.get("college"),
      graduation_year: formData.get("graduation_year"),
      role_interested: formData.get("role_interested"),
      linkedin: formData.get("linkedin"),
      github_or_portfolio: formData.get("github_or_portfolio"),
      experience_level: formData.get("experience_level"),
      why_interested: formData.get("why_interested"),
      skills: formData.get("skills")
    };

    try {
      const endpoint =
        process.env.NEXT_PUBLIC_INTERNSHIP_FORMSPREE_ENDPOINT ||
        process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
        "https://formspree.io/f/meedayyg";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Could not submit your application right now. Please try again."
        );
      }

      setStatus("success");
      setMessage(
        "Application submitted. Thank you for applying to MiaFlow."
      );
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not submit your application right now. Please try again."
      );
    }
  }

  return (
    <main className="min-h-screen bg-ink text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 md:p-12">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Internships at MiaFlow
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            MiaFlow is looking for motivated undergraduate students who want
            hands-on experience building and growing an AI startup. Prior
            experience is helpful but not required. Applicants with limited
            experience are encouraged to apply if they are eager to learn,
            communicate well, and contribute consistently.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-semibold">{role.title}</h2>
                <p className="mt-4 text-sm font-semibold text-blue-300">
                  Skills
                </p>
                <p className="mt-2 leading-7 text-slate-300">{role.skills}</p>
                <p className="mt-4 text-sm font-semibold text-blue-300">
                  Example tasks
                </p>
                <p className="mt-2 leading-7 text-slate-300">{role.tasks}</p>
              </div>
            );
          })}
        </div>

        <div
          id="apply"
          className="mt-10 grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 md:p-10 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Apply now
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Internship Application
            </h2>
            <p className="mt-4 leading-8 text-slate-300">
              Fill out this form to apply for a MiaFlow internship. We review
              applications based on interest, communication, reliability, and
              willingness to learn.
            </p>
            <p className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4 text-sm leading-6 text-blue-100">
              Tip: If you do not have a GitHub or portfolio yet, that is okay.
              Share any class project, small project, or area you are excited to
              learn.
            </p>
          </div>

          <form onSubmit={handleApplicationSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name" name="full_name" required />
              <Field label="Email" name="email" type="email" required />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="College / University" name="college" required />
              <Field
                label="Graduation Year"
                name="graduation_year"
                placeholder="Example: 2027"
                required
              />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Role Interested In
              </span>
              <select
                name="role_interested"
                required
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-blue-400"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option>AI Agent Intern</option>
                <option>Frontend Engineering Intern</option>
                <option>Backend Engineering Intern</option>
                <option>Business Development / Outreach Intern</option>
                <option>Marketing Intern</option>
                <option>Not sure yet</option>
              </select>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="LinkedIn"
                name="linkedin"
                placeholder="https://linkedin.com/in/..."
              />
              <Field
                label="GitHub or Portfolio"
                name="github_or_portfolio"
                placeholder="https://github.com/..."
              />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Experience Level
              </span>
              <select
                name="experience_level"
                required
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-white outline-none focus:border-blue-400"
                defaultValue=""
              >
                <option value="" disabled>
                  Select experience level
                </option>
                <option>Beginner / limited experience</option>
                <option>Some class projects or personal projects</option>
                <option>Previous internship or team project experience</option>
                <option>Strong experience in this area</option>
              </select>
            </label>

            <Textarea
              label="Why are you interested in MiaFlow?"
              name="why_interested"
              placeholder="Tell us why you want to join and what you hope to learn."
              required
            />

            <Textarea
              label="What skills can you contribute?"
              name="skills"
              placeholder="Mention coding, AI, outreach, marketing, design, organization, or anything relevant."
              required
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Application
                </>
              )}
            </button>

            {message && (
              <p
                className={`text-sm ${
                  status === "error" ? "text-red-300" : "text-emerald-300"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  placeholder,
  required = false
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </span>
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
      />
    </label>
  );
}
