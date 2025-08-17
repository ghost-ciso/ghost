import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const target_id = String(form.get("target_id") || "");
  const reference_code = String(form.get("reference_code") || "");

  if (!target_id) return NextResponse.json({ error: "target_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("deletion_requests")
    .insert({ user_id: user.id, target_id, reference_code })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}
