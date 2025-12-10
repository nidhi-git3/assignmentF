import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Client, Project } from "../types";

type Status = { type: "idle" | "loading" | "success" | "error"; message?: string };

const gradientText = "bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent";

export default function LandingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [newsletterStatus, setNewsletterStatus] = useState<Status>({ type: "idle" });

  useEffect(() => {
    api.get<Project[]>("/projects").then((res) => setProjects(res.data)).catch(() => {});
    api.get<Client[]>("/clients").then((res) => setClients(res.data)).catch(() => {});
  }, []);

  const heroBg = useMemo(
    () =>
      "relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/10 via-white/5 to-white/5 shadow-2xl",
    []
  );

  return (
    <div className="min-h-screen bg-[#070b17] text-slate-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.18),transparent_25%)]" />
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-lg font-semibold tracking-tight">
            <span className="text-white">Nova </span>
            <span className={gradientText}>Studio</span>
          </div>
          <nav className="hidden gap-6 text-sm text-slate-200 md:flex">
            <a className="hover:text-white" href="#projects">
              Projects
            </a>
            <a className="hover:text-white" href="#clients">
              Clients
            </a>
            <a className="hover:text-white" href="#contact">
              Contact
            </a>
          </nav>
          <a
            href="#newsletter"
            className="hidden md:inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Get updates
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-20 pt-12 md:pt-16">
        <section className={heroBg}>
          <div className="relative isolate overflow-hidden px-6 py-16 md:px-12 md:py-20">
            <div className="absolute inset-x-10 -top-24 h-72 bg-gradient-to-br from-indigo-500/30 via-cyan-400/20 to-emerald-300/10 blur-3xl" />
            <div className="relative grid items-center gap-10 md:grid-cols-2">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                  End-to-end digital builds
                </span>
                <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                  Bold, human-first digital experiences for teams that ship.
                </h1>
                <p className="text-lg text-slate-200/80">
                  We design, build, and launch full-stack products that feel premium—across web, admin, and the ops
                  you need to keep growing.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:translate-y-[-1px]"
                  >
                    View live work
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/30 hover:bg-white/5"
                  >
                    Talk to us
                  </a>
                </div>
                <div className="flex items-center gap-6 text-xs text-slate-300/80">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="h-9 w-9 rounded-full border border-white/10 bg-gradient-to-br from-slate-100/60 to-slate-300/30 backdrop-blur"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-white">Trusted by product teams</p>
                    <p>Web, mobile, dashboards, and growth tooling</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-indigo-500/20">
                  <img
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                    alt="Team working"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-sm text-slate-100">
                    <p className="font-semibold">Product Velocity Pack</p>
                    <p className="text-slate-200/80">Strategy, design systems, front-end, and admin automation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionHeader id="projects" title="Our Projects" subtitle="Fresh launches powered by our full-stack team." />
        <CardsGrid
          emptyText="Projects will appear here once added in the admin."
          items={projects}
          render={(project) => (
            <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={buildImageUrl(project.imageUrl)}
                  alt={project.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2 px-5 py-4">
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <p className="text-sm text-slate-200/80 line-clamp-2">{project.description}</p>
                <button className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-white">
                  Read more →
                </button>
              </div>
            </article>
          )}
        />

        <SectionHeader id="clients" title="Happy Clients" subtitle="Voices from the teams we build with." />
        <CardsGrid
          emptyText="Clients will show here after you add them in admin."
          items={clients}
          render={(client) => (
            <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <img
                  src={buildImageUrl(client.imageUrl)}
                  alt={client.name}
                  className="h-14 w-14 rounded-full border border-white/10 object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm uppercase tracking-wide text-indigo-200">{client.designation}</p>
                  <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                </div>
              </div>
              <p className="mt-4 text-slate-200/80 italic">“{client.description}”</p>
            </article>
          )}
        />

        <section id="contact" className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Contact</p>
            <h2 className="text-3xl font-semibold text-white">Tell us about your project.</h2>
            <p className="text-slate-200/80">
              Share a few details and we will get back with timelines, scope, and a tailored team to build it.
            </p>
            <ul className="grid gap-3 text-sm text-slate-300/90 md:grid-cols-2">
              <li className="rounded-2xl border border-white/5 bg-white/5 p-3">Design systems & UI engineering</li>
              <li className="rounded-2xl border border-white/5 bg-white/5 p-3">Admin dashboards & analytics</li>
              <li className="rounded-2xl border border-white/5 bg-white/5 p-3">CMS & marketing stacks</li>
              <li className="rounded-2xl border border-white/5 bg-white/5 p-3">Growth experiments & automation</li>
            </ul>
          </div>
          <ContactForm status={status} setStatus={setStatus} />
        </section>

        <section
          id="newsletter"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-sky-400/20 p-8 shadow-2xl"
        >
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Newsletter</p>
              <h3 className="text-2xl font-semibold text-white">Product drops, playbooks, and UI kits.</h3>
              <p className="text-slate-100/80">
                Join the weekly note: case studies, admin UX patterns, and free Figma assets.
              </p>
            </div>
            <NewsletterForm status={newsletterStatus} setStatus={setNewsletterStatus} />
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeader({ id, title, subtitle }: { id: string; title: string; subtitle: string }) {
  return (
    <div id={id} className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.25em] text-indigo-200">Featured</p>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold text-white">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/40 via-white/10 to-transparent" />
      </div>
      <p className="max-w-2xl text-slate-200/80">{subtitle}</p>
    </div>
  );
}

function CardsGrid<T>({ items, render, emptyText }: { items: T[]; render: (item: T) => JSX.Element; emptyText: string }) {
  if (!items.length)
    return <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200/70">{emptyText}</p>;
  return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map(render)}</div>;
}

