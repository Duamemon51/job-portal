"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Mail, Lock, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function BrandMark({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
        <Send className="h-4 w-4 -rotate-45" />
      </div>
      <span
        className={`text-base font-bold tracking-tight ${
          dark ? "text-white" : "text-foreground"
        }`}
      >
        Jobbportal
      </span>
    </Link>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
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
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Inloggningen misslyckades.");
      setIsSubmitting(false);
      return;
    }

    await refresh?.();
    router.push("/");
  }

  async function handleOAuth(provider: "google" | "microsoft" | "apple") {
    window.location.href = `/api/auth/${provider}`;
  }

  return (
    <main className="grid h-screen overflow-hidden bg-background md:grid-cols-2">
      {/* LEFT PANEL — image */}
      <section className="relative hidden overflow-hidden md:block md:h-screen">
        <img
          src="/login-page.png"
          alt="Jobbportal — automatiska jobbansökningar"
          className="absolute inset-0 h-full w-full object-cover object-left"
        />
      </section>

      {/* RIGHT PANEL — form */}
      <section className="flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex justify-center md:hidden">
            <BrandMark />
          </div>

          <div className="mb-2 flex items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center">
              <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                <defs>
                  <linearGradient id="planeGradient" x1="2" y1="20" x2="21" y2="3" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="55%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#planeGradient)"
                  d="M21.71 2.29a1 1 0 0 0-1.06-.23L2.35 8.9a1 1 0 0 0 .02 1.87l7.06 2.6 2.6 7.06a1 1 0 0 0 1.87.02l6.84-18.3a1 1 0 0 0-.23-1.06zM10.1 12.71 4.9 10.79l13.5-5.06zm3.19 6.31-1.92-5.2 8.63-8.64z"
                />
              </svg>
            </div>
            <span className="text-[2rem] font-bold leading-none tracking-[-0.04em] text-foreground">
              JobbAuto
            </span>
          </div>

          <div className="text-left">
            <h2 className="text-[2.05rem] font-semibold leading-none tracking-[-0.04em] text-foreground">
              Välkommen tillbaka
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Logga in på ditt konto för att fortsätta med din jobbsökning.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                E-postadress
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="email"
                  required
                  type="email"
                  placeholder="din@mail.se"
                  className="h-11 rounded-lg pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Lösenord
                </label>
                <Link
                  href="/glomt-losenord"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Har du glömt lösenordet?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Ange ditt lösenord"
                  className="h-11 rounded-lg pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Dölj lösenord" : "Visa lösenord"}
                  className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full gap-2 rounded-lg bg-indigo-600 text-sm font-semibold hover:bg-indigo-700"
            >
              {isSubmitting ? "Loggar in…" : "Logga in"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">
                eller fortsätt med
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-border text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <GoogleIcon className="h-4 w-4" />
              Fortsätt med Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("microsoft")}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-border text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <MicrosoftIcon className="h-4 w-4" />
              Fortsätt med Microsoft
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("apple")}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-border text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <AppleIcon className="h-4 w-4" />
              Fortsätt med Apple
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Har du inget konto?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Kom igång gratis →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.66-.22-2.44H12v4.62h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.94H1.27v3.1C3.24 21.3 7.29 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.31A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.58.38-2.31v-3.1H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.41l4.01-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0 7.29 0 3.24 2.7 1.27 6.59l4.01 3.1c.95-2.83 3.6-4.94 6.72-4.94z"
      />
    </svg>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 23" className={className} aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F35325" />
      <rect x="12" y="1" width="10" height="10" fill="#81BC06" />
      <rect x="1" y="12" width="10" height="10" fill="#05A6F0" />
      <rect x="12" y="12" width="10" height="10" fill="#FFBA08" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.365 1.43c0 1.14-.468 2.2-1.235 2.98-.87.9-2.3 1.6-3.51 1.51-.15-1.1.46-2.25 1.2-2.98.83-.83 2.3-1.5 3.54-1.51zM20.5 17.15c-.55 1.28-.82 1.86-1.53 2.98-1 1.57-2.42 3.52-4.18 3.53-1.55.02-1.95-1-4.05-1s-2.55.98-4.09 1.01c-1.73.03-3.05-1.68-4.05-3.25C.42 17.42-.27 13.2 1.22 10.3c.82-1.58 2.29-2.58 3.88-2.6 1.5-.02 2.9 1.02 3.82 1.02.92 0 2.62-1.26 4.42-1.08.75.03 2.88.3 4.24 2.27-3.44 1.9-2.88 6.86.92 8.24z" />
    </svg>
  );
}