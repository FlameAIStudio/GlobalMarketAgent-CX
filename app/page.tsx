import InputForm from "@/components/InputForm";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-16 pt-10 md:px-8 md:pt-14">
      <header className="animate-riseIn">
        <p className="inline-flex rounded-full border border-highlight/40 bg-highlight/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-highlight">
          Hackathon MVP
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-text md:text-6xl">
          Global Market Agent
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-textdim md:text-base">
          This is not just a chatbot. It is an AI agent that turns product ideas into
          actionable market intelligence and GTM strategy in seconds.
        </p>
      </header>

      <div className="mt-10 animate-riseIn [animation-delay:140ms]">
        <InputForm />
      </div>
    </main>
  );
}
