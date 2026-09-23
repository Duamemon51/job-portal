"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold text-white shadow-md"
        style={{ background: "var(--sidebar-gradient)" }}
      >
        JP
      </div>
      <span className="text-sm font-bold tracking-tight text-foreground">Jobbportal</span>
    </Link>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type={visible ? "text" : "password"}
          required
          minLength={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Minst 8 tecken"
          className="h-11 rounded-xl pl-9 pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Dölj lösenord" : "Visa lösenord"}
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default function AterstallLosenord() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.message ?? "Något gick fel.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-12">
      {/* Soft brand-colored décor, kept subtle behind the card */}
      <div
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--sidebar-gradient)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--sidebar-gradient)" }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <BrandMark />
        </div>

        <Card className="border-border/70 shadow-xl shadow-primary/5">
          <CardContent className="pt-7 pb-6">
            {done ? (
              <div className="flex flex-col items-center text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h1 className="mt-4 text-xl font-semibold tracking-tight">Lösenordet är uppdaterat</h1>
                <p className="mt-1.5 max-w-[26ch] text-sm text-muted-foreground">
                  Du skickas vidare till inloggningen om ett ögonblick…
                </p>
              </div>
            ) : !token ? (
              <div className="flex flex-col items-center text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h1 className="mt-4 text-xl font-semibold tracking-tight">Länken är ogiltig</h1>
                <p className="mt-1.5 max-w-[26ch] text-sm text-muted-foreground">
                  Länken saknas eller har gått ut. Begär en ny för att fortsätta.
                </p>
                <Link href="/glomt-losenord" className="mt-5 w-full">
                  <Button className="h-11 w-full rounded-xl text-sm font-semibold">Begär en ny länk</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h1 className="mt-4 text-xl font-semibold tracking-tight">Återställ lösenord</h1>
                  <p className="mt-1.5 max-w-[26ch] text-sm text-muted-foreground">
                    Välj ett nytt lösenord för ditt konto.
                  </p>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <PasswordField label="Nytt lösenord" value={password} onChange={setPassword} />
                  <PasswordField label="Bekräfta lösenord" value={confirmPassword} onChange={setConfirmPassword} />

                  {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

                  <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl text-sm font-semibold">
                    {isSubmitting ? "Sparar…" : "Spara nytt lösenord"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        {!done && (
          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Tillbaka till inloggning
          </Link>
        )}
      </div>
    </main>
  );
}
