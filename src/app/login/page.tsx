import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <AppShell showSidebar={false}>
      <div className="grid gap-4 sm:max-w-md">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-display font-black uppercase tracking-wide">Sign in</h1>
          <p className="text-sm font-sans text-neutral-600">
            Join the creator loop. Save prompts, vote, and remix ideas.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/auth/login?provider=google">Continue with Google</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/auth/login?provider=github">Continue with GitHub</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          By signing in you agree to the community guidelines and respect prompt
          ownership.
        </p>
      </div>
    </AppShell>
  );
}
