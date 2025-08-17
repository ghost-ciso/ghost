"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Target = { id: string; name: string };

export default function NewRequestForm({ targets }: { targets: Target[] }) {
  const [targetId, setTargetId] = useState(targets[0]?.id ?? "");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!targetId) return alert("Choose a broker/target first.");
    setBusy(true);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ target_id: targetId, reference_code: reference || null }),
    });
    setBusy(false);
    if (!res.ok) return alert((await res.json()).error || "Failed to create.");
    setReference("");
    if (typeof window !== "undefined") window.location.reload();
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
      <label className="text-sm">
        <div className="mb-1">Broker</div>
        <select
          className="border rounded px-2 py-1 min-w-[220px]"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
        >
          {targets.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        <div className="mb-1">Reference (optional)</div>
        <input
          className="border rounded px-2 py-1 min-w-[260px]"
          placeholder="Ticket # / link"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
      </label>

      <Button type="submit" disabled={busy}>Create</Button>
    </form>
  );
}
