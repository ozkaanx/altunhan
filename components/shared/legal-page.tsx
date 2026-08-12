import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children:
    React.ReactNode;
};

export default function LegalPage({
  eyebrow,
  title,
  description,
  children,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-12 md:px-12 md:py-16 lg:px-16">
      <div className="mx-auto max-w-[850px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#626860]"
        >
          <ArrowLeft
            size={14}
          />

          Ana Sayfaya Dön
        </Link>

        <div className="mt-12 border-b border-[#DDD8CC] pb-10">
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A8754F]">
            {eyebrow}
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-[#263A2D] md:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-[650px] text-sm leading-7 text-[#686E67]">
            {description}
          </p>
        </div>

        <article className="space-y-9 py-10 text-sm leading-7 text-[#5E645D]">
          {children}
        </article>
      </div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-[#263A2D]">
        {title}
      </h2>

      <div className="mt-3 space-y-3">
        {children}
      </div>
    </section>
  );
}