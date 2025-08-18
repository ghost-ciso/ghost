import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseServer } from "@/lib/supabase/server";
import type { Target } from "@/types";

type TargetUpdate = Partial<Pick<Target, "name" | "website">>;

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body: unknown = await req.json().catch(() => ({}));
  const updates: TargetUpdate = {};

  if (typeof body === "object" && body) {
    const b = body as Record<string, unknown>;
    if ("name" in b) updates.name = b.name as string;
    if ("website" in b) updates.website = (b.website as string) ?? null;
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("targets")
    .update(updates)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await supabaseServer();
  const { error } = await supabase
    .from("targets")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
