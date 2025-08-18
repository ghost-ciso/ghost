import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseServer } from "@/lib/supabase/server";
import type { Target } from "@/types";

type TargetUpdate = Partial<Pick<Target, "name" | "website">>;

export async function PATCH(req: Request, { params }) {
  const id = String(params?.id ?? "");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const updates: TargetUpdate = {};
  if ("name" in body) updates.name = body.name as string;
  if ("website" in body) updates.website = (body.website as string) ?? null;
  if (!Object.keys(updates).length) return NextResponse.json({ error: "No fields to update" }, { status: 400 });

  const supabase = await supabaseServer();
  const { data, error } = await supabase.from("targets").update(updates).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(_req: Request, { params }) {
  const id = String(params?.id ?? "");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await supabaseServer();
  const { error } = await supabase.from("targets").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