function ContactForm({ status, setStatus }: { status: Status; setStatus: (s: Status) => void }) {
  const [form, setForm] = useState({ fullName: "", email: "", mobile: "", city: "" });
  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });
    try {
      await api.post("/contacts", form);
      setStatus({ type: "success", message: "We received your note. Expect a reply soon!" });
      setForm({ fullName: "", email: "", mobile: "", city: "" });
    } catch (err: any) {
      setStatus({ type: "error", message: err?.response?.data?.message || "Something went wrong" });
    }
  };

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-6 shadow-xl backdrop-blur">
      <div className="grid gap-4">
        {["fullName", "email", "mobile", "city"].map((field) => (
          <label key={field} className="space-y-2 text-sm text-slate-200/90">
            <span className="capitalize">{field === "fullName" ? "Full Name" : field}</span>
            <input
              required
              type={field === "email" ? "email" : "text"}
              value={(form as any)[field]}
              onChange={(e) => update(field, e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
            />
          </label>
        ))}
      </div>
      <button
        disabled={status.type === "loading"}
        className="mt-5 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
      >
        {status.type === "loading" ? "Sending..." : "Send message"}
      </button>
      {status.type !== "idle" && (
        <p
          className={`mt-3 text-sm ${
            status.type === "success" ? "text-emerald-300" : status.type === "error" ? "text-rose-300" : "text-slate-200"
          }`}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}

function NewsletterForm({ status, setStatus }: { status: Status; setStatus: (s: Status) => void }) {
  const [email, setEmail] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });
    try {
      await api.post("/subscriptions", { email });
      setStatus({ type: "success", message: "Subscribed! Welcome aboard." });
      setEmail("");
    } catch (err: any) {
      setStatus({ type: "error", message: err?.response?.data?.message || "Try again" });
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg md:flex-row md:items-center">
      <input
        required
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
      />
      <button
        disabled={status.type === "loading"}
        className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-wait"
      >
        {status.type === "loading" ? "Subscribing..." : "Subscribe"}
      </button>
      {status.type !== "idle" && (
        <p className="text-sm text-slate-100/80 md:ml-3">{status.message || (status.type === "success" ? "All set!" : "")}</p>
      )}
    </form>
  );
}

function buildImageUrl(imageUrl: string) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  const base = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/api\/?$/, "");
  return `${base}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

