import { Suspense } from "react";
import DocumentsView from "@/components/documents/DocumentsView";

export default function DocumentsPage() {
  return (
    <Suspense fallback={null}>
      <DocumentsView />
    </Suspense>
  );
}
