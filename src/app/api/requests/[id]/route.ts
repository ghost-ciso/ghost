import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import type { DeletionRequestStatus } from "@/types";

type RequestUpdate = Partial<{ status: DeletionRequestStatus; reference_code: string | null }>;

function getIdFromUrl(req: Request) {
  const path = new URL(req.url).pathname;
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

export async function PATCH(req: Request) {
  const id = getIdFromUrl(req);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const updates: RequestUpdate = {};
  if ("status" in body) updates.status = body.status as DeletionRequestStatus;
  if ("reference_code" in body) updates.reference_code = (body.reference_code as string | null) ?? null;
  if (!Object.keys(updates).length) return NextResponse.json({ error: "No fields to update" }, { status: 400 });

  const { data, error } = await supabase
    .from("deletion_requests")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req: Request) {
  const id = getIdFromUrl(req);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase.from("deletion_requests").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
