"use client";

import { useState } from "react";
import { User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useCurrentUser } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/lib/role-access";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Section, FieldGrid, Field, ReadOnlyField } from "@/components/ui/section";
import { cn } from "@/lib/utils";

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Dölj lösenord" : "Visa lösenord"}
        title={visible ? "Dölj lösenord" : "Visa lösenord"}
        className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function ProfilPage() {
  const user = useCurrentUser();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  function set(key: "name" | "email", value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    setError("");
    setSaved(false);

    if (!form.name.trim() || !form.email.trim()) {
      setError("Namn och e-postadress måste fyllas i.");
      return;
    }

    // Demo only — there is no backend, so nothing is persisted beyond this page.
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleSavePassword() {
    setPasswordError("");
    setPasswordSaved(false);

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setPasswordError("Fyll i båda lösenordsfälten.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Lösenorden matchar inte.");
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <div className="text-base font-semibold">Min profil</div>
        <div className="text-sm text-muted-foreground">Ditt konto i Jobbportal.</div>
      </div>

      <Section
        title="Personuppgifter"
        desc="Namn och kontaktuppgifter för ditt konto."
        icon={User}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      >
        <FieldGrid>
          <Field label="Namn">
            <Input
              className="h-10 rounded-xl"
              value={form.name}
              disabled={!isEditing}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>

          <Field label="E-postadress">
            <Input
              className="h-10 rounded-xl"
              value={form.email}
              disabled={!isEditing}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>

          <ReadOnlyField label="Roll" value={ROLE_LABELS[user.role]} />
        </FieldGrid>

        {error && <div className="mt-3 text-xs text-red-600">{error}</div>}
        {saved && <div className="mt-3 text-xs text-emerald-600">Profilen är uppdaterad.</div>}

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className={cn(
              "rounded-xl px-5 py-2 text-sm font-medium transition",
              isEditing
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium transition hover:bg-muted"
            )}
          >
            {isEditing ? "Spara" : "Redigera"}
          </button>
        </div>
      </Section>

      <Section
        title="Återställ lösenord"
        desc="Sätt ett nytt lösenord för ditt konto."
        icon={ShieldCheck}
        iconBg="bg-red-50"
        iconColor="text-red-600"
      >
        <FieldGrid>
          <Field label="Nytt lösenord">
            <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Field>
          <Field label="Bekräfta lösenord">
            <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </Field>
        </FieldGrid>

        {passwordError && <div className="mt-3 text-xs text-red-600">{passwordError}</div>}
        {passwordSaved && <div className="mt-3 text-xs text-emerald-600">Lösenordet är uppdaterat.</div>}

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSavePassword} className="h-10 rounded-xl">
            Spara
          </Button>
        </div>
      </Section>
    </div>
  );
}
