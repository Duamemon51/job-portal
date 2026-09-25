"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Pencil, Camera, Mail, Phone, MapPin, CheckCircle2, Circle, Lightbulb, X } from "lucide-react";
import { useCurrentUser } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { cn } from "@/lib/utils";

const TIPS = [
  "Använd ett uppdaterat och tydligt CV",
  "Skriv ett personligt brev som kan anpassas",
  "Välj relevanta jobbkategorier",
  "Koppla din e-post för automatiska ansökningar",
];

export default function ProfilPage() {
  const user = useCurrentUser();

  const [summaryEditing, setSummaryEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title ?? "");

  const [form, setForm] = useState({
    firstName: user.name.split(" ")[0] ?? "",
    lastName: user.name.split(" ").slice(1).join(" "),
    email: user.email,
    phone: user.phone ?? "",
    address: "",
    postalCode: "",
    city: user.city ?? "",
    linkedin: "",
    portfolio: "",
  });
  const [bio, setBio] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [savedPulse, setSavedPulse] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function setField<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleAvatarFile(file: File) {
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(URL.createObjectURL(file));
  }

  const CHECKLIST = [
    { label: "Kontaktuppgifter ifyllda", done: Boolean(form.phone && form.city) },
    { label: "Om mig ifylld", done: bio.trim().length > 0 },
    { label: "LinkedIn tillagd", done: form.linkedin.trim().length > 0 },
    { label: "Portfolio tillagd", done: form.portfolio.trim().length > 0 },
    { label: "Profilsynlighet inställd", done: visible },
  ];
  const completedCount = CHECKLIST.filter((item) => item.done).length;
  const completionPct = Math.round((completedCount / CHECKLIST.length) * 100);

  useEffect(() => {
    if (!preview) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreview(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [preview]);

  function saveSummary() {
    setSummaryEditing(false);
    setSavedPulse(true);
    setTimeout(() => setSavedPulse(false), 1500);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-foreground">Min profil</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hantera din information och inställningar för automatiska jobbansökningar.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setPreview(true)}
          className="h-10 gap-2 rounded-xl border-indigo-200 text-indigo-500 hover:bg-indigo-50"
        >
          <Eye className="h-4 w-4" />
          Förhandsgranska profil
        </Button>
      </div>

      <ProfileTabs />

      {/* Profile summary card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarFile(file);
                  e.target.value = "";
                }}
              />
              <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-secondary text-lg font-bold text-secondary-foreground ring-4 ring-background">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button
                type="button"
                aria-label="Byt profilbild"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-0.5 -right-0.5 grid h-7 w-7 place-items-center rounded-full bg-indigo-500 text-white ring-2 ring-card transition hover:bg-indigo-600"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="min-w-0">
              {summaryEditing ? (
                <div className="space-y-1.5">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 max-w-[220px] rounded-lg text-base font-bold"
                  />
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Yrkestitel"
                    className="h-8 max-w-[220px] rounded-lg text-sm"
                  />
                </div>
              ) : (
                <>
                  <div className="text-xl font-bold text-foreground">{name}</div>
                  <div className="text-sm text-muted-foreground">{title || "Ingen titel angiven"}</div>
                </>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {form.email || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {form.phone || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {form.city || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedPulse && <span className="text-xs font-semibold text-emerald-600">Sparat</span>}
            <Button
              variant="outline"
              onClick={() => (summaryEditing ? saveSummary() : setSummaryEditing(true))}
              className="h-9 gap-1.5 rounded-xl border-indigo-200 text-indigo-500 hover:bg-indigo-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              {summaryEditing ? "Spara" : "Redigera profil"}
            </Button>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: forms */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4">
              <div className="text-base font-semibold text-foreground">Personlig information</div>
              <div className="text-sm text-muted-foreground">Denna information används i dina ansökningar.</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Förnamn</label>
                <Input
                  className="h-11 rounded-lg"
                  value={form.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Efternamn</label>
                <Input
                  className="h-11 rounded-lg"
                  value={form.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">E-post</label>
                <Input
                  type="email"
                  className="h-11 rounded-lg"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Telefonnummer</label>
                <Input
                  className="h-11 rounded-lg"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">Adress</label>
                <Input
                  className="h-11 rounded-lg"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Postnummer</label>
                <Input
                  className="h-11 rounded-lg"
                  value={form.postalCode}
                  onChange={(e) => setField("postalCode", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Ort</label>
                <Input
                  className="h-11 rounded-lg"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  LinkedIn <span className="font-normal text-muted-foreground">(valfritt)</span>
                </label>
                <Input
                  className="h-11 rounded-lg"
                  value={form.linkedin}
                  onChange={(e) => setField("linkedin", e.target.value)}
                  placeholder="https://www.linkedin.com/in/..."
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Portfolio / Hemsida <span className="font-normal text-muted-foreground">(valfritt)</span>
                </label>
                <Input
                  className="h-11 rounded-lg"
                  value={form.portfolio}
                  onChange={(e) => setField("portfolio", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4">
              <div className="text-base font-semibold text-foreground">Om mig</div>
              <div className="text-sm text-muted-foreground">
                En kort presentation som kan användas i dina ansökningar.
              </div>
            </div>
            <textarea
              value={bio}
              maxLength={500}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Berätta kort om din erfarenhet och vad du brinner för..."
              className="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="mt-1.5 text-right text-xs text-muted-foreground">{bio.length}/500</div>
          </div>
        </div>

        {/* RIGHT: status column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="text-base font-semibold text-foreground">Snabbstatus</div>
            <div
              className={cn(
                "mt-3 flex items-center gap-2 text-sm font-medium",
                completionPct === 100 ? "text-emerald-600" : "text-amber-600"
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", completionPct === 100 ? "bg-emerald-500" : "bg-amber-500")} />
              {completionPct === 100 ? "Profilen är komplett" : "Profilen är inte komplett än"}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${completionPct}%` }} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{completionPct}%</span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {CHECKLIST.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-foreground">
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  )}
                  <span className={item.done ? undefined : "text-muted-foreground"}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-100 text-indigo-500">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div className="text-base font-semibold text-indigo-900">Tips för en stark profil</div>
            </div>
            <ul className="mt-4 space-y-2.5">
              {TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2.5 text-sm text-indigo-950/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-foreground">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">Profilsynlighet</div>
                  <div className="text-sm text-muted-foreground">
                    Gör din profil synlig för rekryterare (valfritt)
                  </div>
                </div>
              </div>
              <Switch checked={visible} onCheckedChange={setVisible} label="Profilsynlighet" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Din profil kan visas för företag som aktivt söker kandidater.
            </p>
          </div>
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-6"
          onClick={() => setPreview(false)}
        >
          <div
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="text-base font-semibold text-foreground">Förhandsgranskning</div>
              <button
                type="button"
                onClick={() => setPreview(false)}
                aria-label="Stäng"
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary text-base font-bold text-secondary-foreground">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold text-foreground">{name}</div>
                <div className="text-sm text-muted-foreground">{title || "Ingen titel angiven"}</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {form.email || "—"}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {form.phone || "—"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {form.city || "—"}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Om mig</div>
              {bio.trim() ? (
                <p className="mt-1.5 text-sm text-foreground">{bio}</p>
              ) : (
                <p className="mt-1.5 text-xs italic text-muted-foreground">Ingen presentation tillagd ännu.</p>
              )}
            </div>

            {(form.linkedin || form.portfolio) && (
              <div className="mt-4 space-y-1 text-sm">
                {form.linkedin && (
                  <a href={form.linkedin} target="_blank" rel="noopener noreferrer" className="block truncate text-indigo-500 hover:underline">
                    {form.linkedin}
                  </a>
                )}
                {form.portfolio && (
                  <a href={form.portfolio} target="_blank" rel="noopener noreferrer" className="block truncate text-indigo-500 hover:underline">
                    {form.portfolio}
                  </a>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              {visible ? (
                <>
                  <Eye className="h-3.5 w-3.5 text-emerald-500" />
                  Synlig för rekryterare
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Inte synlig för rekryterare
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
