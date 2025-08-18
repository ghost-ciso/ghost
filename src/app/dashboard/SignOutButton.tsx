"use client";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await supabaseBrowser().auth.signOut();
        router.push("/");
      }}
    >
      Sign out
    </Button>
  );
}
