import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const target_id = body?.target_id as string | undefined;
  const reference_code = (body?.reference_code ?? null) as string | null;

  if (!target_id) {
    return NextResponse.json({ error: "target_id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("deletion_requests")
    .insert({
      user_id: user.id,         // <-- important for RLS
      target_id,
      reference_code,
      status: "new",            // remove or change if your DB default/enum differs
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}
