import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <AppShell showSidebar={false}>
      <div className="grid gap-4 sm:max-w-md mx-auto pt-8">
        <div className="space-y-2 mb-4 text-center">
          <h1 className="text-3xl font-display font-black uppercase tracking-wide">Sign in</h1>
          <p className="text-sm font-sans text-neutral-600">
            Join the creator loop. Save prompts, vote, and remix ideas.
          </p>
        </div>

        {/* Email & Password Form */}
        <AuthForm />

        {/* Neo-brutalist Divider */}
        <div className="relative flex items-center py-2 my-2">
          <div className="flex-grow border-t-2 border-dashed border-black/25"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono font-black text-neutral-400 uppercase tracking-widest">
            Hoặc tiếp tục với
          </span>
          <div className="flex-grow border-t-2 border-dashed border-black/25"></div>
        </div>

        {/* Social logins */}
        <div className="grid grid-cols-2 gap-3">
          <Button asChild size="lg" className="border-2 border-black bg-white hover:bg-neutral-50 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-display font-black uppercase text-[11px] tracking-wider rounded-none">
            <Link href="/auth/login?provider=google">Google</Link>
          </Button>
          <Button asChild size="lg" className="border-2 border-black bg-white hover:bg-neutral-50 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-display font-black uppercase text-[11px] tracking-wider rounded-none">
            <Link href="/auth/login?provider=github">GitHub</Link>
          </Button>
        </div>

        <p className="text-xs text-neutral-500 font-mono uppercase tracking-wide text-center mt-4 leading-relaxed">
          By signing in you agree to the community guidelines and respect prompt
          ownership.
        </p>
      </div>
    </AppShell>
  );
}

