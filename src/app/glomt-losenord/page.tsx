"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Info, KeyRound, Mail } from "lucide-react";
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

export default function GlomtLosenord() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.message ?? "Något gick fel.");
      return;
    }

    setResetUrl(data.resetUrl ?? null);
    setSubmitted(true);
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-12">
      {/* Soft brand-colored décor, kept subtle behind the card */}
      <div
        className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--sidebar-gradient)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--sidebar-gradient)" }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <BrandMark />
        </div>

        <Card className="border-border/70 shadow-xl shadow-primary/5">
          <CardContent className="pt-7 pb-6">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-xl font-semibold tracking-tight">Glömt lösenord?</h1>
              <p className="mt-1.5 max-w-[26ch] text-sm text-muted-foreground">
                Ange din e-postadress så hjälper vi dig att återställa lösenordet.
              </p>
            </div>

            {submitted ? (
              <div className="mt-6 space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Om det finns ett konto med den e-postadressen kan du återställa lösenordet via länken nedan.
                </p>
                {resetUrl ? (
                  <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 space-y-1.5">
                      <p className="text-xs font-medium text-foreground">
                        Demo-läge: ingen e-post är konfigurerad, så länken visas direkt här istället.
                      </p>
                      <Link
                        href={resetUrl.replace(/^https?:\/\/[^/]+/, "")}
                        className="inline-block break-all text-sm font-semibold text-primary hover:underline"
                      >
                        Fortsätt till återställning →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Hittar du inget konto med den adressen? Dubbelkolla stavningen och försök igen.
                  </p>
                )}
                <Button variant="outline" className="h-10 w-full rounded-xl" onClick={() => setSubmitted(false)}>
                  Skicka igen
                </Button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">E-postadress</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="namn@exempel.com"
                      className="h-11 rounded-xl pl-9"
                    />
                  </div>
                </div>

                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

                <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl text-sm font-semibold">
                  {isSubmitting ? "Skickar…" : "Skicka återställningslänk"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Tillbaka till inloggning
        </Link>
      </div>
    </main>
  );
}
