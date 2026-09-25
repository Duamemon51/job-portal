"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  UploadCloud,
  FileText,
  Plus,
  Trash2,
  Download,
  Eye,
  Pencil,
  Star,
  Link2,
  Maximize2,
  Lightbulb,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  X,
  Globe,
} from "lucide-react";
import { useCurrentUser } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { cn } from "@/lib/utils";

const TIPS = [
  "Håll CV:t kort och relevant (1–2 sidor)",
  "Anpassa innehållet efter jobbtitel",
  "Lyft fram relevanta projekt och resultat",
  "Använd en tydlig och professionell layout",
  "Spara som PDF för att behålla formateringen",
];

type DocCategory = "personbevis" | "betyg" | "certifikat" | "annat";

const CATEGORY_LABELS: Record<DocCategory, string> = {
  personbevis: "Personbevis",
  betyg: "Betyg",
  certifikat: "Certifikat",
  annat: "Annat",
};

const CATEGORY_STYLES: Record<DocCategory, string> = {
  personbevis: "bg-violet-50 text-violet-600",
  betyg: "bg-blue-50 text-blue-600",
  certifikat: "bg-amber-50 text-amber-700",
  annat: "bg-muted text-muted-foreground",
};

type LinkType = "github" | "linkedin" | "portfolio" | "other";

const LINK_LABELS: Record<LinkType, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  portfolio: "Portfolio / Hemsida",
  other: "Länk",
};

interface StoredFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  url: string;
}

interface CvVersion extends StoredFile {
  sublabel: string;
  status: "active" | "used";
}

interface OtherDoc extends StoredFile {
  category: DocCategory;
}

interface PortfolioLink {
  id: string;
  type: LinkType;
  url: string;
}

const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_ACCEPT = ".pdf,.doc,.docx";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const REGISTRATION_DOCS_KEY = "jobportal.registration.documents";

function GithubGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.35-3.88-1.35-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.77.12 3.06.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.28 5.68.42.36.78 1.08.78 2.18 0 1.57-.02 2.84-.02 3.23 0 .3.21.66.8.55A10.53 10.53 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

type IconComponent = (props: { className?: string }) => React.ReactNode;

const LINK_ICONS: Record<LinkType, IconComponent> = {
  github: GithubGlyph,
  linkedin: LinkedinGlyph,
  portfolio: Globe,
  other: Link2,
};

