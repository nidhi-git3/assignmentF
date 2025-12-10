import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Client, Contact, Project, Subscription } from "../types";

type Status = { type: "idle" | "loading" | "success" | "error"; message?: string };

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    api.get<Project[]>("/projects", { headers }).then((r) => setProjects(r.data));
    api.get<Client[]>("/clients", { headers }).then((r) => setClients(r.data));
    api.get<Contact[]>("/contacts", { headers }).then((r) => setContacts(r.data));
    api.get<Subscription[]>("/subscriptions", { headers }).then((r) => setSubs(r.data));
  }, [token]);

  if (!token) {
    return <Login setToken={setToken} status={status} setStatus={setStatus} />;
  }

  return (
    <div className="min-h-screen bg-[#070b17] text-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Admin</p>
            <h1 className="text-3xl font-semibold text-white">Control Center</h1>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            Log out
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AdminCard title="Add Project" subtitle="Upload cropped image (450x350)">
            <ProjectForm token={token} onCreated={(p) => setProjects((prev) => [p, ...prev])} />
          </AdminCard>
          <AdminCard title="Add Client" subtitle="Upload avatar (300x300)">
            <ClientForm token={token} onCreated={(c) => setClients((prev) => [c, ...prev])} />
          </AdminCard>
        </div>

        <div className="mt-10 grid gap-6">
          <DataTable<Project>
            title="Projects"
            items={projects}
            columns={[
              { label: "Name", render: (p) => p.name },
              { label: "Description", render: (p) => p.description },
            ]}
            onDelete={(id) => handleDelete(`/projects/${id}`, token, () => setProjects((items) => items.filter((i) => i._id !== id)))}
          />
          <DataTable<Client>
            title="Clients"
            items={clients}
            columns={[
              { label: "Name", render: (c) => c.name },
              { label: "Role", render: (c) => c.designation },
              { label: "Quote", render: (c) => c.description },
            ]}
            onDelete={(id) => handleDelete(`/clients/${id}`, token, () => setClients((items) => items.filter((i) => i._id !== id)))}
          />
          <DataTable<Contact>
            title="Contact Forms"
            items={contacts}
            columns={[
              { label: "Name", render: (c) => c.fullName },
              { label: "Email", render: (c) => c.email },
              { label: "Mobile", render: (c) => c.mobile },
              { label: "City", render: (c) => c.city },
            ]}
          />
          <DataTable<Subscription>
            title="Newsletter"
            items={subs}
            columns={[{ label: "Email", render: (s) => s.email }]}
          />
        </div>
      </div>
    </div>
  );
}

function Login({
  setToken,
  status,
  setStatus,
}: {
  setToken: (t: string) => void;
  status: Status;
  setStatus: (s: Status) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setStatus({ type: "success" });
    } catch {
      setStatus({ type: "error", message: "Invalid credentials" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b17] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl"
      >
        <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
        <p className="text-sm text-slate-300">Use the seeded admin credentials from your environment.</p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-300 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-300 focus:outline-none"
          />
        </div>
        <button
          disabled={status.type === "loading"}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-indigo-500/25"
        >
          {status.type === "loading" ? "Signing in..." : "Sign in"}
        </button>
        {status.type === "error" && <p className="text-sm text-rose-300">{status.message}</p>}
      </form>
    </div>
  );
}

function AdminCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Manage</p>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-300/90">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function ProjectForm({ token, onCreated }: { token: string; onCreated: (p: Project) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setStatus({ type: "error", message: "Add an image" });
    setStatus({ type: "loading" });
    try {
      const data = new FormData();
      data.append("name", name);
      data.append("description", description);
      data.append("image", file);
      const res = await api.post("/projects", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      onCreated(res.data);
      setName("");
      setDescription("");
      setFile(null);
      setStatus({ type: "success", message: "Project saved" });
    } catch {
      setStatus({ type: "error", message: "Failed to save" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        required
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-indigo-300 focus:outline-none"
      />
      <textarea
        required
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-indigo-300 focus:outline-none"
      />
      <input
        required
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full text-sm text-slate-300"
      />
      <button className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:-translate-y-0.5">
        {status.type === "loading" ? "Saving..." : "Save project"}
      </button>
      {status.type !== "idle" && <p className="text-sm text-slate-200">{status.message}</p>}
    </form>
  );
}

function ClientForm({ token, onCreated }: { token: string; onCreated: (c: Client) => void }) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setStatus({ type: "error", message: "Add an image" });
    setStatus({ type: "loading" });
    try {
      const data = new FormData();
      data.append("name", name);
      data.append("designation", designation);
      data.append("description", description);
      data.append("image", file);
      const res = await api.post("/clients", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      onCreated(res.data);
      setName("");
      setDesignation("");
      setDescription("");
      setFile(null);
      setStatus({ type: "success", message: "Client saved" });
    } catch {
      setStatus({ type: "error", message: "Failed to save" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        required
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-indigo-300 focus:outline-none"
      />
      <input
        required
        placeholder="Designation"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-indigo-300 focus:outline-none"
      />
      <textarea
        required
        placeholder="Testimonial"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-indigo-300 focus:outline-none"
      />
      <input
        required
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full text-sm text-slate-300"
      />
      <button className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:-translate-y-0.5">
        {status.type === "loading" ? "Saving..." : "Save client"}
      </button>
      {status.type !== "idle" && <p className="text-sm text-slate-200">{status.message}</p>}
    </form>
  );
}

async function handleDelete(path: string, token: string, after: () => void) {
  await api.delete(path, { headers: { Authorization: `Bearer ${token}` } });
  after();
}

function DataTable<T>({
  title,
  items,
  columns,
  onDelete,
}: {
  title: string;
  items: T[];
  columns: { label: string; render: (item: T) => React.ReactNode }[];
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Records</p>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {items.length === 0 && <p className="px-5 py-4 text-sm text-slate-300/90">No data yet.</p>}
        {items.map((item: any) => (
          <div key={item._id} className="flex items-start gap-3 px-5 py-4">
            <div className="grid flex-1 gap-1 md:grid-cols-3">
              {columns.map((col) => (
                <div key={col.label} className="text-sm text-slate-200/90">
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-400">{col.label}</span>
                  <span>{col.render(item)}</span>
                </div>
              ))}
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(item._id)}
                className="text-xs font-semibold text-rose-300 hover:text-rose-200"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

