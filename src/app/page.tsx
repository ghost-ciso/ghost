import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      <div className="mx-auto max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ghost App UI — Tailwind + shadcn ✅</CardTitle>
          </CardHeader>
          <CardContent className="space-x-3">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}