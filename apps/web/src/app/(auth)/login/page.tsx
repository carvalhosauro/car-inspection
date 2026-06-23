import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(37,99,235,0.35),transparent_70%)]"
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-elevated">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-white">Vistoria AI</h1>
          <p className="mt-1 text-sm text-slate-400">Painel administrativo de vistorias</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-elevated sm:p-8">
          <div className="mb-5 space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Entrar</h2>
            <p className="text-sm text-muted-foreground">Acesse com suas credenciais para continuar.</p>
          </div>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Gestão e auditoria de vistorias &middot; Acesso restrito
        </p>
      </div>
    </main>
  );
}
