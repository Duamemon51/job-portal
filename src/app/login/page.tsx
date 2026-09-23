"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Inloggningen misslyckades.");
      setIsSubmitting(false);
      return;
    }

    await refresh();
    const next = searchParams.get("next");
    router.push(next && next.startsWith("/app") ? next : "/app/dashboard");
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2 font-[Inter]">
      {/* LEFT PANEL */}
      <section className="relative hidden md:block overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
          alt="Arbetsplats med laptop och växt"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* RIGHT PANEL: FORM */}
      <section className="flex items-center justify-center px-6 py-16 bg-white">
        <div className="w-full max-w-sm">
          <div className="text-center md:hidden mb-8">
            <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#0B2D5C]">
              Hire<span className="text-[#2E7BF6]">Path</span>
            </span>
          </div>

          <div className="flex justify-end mb-8 text-sm text-[#7B93AF]">
            Inget konto?{" "}
            <a href="/register" className="text-[#2E7BF6] font-medium ml-1 hover:text-[#1f68dd]">
              Skapa ett
            </a>
          </div>

          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#0B2D5C] text-center">
            Välkommen tillbaka!
          </h1>
          <p className="text-sm text-[#7B93AF] text-center mt-2 leading-relaxed">
            Logga in för att fortsätta din jobbsökning där du slutade.
          </p>

          <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-[#152238]">E-postadress</label>
              <div className="mt-1.5 flex items-center gap-2 border border-[#DCE9FA] rounded-lg px-4 py-3 focus-within:border-[#2E7BF6] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="#9AAEC4" strokeWidth="1.8" className="w-4 h-4 shrink-0">
                  <path d="M3 6l9 7 9-7M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
                </svg>
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="namn@exempel.com"
                  className="flex-1 outline-none text-sm text-[#152238] placeholder:text-[#9AAEC4]"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#152238]">Lösenord</label>
              <div className="mt-1.5 flex items-center gap-2 border border-[#DCE9FA] rounded-lg px-4 py-3 focus-within:border-[#2E7BF6] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="#9AAEC4" strokeWidth="1.8" className="w-4 h-4 shrink-0">
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  name="password"
                  required
                  type="password"
                  placeholder="••••••••"
                  className="flex-1 outline-none text-sm text-[#152238] placeholder:text-[#9AAEC4]"
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="#9AAEC4" strokeWidth="1.8" className="w-4 h-4 shrink-0 cursor-pointer">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#4A6280] cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2E7BF6] rounded" />
                Kom ihåg mig
              </label>
              <a href="#" className="text-[#2E7BF6] hover:text-[#1f68dd] font-medium">
                Glömt lösenord?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#0B2D5C] text-white font-medium rounded-lg hover:bg-[#082249] transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Loggar in..." : "Logga in"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            {error && <p role="alert" className="text-sm text-red-600 text-center">{error}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}