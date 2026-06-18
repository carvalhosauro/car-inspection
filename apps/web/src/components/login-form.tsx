"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vistoria/ui/atoms/Button";
import { HtmlInput } from "@/components/ui/html-input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Falha no login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <HtmlInput
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <HtmlInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        label={loading ? "Entrando..." : "Entrar"}
        onPress={handleSubmit}
        disabled={loading}
        loading={loading}
        variant="primary"
      />
    </form>
  );
}
