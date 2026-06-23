"use client";

import { useRef, useState, type FormEvent } from "react";
import type { CreateUserInput } from "@vistoria/contracts";
import { Button } from "@vistoria/ui/atoms/Button";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";

const CREATABLE_ROLES = ["supervisor", "vistoriador"] as const;
type CreatableRole = (typeof CREATABLE_ROLES)[number];

export function UserFormDialog({
  open,
  onClose,
  onSubmit,
  pending,
}: {
  open: boolean;
  onClose: () => void;
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
    <Dialog open={open} onClose={onClose}>
      <form ref={formRef} onSubmit={submit} className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Novo usuário</h2>
          <p className="text-sm text-muted-foreground">Crie uma conta de supervisor ou vistoriador.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="u-name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormField id="u-email" label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <FormField id="u-password" label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div className="space-y-2">
            <Label htmlFor="u-role">Papel</Label>
            <NativeSelect id="u-role" value={role} onChange={(e) => setRole(e.target.value as CreatableRole)}>
              {CREATABLE_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </NativeSelect>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button label="Cancelar" variant="secondary" onPress={onClose} />
          <Button
            label={pending ? "Criando..." : "Criar usuário"}
            disabled={pending}
            onPress={() => formRef.current?.requestSubmit()}
          />
        </div>
      </form>
    </Dialog>
  );
}
