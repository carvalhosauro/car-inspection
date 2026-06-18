import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="space-y-6">
        <h1 className="text-center text-2xl font-bold">Vistoria Admin</h1>
        <LoginForm />
      </div>
    </main>
  );
}
