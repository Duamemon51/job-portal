"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Upload, Search, FileText, Download, Trash2, Paperclip } from "lucide-react";
import { useCurrentUser } from "@/context/AuthContext";
import { canUploadDocuments, canDelete } from "@/lib/role-access";
import { DOCUMENTS, DOCUMENT_CATEGORY_LABELS } from "@/lib/mock-data";
import type { DocumentCategory } from "@/lib/types";
import { usePagination } from "@/lib/use-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/ui/pagination-bar";

const CATEGORIES = Object.entries(DOCUMENT_CATEGORY_LABELS) as [DocumentCategory, string][];
const CATEGORY_KEYS = new Set(CATEGORIES.map(([key]) => key));

const CATEGORY_DESCRIPTIONS: Record<DocumentCategory, string> = {
  resumes: "CV:n och ansökningar från jobbsökande.",
  contracts: "Avtal kopplade till arbetsgivare och jobbsökande.",
  offer_letters: "Erbjudandebrev skickade till kandidater.",
  id_verification: "Legitimationshandlingar för identitetskontroll.",
  templates: "Mallar för dokument och kommunikation.",
};

function readCategory(value: string | null): DocumentCategory {
  return value && CATEGORY_KEYS.has(value as DocumentCategory) ? (value as DocumentCategory) : "resumes";
}

export default function DocumentsView() {
  const user = useCurrentUser();
  const mayUpload = canUploadDocuments(user);
  const mayDelete = canDelete(user);

  const searchParams = useSearchParams();
  const category = readCategory(searchParams.get("category"));

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DOCUMENTS.filter((d) => {
      if (d.category !== category) return false;
      if (!q) return true;
      return d.name.toLowerCase().includes(q) || d.owner.toLowerCase().includes(q);
    });
  }, [category, query]);

  const pager = usePagination(filtered, 10);

  return (
    <div className={`space-y-4 ${filtered.length > 10 ? "pb-20" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{DOCUMENT_CATEGORY_LABELS[category]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{CATEGORY_DESCRIPTIONS[category]}</p>
        </div>
        {mayUpload && (
          <Button>
            <Upload className="h-4 w-4" /> Ladda upp dokument
          </Button>
        )}
      </div>

      <div className="relative min-w-[240px] max-w-[420px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök dokument eller ägare..."
          className="pl-10"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Dokument</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Ägare</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Typ</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Storlek</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Uppladdad</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-right">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {pager.pageItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Paperclip className="h-8 w-8 text-muted-foreground/40" />
                    <span>Inga dokument i denna kategori</span>
                  </div>
                </td>
              </tr>
            ) : (
              pager.pageItems.map((d) => (
                <tr key={d.id} className="border-t border-border transition hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate max-w-[260px]" title={d.name}>{d.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{d.owner}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.fileType}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.size}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{d.uploadedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Ladda ner" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      {mayDelete && (
                        <Button variant="ghost" size="icon" title="Ta bort" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={pager.page}
        totalPages={pager.totalPages}
        onPageChange={pager.setPage}
        itemLabel={`${filtered.length} dokument`}
      />
    </div>
  );
}
