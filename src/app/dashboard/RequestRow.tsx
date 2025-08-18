"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { DeletionRequest, DeletionRequestStatus } from "@/types";

export default function RequestRow(
  { r, brokerName }: { r: DeletionRequest; brokerName: string }
) {
  const [status, setStatus] = useState<DeletionRequestStatus>(r.status ?? "new");
  const [ref, setRef] = useState<string>(r.reference_code ?? "");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function save() {
    setBusy(true);
    const res = await fetch(`/api/requests/${r.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status, reference_code: ref || null }),
    });
    setBusy(false);
    if (!res.ok) return alert((await res.json()).error || "Failed to save");
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this request?")) return;
    setBusy(true);
    const res = await fetch(`/api/requests/${r.id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) return alert((await res.json()).error || "Failed to delete");
    router.refresh();
  }

  const created = new Date(r.created_at).toLocaleString();

  return (
    <tr className="border-b">
      <td className="py-2 pr-4 whitespace-nowrap">{created}</td>
      <td className="py-2 pr-4">{brokerName}</td>
      <td className="py-2 pr-4">
        <select
          className="border rounded px-2 py-1"
          value={status}
          onChange={(e) => setStatus(e.target.value as DeletionRequestStatus)}
          disabled={busy}
        >
          <option value="new">New</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="complete">Complete</option>
          <option value="rejected">Rejected</option>
        </select>
      </td>
      <td className="py-2 pr-4">
        <input
          className="border rounded px-2 py-1 min-w-[220px]"
          placeholder="Ticket # / link"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          disabled={busy}
        />
      </td>
      <td className="py-2 pr-4">
        <div className="flex gap-2">
          <Button size="sm" onClick={save} disabled={busy}>Save</Button>
          <Button size="sm" variant="outline" onClick={remove} disabled={busy}>Delete</Button>
        </div>
      </td>
    </tr>
  );
}
