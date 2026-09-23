"use client";

import { useState } from "react";
import { Bell, Globe, Lock, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Section } from "@/components/ui/section";

const LANGUAGES = ["Svenska", "English"] as const;

function SettingRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} label={title} />
    </div>
  );
}

export default function InstallningarPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>("Svenska");

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <div className="text-base font-semibold">Inställningar</div>
        <div className="text-sm text-muted-foreground">Hantera notiser, språk och kontosäkerhet.</div>
      </div>

      <Section
        title="Notifikationer"
        desc="Välj hur du vill bli meddelad om aktivitet i portalen."
        icon={Bell}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      >
        <div className="divide-y divide-border">
          <SettingRow
            title="E-postaviseringar"
            description="Få e-post när en arbetsgivare eller jobbsökande uppdateras."
            checked={emailNotifs}
            onCheckedChange={setEmailNotifs}
          />
          <SettingRow
            title="SMS-aviseringar"
            description="Få SMS vid brådskande händelser."
            checked={smsNotifs}
            onCheckedChange={setSmsNotifs}
          />
          <SettingRow
            title="Veckosammanfattning"
            description="Ett samlat mejl varje måndag med senaste aktiviteten."
            checked={weeklyDigest}
            onCheckedChange={setWeeklyDigest}
          />
        </div>
      </Section>

      <Section
        title="Språk & region"
        desc="Språket som används i menyer och etiketter."
        icon={Globe}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      >
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                language === lang
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </Section>

      <Section
        title="Säkerhet"
        desc="Lösenord och inloggningsskydd för ditt konto."
        icon={Lock}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Lösenord</div>
              <div className="text-xs text-muted-foreground">Senast ändrat för 3 månader sedan</div>
            </div>
            <Button variant="outline" size="sm" disabled title="Demo-läge">
              Byt lösenord
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Tvåfaktorsautentisering</div>
              <div className="text-xs text-muted-foreground">Extra skydd vid inloggning</div>
            </div>
            <Button variant="outline" size="sm" disabled title="Demo-läge">
              Aktivera
            </Button>
          </div>
        </div>
      </Section>

      <Section
        title="Utseende"
        desc="Anpassa hur portalen ser ut för dig."
        icon={Palette}
        iconBg="bg-violet-50"
        iconColor="text-violet-600"
      >
        <p className="text-sm text-muted-foreground">
          Mörkt läge är inte tillgängligt ännu — hör av dig om det är viktigt för ditt team.
        </p>
      </Section>
    </div>
  );
}
