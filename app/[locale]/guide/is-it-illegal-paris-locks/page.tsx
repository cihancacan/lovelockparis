import Link from "next/link";
import { Header } from "@/components/home/header";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  return {
    title:
      "Is It Illegal to Put a Love Lock in Paris? Pont des Arts Lock Bridge Truth",
    description:
      "Is it illegal to put a love lock on the Pont des Arts in Paris? Learn what changed, why locks were removed, possible fines, and what couples can do today.",
    keywords: [
      "is it illegal paris locks",
      "lock bridge paris illegal",
      "love lock bridge paris illegal",
      "fine love lock paris",
      "pont des arts lock ban",
      "lock bridge paris law",
      "love locks bridge paris",
      "paris lock bridge",
      "bridge with locks in paris",
      "lock bridge in france",
      "lock of love bridge",
      "french lock bridge",
      "love lock paris",
    ],
  };
}

export default function Page() {
  const nav = {
    navBridge: "Bridge",
    problemHeading: "Problem",
    solutionHeading: "Solution",
    ctaStart: "Start",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header translations={nav as any} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-35">
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(225,29,72,.35),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,.25),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,.18),transparent_35%)]" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-24 relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-bold tracking-wider ring-1 ring-white/15">
            LOVE LOCK BRIDGE PARIS • LOCK BRIDGE PARIS • UPDATED
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-serif font-extrabold leading-tight">
            Is it illegal to put a{" "}
            <span className="text-emerald-400">love lock</span> in Paris?
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-200 leading-relaxed max-w-3xl">
            You arrive with a padlock in your pocket… and suddenly you hesitate.
            Because the <strong>Love Lock Bridge Paris</strong> is real, the bridge
            is real, but the rules changed. Here’s the truth—told like a story,
            not a lecture.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#answer"
              className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/15 ring-1 ring-white/15 px-6 h-12 text-sm font-bold transition-transform hover:scale-[1.02]"
            >
              The 20-second answer
            </a>
            <Link
              href="/guide/love-lock-bridge-paris"
              className="inline-flex items-center justify-center rounded-full bg-[#e11d48] hover:bg-[#be123c] px-6 h-12 text-sm font-bold transition-transform hover:scale-[1.02]"
            >
              Read the full Love Lock Bridge story
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-14">
        <article className="mx-auto max-w-3xl space-y-14">
          {/* QUICK ANSWER */}
          <section
            id="answer"
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-extrabold">
              The short answer
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              <strong>Yes.</strong> Placing a physical padlock on the{" "}
              <strong>Pont des Arts</strong> is not allowed today. That’s why
              people search <strong>“lock bridge paris illegal”</strong> and{" "}
              <strong>“is it illegal paris locks”</strong> before visiting the{" "}
              <strong>Paris lock bridge</strong>. Locks placed on railings,
              fences or nearby structures are typically removed.
            </p>

            <div className="mt-6 grid md:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  What changed
                </div>
                <div className="mt-2 font-extrabold text-slate-900">
                  The rails were replaced
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  The bridge is still there; the “lock railings” era is not.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Risk
                </div>
                <div className="mt-2 font-extrabold text-slate-900">
                  Fine / removal
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  In practice: locks disappear. In theory: enforcement can happen.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Today
                </div>
                <div className="mt-2 font-extrabold text-slate-900">
                  A modern alternative
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Couples keep the ritual without harming the monument.
                </p>
              </div>
            </div>
          </section>

          {/* STORY */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-serif font-extrabold">
              Why the “bridge with locks in Paris” became a problem
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              The <strong>Love Lock Bridge</strong> started as a whisper: a couple,
              a padlock, two names. But as the <strong>love locks bridge Paris</strong>{" "}
              phenomenon grew, metal accumulated. A bridge can’t carry infinite weight.
              Paris chose to protect the monument—so the tradition with physical locks ended.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              This is why searches like <strong>“fine love lock paris”</strong> exist:
              visitors want romance, but they don’t want trouble—and they don’t want their lock cut.
            </p>
          </section>

          {/* CENTRAL POINT */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-serif font-extrabold">
              Another reason it matters: Pont des Arts is a “center point” of Paris
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              The Pont des Arts sits right in the heart of the city. From here, you’re
              within walking distance of the Louvre, the Seine quays, Île de la Cité,
              and Saint-Germain. That central location is one reason the{" "}
              <strong>lock bridge in France</strong> became the world’s symbol of love.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/purchase">
                <Button className="bg-[#e11d48] hover:bg-[#be123c] font-bold rounded-full h-12 px-6 transition-transform hover:scale-[1.02]">
                  Create a legal love lock
                </Button>
              </Link>
              <Link
                href="/guide/where-is-pont-des-arts"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 h-12 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-transform hover:scale-[1.02]"
              >
                Where is Pont des Arts exactly?
              </Link>
            </div>
          </section>

          {/* SEO SOFT FOOTER */}
          <section className="text-sm text-slate-500 leading-relaxed">
            Related searches: <strong>lock bridge Paris illegal</strong>,{" "}
            <strong>is it illegal Paris locks</strong>,{" "}
            <strong>love lock bridge Paris illegal</strong>,{" "}
            <strong>fine love lock Paris</strong>,{" "}
            <strong>love locks bridge Paris</strong>,{" "}
            <strong>Paris lock bridge</strong>,{" "}
            <strong>bridge with locks in Paris</strong>,{" "}
            <strong>lock bridge in France</strong>,{" "}
            <strong>lock of love bridge</strong>,{" "}
            <strong>French lock bridge</strong>,{" "}
            <strong>Love Lock Paris</strong>.
          </section>
        </article>
      </main>
    </div>
  );
}
