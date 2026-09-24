"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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

export default function Register() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Konto kunde inte skapas.");
      setIsSubmitting(false);
      return;
    }

    await refresh();
    router.push("/app/dashboard");
  }

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {/* LEFT PANEL */}
      <section className="relative hidden overflow-hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
          alt="Arbetsplats med laptop och växt"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>

      {/* RIGHT PANEL: FORM */}
      <section className="relative flex items-center justify-center bg-background px-6 py-16">
        <Link
          href="/"
          className="absolute left-6 top-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Till startsidan
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center md:justify-start">
            <BrandMark />
          </div>

          <div className="flex justify-end mb-6 text-sm text-muted-foreground">
            Har du redan ett konto?{" "}
            <Link href="/login" className="ml-1 font-semibold text-primary hover:underline">
              Logga in
            </Link>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Skapa ditt konto</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Kostnadsfritt, klart på under två minuter.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Fullständigt namn</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="name"
                  required
                  type="text"
                  placeholder="Anna Andersson"
                  className="h-11 rounded-xl pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">E-postadress</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="email"
                  required
                  type="email"
                  placeholder="namn@exempel.com"
                  className="h-11 rounded-xl pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Lösenord</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Minst 8 tecken"
                  className="h-11 rounded-xl pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Dölj lösenord" : "Visa lösenord"}
                  className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded accent-primary" />
              <span>
                Jag godkänner{" "}
                <a href="#" className="font-medium text-primary hover:underline">
                  användarvillkoren
                </a>{" "}
                och{" "}
                <a href="#" className="font-medium text-primary hover:underline">
                  integritetspolicyn
                </a>
                .
              </span>
            </label>

            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full gap-2 rounded-xl text-sm font-semibold"
            >
              {isSubmitting ? "Skapar konto…" : "Skapa konto"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
