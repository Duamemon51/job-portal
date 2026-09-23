"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            Har du redan ett konto?{" "}
            <a href="/login" className="text-[#2E7BF6] font-medium ml-1 hover:text-[#1f68dd]">
              Logga in
            </a>
          </div>

          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#0B2D5C] text-center">
            Skapa ditt konto
          </h1>
          <p className="text-sm text-[#7B93AF] text-center mt-2 leading-relaxed">
            Kostnadsfritt, klart på under två minuter.
          </p>

          <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-[#152238]">Fullständigt namn</label>
              <div className="mt-1.5 flex items-center gap-2 border border-[#DCE9FA] rounded-lg px-4 py-3 focus-within:border-[#2E7BF6] transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="#9AAEC4" strokeWidth="1.8" className="w-4 h-4 shrink-0">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
                <input
                  name="name"
                  required
                  type="text"
                  placeholder="Anna Andersson"
                  className="flex-1 outline-none text-sm text-[#152238] placeholder:text-[#9AAEC4]"
                />
              </div>
            </div>

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
                  placeholder="Minst 8 tecken"
                  className="flex-1 outline-none text-sm text-[#152238] placeholder:text-[#9AAEC4]"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-[#4A6280] cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-0.5 accent-[#2E7BF6] rounded" />
              <span>
                Jag godkänner{" "}
                <a href="#" className="text-[#2E7BF6] hover:text-[#1f68dd]">användarvillkoren</a>{" "}
                och{" "}
                <a href="#" className="text-[#2E7BF6] hover:text-[#1f68dd]">integritetspolicyn</a>.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#0B2D5C] text-white font-medium rounded-lg hover:bg-[#082249] transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Skapar konto..." : "Skapa konto"}
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