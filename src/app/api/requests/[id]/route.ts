import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import type { DeletionRequestStatus } from "@/types";

type RequestUpdate = Partial<{
  status: DeletionRequestStatus;
  reference_code: string | null;
}>;

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: unknown = await req.json().catch(() => ({}));
  const updates: RequestUpdate = {};

  if (typeof body === "object" && body) {
    const b = body as Record<string, unknown>;
    if ("status" in b) updates.status = b.status as DeletionRequestStatus;
    if ("reference_code" in b) updates.reference_code = (b.reference_code as string | null) ?? null;
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("deletion_requests")
    .update(updates)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("deletion_requests")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