export default function CvDokumentPage() {
  const user = useCurrentUser();

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [addingLink, setAddingLink] = useState(false);
  const [newLink, setNewLink] = useState<{ type: LinkType; url: string }>({ type: "github", url: "" });

  const mainCvInputRef = useRef<HTMLInputElement>(null);
  const versionInputRef = useRef<HTMLInputElement>(null);
  const otherDocInputRef = useRef<HTMLInputElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);

  const [mainCv, setMainCv] = useState<StoredFile | null>(null);

  const [versions, setVersions] = useState<CvVersion[]>([]);

  const [otherDocs, setOtherDocs] = useState<OtherDoc[]>([]);

  const [links, setLinks] = useState<PortfolioLink[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(REGISTRATION_DOCS_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as {
        cvFileName?: string | null;
        letterFileName?: string | null;
        uploadedAt?: string | null;
      };

      if (parsed.cvFileName) {
        setMainCv({
          id: "registered-main",
          name: parsed.cvFileName,
          size: "Uppladdad under registrering",
          uploadedAt: parsed.uploadedAt ? new Date(parsed.uploadedAt).toISOString().slice(0, 10) : today(),
          url: "",
        });

        setVersions((current) => {
          if (current.some((version) => version.name === parsed.cvFileName)) return current;
          return [
            {
              id: "registered-main-version",
              name: parsed.cvFileName,
              sublabel: "Uppladdad under registrering",
              status: "active",
              size: "Uppladdad under registrering",
              uploadedAt: parsed.uploadedAt ? new Date(parsed.uploadedAt).toISOString().slice(0, 10) : today(),
              url: "",
            },
            ...current,
          ];
        });
      }

      if (parsed.letterFileName) {
        setOtherDocs((current) => {
          if (current.some((doc) => doc.name === parsed.letterFileName)) return current;
          return [
            {
              id: "registered-letter",
              name: parsed.letterFileName,
              size: "Uppladdad under registrering",
              uploadedAt: parsed.uploadedAt ? new Date(parsed.uploadedAt).toISOString().slice(0, 10) : today(),
              category: "annat",
              url: "",
            },
            ...current,
          ];
        });
      }
    } catch {
      // ignore malformed local storage data
    }
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFullscreen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  function validateCvFile(file: File): string | null {
    const ok = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!ok) return "Filen måste vara PDF, DOC eller DOCX.";
    if (file.size > MAX_CV_BYTES) return "Filen får vara max 5 MB.";
    return null;
  }

  function handleMainCvFile(file: File) {
    const err = validateCvFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (mainCv?.url) URL.revokeObjectURL(mainCv.url);
    setMainCv({ id: "main", name: file.name, size: formatSize(file.size), uploadedAt: today(), url: URL.createObjectURL(file) });
  }

  function handleAddVersion(file: File) {
    const err = validateCvFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setVersions((v) => [
      ...v,
      { id: uid(), name: file.name, sublabel: "Egen version", status: "used", size: formatSize(file.size), uploadedAt: today(), url: URL.createObjectURL(file) },
    ]);
  }

  function handleAddOtherDoc(file: File) {
    setOtherDocs((docs) => [
      ...docs,
      { id: uid(), name: file.name, size: formatSize(file.size), uploadedAt: today(), category: "annat", url: URL.createObjectURL(file) },
    ]);
  }

  function downloadFile(name: string, url: string) {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  }

  function setAsMainCv(version: CvVersion) {
    setVersions((vs) => vs.map((v) => ({ ...v, status: v.id === version.id ? "active" : "used" })));
    setMainCv({ id: "main", name: version.name, size: version.size, uploadedAt: version.uploadedAt, url: version.url });
  }

  function renameVersion(id: string, name: string) {
    setVersions((vs) => vs.map((v) => (v.id === id ? { ...v, name } : v)));
  }

  function removeVersion(id: string) {
    setVersions((vs) => vs.filter((v) => v.id !== id));
  }

  function removeOtherDoc(id: string) {
    setOtherDocs((docs) => docs.filter((d) => d.id !== id));
  }

  function setOtherDocCategory(id: string, category: DocCategory) {
    setOtherDocs((docs) => docs.map((d) => (d.id === id ? { ...d, category } : d)));
  }

  function removeLink(id: string) {
    setLinks((ls) => ls.filter((l) => l.id !== id));
  }

  function saveNewLink() {
    if (!newLink.url.trim()) return;
    setLinks((ls) => [...ls, { id: uid(), type: newLink.type, url: newLink.url.trim() }]);
    setNewLink({ type: "github", url: "" });
    setAddingLink(false);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/app/profil" className="hover:text-foreground hover:underline">
          Profil
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">CV &amp; dokument</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">CV &amp; dokument</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hantera dina dokument och välj hur de ska användas i dina automatiska ansökningar.
        </p>
      </div>

      <ProfileTabs />

      {/* Info banner */}
      {!bannerDismissed && (
        <div className="relative flex flex-wrap items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-indigo-500 shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-indigo-950">Ett bra CV ökar dina chanser</div>
            <p className="text-sm text-indigo-950/70">
              Ladda upp ditt CV i PDF eller Word-format. Du kan även skapa flera versioner för olika typer av jobb.
            </p>
          </div>
          <button
            type="button"
            onClick={() => tipsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50"
          >
            Tips och exempel
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            aria-label="Stäng"
            className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-lg text-indigo-400 transition hover:bg-white/60 hover:text-indigo-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-2">
          {/* Huvud-CV */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4">
              <div className="text-base font-semibold text-foreground">Huvud-CV</div>
              <div className="text-sm text-muted-foreground">
                Detta CV används som standard i dina automatiska ansökningar.
              </div>
            </div>

            <input
              ref={mainCvInputRef}
              type="file"
              accept={CV_ACCEPT}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMainCvFile(file);
                e.target.value = "";
              }}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => mainCvInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && mainCvInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleMainCvFile(file);
              }}
              className={cn(
                "grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
                dragActive ? "border-indigo-400 bg-indigo-50/60" : "border-border hover:border-indigo-300 hover:bg-muted/40"
              )}
            >
              <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-indigo-500">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div className="mt-3 text-sm font-semibold text-foreground">Dra och släpp ditt CV här</div>
              <div className="text-sm text-muted-foreground">eller klicka för att välja fil</div>
              <div className="mt-1 text-xs text-muted-foreground">PDF, DOC eller DOCX (max 5MB)</div>
            </div>

            {mainCv && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                <FileText className="h-5 w-5 shrink-0 text-indigo-500" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground">{mainCv.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {mainCv.size} · Uppladdad {mainCv.uploadedAt}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  Aktivt CV
                </span>
                <DropdownMenu
                  items={[
                    { label: "Ladda ner", icon: Download, onClick: () => downloadFile(mainCv.name, mainCv.url) },
                    { label: "Ta bort", icon: Trash2, destructive: true, onClick: () => setMainCv(null) },
                  ]}
                />
              </div>
            )}
          </div>

          {/* Flera CV-versioner */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-foreground">Flera CV-versioner</div>
                <div className="text-sm text-muted-foreground">
                  Skapa olika versioner av ditt CV för olika typer av jobb eller branscher.
                </div>
              </div>
              <input
                ref={versionInputRef}
                type="file"
                accept={CV_ACCEPT}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddVersion(file);
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                onClick={() => versionInputRef.current?.click()}
                className="h-9 shrink-0 gap-1.5 rounded-xl border-indigo-200 text-indigo-500 hover:bg-indigo-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Lägg till ny version
              </Button>
            </div>

            <ul className="space-y-2.5">
              {versions.map((version) => (
                <li key={version.id} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                  <FileText className="h-5 w-5 shrink-0 text-indigo-500" />
                  <div className="min-w-0 flex-1">
                    {renamingId === version.id ? (
                      <Input
                        autoFocus
                        defaultValue={version.name}
                        onBlur={(e) => {
                          renameVersion(version.id, e.target.value.trim() || version.name);
                          setRenamingId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        className="h-8 max-w-xs rounded-lg text-sm"
                      />
                    ) : (
                      <div className="truncate text-sm font-semibold text-foreground">{version.name}</div>
                    )}
                    <div className="truncate text-xs text-muted-foreground">{version.sublabel}</div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                      version.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {version.status === "active" ? "Aktiv" : "Använd"}
                  </span>
                  <DropdownMenu
                    items={[
                      ...(version.status !== "active"
                        ? [{ label: "Använd som huvud-CV", icon: Star, onClick: () => setAsMainCv(version) }]
                        : []),
                      { label: "Byt namn", icon: Pencil, onClick: () => setRenamingId(version.id) },
                      { label: "Ladda ner", icon: Download, onClick: () => downloadFile(version.name, version.url) },
                      { label: "Ta bort", icon: Trash2, destructive: true, onClick: () => removeVersion(version.id) },
                    ]}
                  />
                </li>
              ))}
              {versions.length === 0 && (
                <li className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  Inga CV-versioner ännu.
                </li>
              )}
            </ul>
          </div>

          {/* Andra dokument */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-foreground">Andra dokument</div>
                <div className="text-sm text-muted-foreground">
                  Ladda upp andra dokument som kan användas vid ansökningar, t.ex. betyg, certifikat eller portfolio.
                </div>
              </div>
              <input
                ref={otherDocInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddOtherDoc(file);
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                onClick={() => otherDocInputRef.current?.click()}
                className="h-9 shrink-0 gap-1.5 rounded-xl border-indigo-200 text-indigo-500 hover:bg-indigo-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Ladda upp dokument
              </Button>
            </div>

            <ul className="space-y-2.5">
              {otherDocs.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                  <FileText className="h-5 w-5 shrink-0 text-indigo-500" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-foreground">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {doc.size} · Uppladdad {doc.uploadedAt}
                    </div>
                  </div>
                  <select
                    value={doc.category}
                    onChange={(e) => setOtherDocCategory(doc.id, e.target.value as DocCategory)}
                    className={cn(
                      "shrink-0 rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none",
                      CATEGORY_STYLES[doc.category]
                    )}
                  >
                    {(Object.keys(CATEGORY_LABELS) as DocCategory[]).map((key) => (
                      <option key={key} value={key}>
                        {CATEGORY_LABELS[key]}
                      </option>
                    ))}
                  </select>
                  <DropdownMenu
                    items={[
                      { label: "Ladda ner", icon: Download, onClick: () => downloadFile(doc.name, doc.url) },
                      { label: "Ta bort", icon: Trash2, destructive: true, onClick: () => removeOtherDoc(doc.id) },
                    ]}
                  />
                </li>
              ))}
              {otherDocs.length === 0 && (
                <li className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  Inga dokument uppladdade ännu.
                </li>
              )}
            </ul>
          </div>

          {/* Portfolio / Länkar */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-foreground">Portfolio / Länkar</div>
                <div className="text-sm text-muted-foreground">
                  Lägg till länkar till din portfolio, GitHub, LinkedIn eller andra relevanta sidor.
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setAddingLink(true)}
                className="h-9 shrink-0 gap-1.5 rounded-xl border-indigo-200 text-indigo-500 hover:bg-indigo-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Lägg till länk
              </Button>
            </div>

            <ul className="space-y-2.5">
              {links.map((link) => {
                const Icon = LINK_ICONS[link.type];
                return (
                  <li key={link.id} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                    <Icon className="h-4.5 w-4.5 shrink-0 text-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-foreground">{LINK_LABELS[link.type]}</div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-xs text-muted-foreground hover:text-indigo-500 hover:underline"
                      >
                        {link.url}
                      </a>
                    </div>
                    <DropdownMenu items={[{ label: "Ta bort", icon: Trash2, destructive: true, onClick: () => removeLink(link.id) }]} />
                  </li>
                );
              })}

              {addingLink && (
                <li className="flex flex-wrap items-center gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 px-4 py-3">
                  <select
                    value={newLink.type}
                    onChange={(e) => setNewLink((l) => ({ ...l, type: e.target.value as LinkType }))}
                    className="h-9 shrink-0 rounded-lg border border-input bg-background px-2 text-sm outline-none"
                  >
                    {(Object.keys(LINK_LABELS) as LinkType[]).map((key) => (
                      <option key={key} value={key}>
                        {LINK_LABELS[key]}
                      </option>
                    ))}
                  </select>
                  <Input
                    autoFocus
                    placeholder="https://..."
                    value={newLink.url}
                    onChange={(e) => setNewLink((l) => ({ ...l, url: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && saveNewLink()}
                    className="h-9 min-w-[180px] flex-1 rounded-lg"
                  />
                  <Button onClick={saveNewLink} className="h-9 rounded-lg px-3 text-sm">
                    Spara
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAddingLink(false);
                      setNewLink({ type: "github", url: "" });
                    }}
                    className="h-9 rounded-lg px-3 text-sm"
                  >
                    Avbryt
                  </Button>
                </li>
              )}

              {links.length === 0 && !addingLink && (
                <li className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  Inga länkar tillagda ännu.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-base font-semibold text-foreground">Förhandsgranskning</div>
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-500 hover:underline"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Öppna i helskärm
              </button>
            </div>
            <CvPreview name={user.name} email={user.email} title={user.title} city={user.city} />
          </div>

          <div ref={tipsRef} className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-100 text-indigo-500">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div className="text-base font-semibold text-indigo-900">Tips för ett effektivt CV</div>
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
        </div>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-6"
          onClick={() => setFullscreen(false)}
        >
          <div
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="text-base font-semibold text-foreground">Förhandsgranskning</div>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Stäng"
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <CvPreview name={user.name} email={user.email} />
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonBar({ width }: { width: string }) {
  return <div className={cn("h-2 rounded-full bg-muted", width)} />;
}

function CvPreview({ name, email, title, city }: { name: string; email: string; title?: string | null; city?: string | null }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-lg font-bold text-foreground">{name}</div>
      <div className="text-sm text-muted-foreground italic">{title ?? "Ingen titel angiven"}</div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Mail className="h-3 w-3" />
          {email}
        </span>
        <span className="flex items-center gap-1">
          <Phone className="h-3 w-3" />
          {city ?? "—"}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {city ?? "—"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Kompetenser</div>
          <p className="mt-1.5 text-xs italic text-muted-foreground">Inga kompetenser tillagda ännu.</p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Om mig</div>
          <div className="mt-2 space-y-1.5">
            <SkeletonBar width="w-full" />
            <SkeletonBar width="w-full" />
            <SkeletonBar width="w-2/3" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Erfarenhet</div>
        <p className="mt-1.5 text-xs italic text-muted-foreground">Ingen arbetslivserfarenhet tillagd ännu.</p>
      </div>

      <div className="mt-4">
        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Utbildning</div>
        <p className="mt-1.5 text-xs italic text-muted-foreground">Ingen utbildning tillagd ännu.</p>
      </div>
    </div>
  );
}
