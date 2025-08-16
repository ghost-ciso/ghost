"use client";
import { useState, FormEvent } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirectedFrom") || "/dashboard";

  async function onMagicLink(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = supabaseBrowser();
    const emailRedirectTo = `${location.origin}/auth/callback?next=/dashboard`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });
    setLoading(false);
    if (error) alert(error.message);
    else router.push("/"); // just takes you back home while you check email
  }

  async function onPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) alert(error.message);
    else router.push(redirect);
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader><CardTitle>Sign in</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={onPassword} className="space-y-3">
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <Input type="password" placeholder="password (optional)" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>Sign in</Button>
              <Button type="button" variant="outline" onClick={onMagicLink} disabled={loading}>Magic link</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
