// src/app/dashboard/page.tsx
import { supabaseServer } from "@/lib/supabase/server";
import NewRequestForm from "./NewRequestForm";
import RequestRow from "./RequestRow";
import SignOutButton from "./SignOutButton";
import type { Target, DeletionRequest } from "@/types";

export default async function Dashboard() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: targets } = await supabase
    .from("targets")
    .select("id,name")
    .order("name");

  const safeTargets: Target[] = (targets ?? []).map(t => ({
    id: t.id as string,
    name: t.name as string,
  }));

  const { data: requests } = await supabase
    .from("deletion_requests")
    .select("id, user_id, target_id, status, reference_code, created_at")
    .order("created_at", { ascending: false });

  const safeRequests: DeletionRequest[] = (requests ?? []).map(r => ({
    id: r.id as string,
    user_id: r.user_id as string,
    target_id: r.target_id as string,
    status: r.status as DeletionRequest["status"],
    reference_code: (r.reference_code ?? null) as string | null,
    created_at: r.created_at as string,
  }));

  const nameById = new Map<string, string>(safeTargets.map(t => [t.id, t.name]));

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user?.email}</h1>
          <p className="text-sm text-zinc-600">Create and track deletion requests.</p>
        </div>
        <SignOutButton />
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">New Request</h2>
        <NewRequestForm targets={safeTargets} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Your Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-4">Broker</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Reference</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeRequests.map((r) => (
                <RequestRow
                  key={r.id}
                  r={r}
                  brokerName={nameById.get(r.target_id) ?? r.target_id}
                />
              ))}
              {safeRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-zinc-500">No requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
