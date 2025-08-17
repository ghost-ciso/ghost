"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Target = { id: string; name: string; website: string | null };

export default function AdminTargetsClient({ initial }: { initial: Target[] }) {
  const [targets, setTargets] = useState<Target[]>(initial);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");

  async function add() {
    if (!name.trim()) return;
    const res = await fetch("/api/targets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, website: website || null }),
    });
    if (!res.ok) return alert((await res.json()).error || "Failed");
    const { data } = await res.json();
    setTargets([ ...targets, data ].sort((a,b)=>a.name.localeCompare(b.name)));
    setName(""); setWebsite("");
  }

  async function save(id: string, patch: Partial<Target>) {
    const res = await fetch(`/api/targets/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return alert((await res.json()).error || "Failed");
    const { data } = await res.json();
    setTargets(targets.map(t => t.id === id ? data : t).sort((a,b)=>a.name.localeCompare(b.name)));
  }

  async function remove(id: string) {
    if (!confirm("Delete target?")) return;
    const res = await fetch(`/api/targets/${id}`, { method: "DELETE" });
    if (!res.ok) return alert((await res.json()).error || "Failed");
    setTargets(targets.filter(t => t.id !== id));
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin · Targets</h1>

      <section className="space-y-3 max-w-xl">
        <h2 className="text-lg font-medium">Add</h2>
        <div className="flex gap-2">
          <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <Input placeholder="Website (optional)" value={website} onChange={(e)=>setWebsite(e.target.value)} />
          <Button onClick={add}>Add</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">All Targets</h2>
        <div className="space-y-2">
          {targets.map(t => (
            <TargetRow key={t.id} t={t} onSave={save} onRemove={remove} />
          ))}
          {targets.length === 0 && <p className="text-sm text-zinc-500">No targets.</p>}
        </div>
      </section>
    </main>
  );
}

function TargetRow({ t, onSave, onRemove }:{
  t: Target; onSave:(id:string, patch:Partial<Target>)=>void; onRemove:(id:string)=>void
}) {
  const [name, setName] = useState(t.name);
  const [website, setWebsite] = useState(t.website ?? "");
  const dirty = name !== t.name || website !== (t.website ?? "");
  return (
    <div className="flex gap-2 items-center max-w-3xl">
      <Input className="w-64" value={name} onChange={(e)=>setName(e.target.value)} />
      <Input className="w-96" value={website} onChange={(e)=>setWebsite(e.target.value)} placeholder="https://..." />
      <Button size="sm" onClick={()=>onSave(t.id, { name, website: website || null })} disabled={!dirty}>Save</Button>
      <Button size="sm" variant="outline" onClick={()=>onRemove(t.id)}>Delete</Button>
    </div>
  );
}
