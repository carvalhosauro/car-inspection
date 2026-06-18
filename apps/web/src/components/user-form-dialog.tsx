"use client";

import { useRef, useState, type FormEvent } from "react";
import type { CreateUserInput } from "@vistoria/contracts";
import { Button } from "@vistoria/ui/atoms/Button";
import { HtmlInput } from "@/components/ui/html-input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";

const CREATABLE_ROLES = ["supervisor", "vistoriador"] as const;
type CreatableRole = (typeof CREATABLE_ROLES)[number];

export function UserFormDialog({
  onSubmit,
  pending,
}: {
  onSubmit: (input: CreateUserInput) => void;
  pending: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<CreatableRole>("supervisor");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ name: name.trim(), email: email.trim(), password, role });
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <form ref={formRef} onSubmit={submit} className="grid max-w-2xl gap-3 rounded-lg border border-border p-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="u-name">Nome</Label>
        <HtmlInput id="u-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="u-email">E-mail</Label>
        <HtmlInput id="u-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="u-password">Senha</Label>
        <HtmlInput id="u-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="u-role">Papel</Label>
        <NativeSelect id="u-role" value={role} onChange={(e) => setRole(e.target.value as CreatableRole)}>
          {CREATABLE_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </NativeSelect>
      </div>
      <div className="md:col-span-2">
        <Button
          label={pending ? "Criando..." : "Criar usuário"}
          disabled={pending}
          onPress={() => formRef.current?.requestSubmit()}
        />
      </div>
    </form>
  );
}
