import ReportPageClient from "@/components/ReportPageClient";
import { Suspense } from "react";

const ReportFallback = () => {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 pb-16 pt-8 md:px-8 md:pt-10">
      <section className="rounded-2xl border border-line bg-panel/85 p-6 shadow-glow">
        <p className="text-sm text-textdim">Preparing report context...</p>
      </section>
    </main>
  );
};

export default function ReportPage() {
  return (
    <Suspense fallback={<ReportFallback />}>
      <ReportPageClient />
    </Suspense>
  );
}
