import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/home/header";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  return {
    title:
      "Love Lock Bridge Paris (Pont des Arts) — The Full Story (2008 → Today)",
    description:
      "Discover the complete history of the Love Lock Bridge Paris: how the Pont des Arts became the lock bridge in Paris, why love locks were removed, what’s legal today, and the modern alternative.",
    keywords: [
      "love lock bridge",
      "lock bridge paris",
      "paris lock bridge",
      "love lock bridge paris",
      "bridge with locks in paris",
      "lock bridge in france",
      "love locks bridge paris",
      "lock bridge",
      "locks bridge paris",
      "bridge with locks paris",
      "lock of love bridge",
      "french lock bridge",
      "love lock paris",
    ],
  };
}

export default function Page() {
  // ⚠️ Remplace ce bloc par tes traductions si tu utilises next-intl.
  const nav = {
    navBridge: "Bridge",
    problemHeading: "Problem",
    solutionHeading: "Solution",
    ctaStart: "Start",
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header translations={nav as any} />

      {/* HERO */}
      <section className="relative py-24 md:py-32 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/concept-value.jpg"
            alt="Love Lock Bridge Paris — Pont des Arts lock bridge paris"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-bold tracking-wider ring-1 ring-white/15">
            UPDATED STORY • 2008 → TODAY
          </p>

          <h1 className="mt-6 text-4xl md:text-6xl font-serif font-extrabold leading-tight">
            Love Lock Bridge Paris:
            <span className="block text-emerald-400">
              the full story of the Lock Bridge Paris
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            If you searched <strong>love lock bridge</strong>,{" "}
            <strong>love lock bridge paris</strong>,{" "}
            <strong>lock bridge paris</strong> or{" "}
            <strong>bridge with locks in Paris</strong>, this is the guide that
            tells the truth—like a story you actually want to read.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/purchase">
              <Button
                size="lg"
                className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold px-8 py-6 text-lg rounded-full"
              >
                Create a Digital Love Lock
              </Button>
            </Link>
            <a
              href="#story"
              className="text-slate-300 hover:text-white underline underline-offset-4"
            >
              Read the story
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main id="story" className="container mx-auto px-4 py-14">
        <article className="mx-auto max-w-3xl">
          {/* INTRO */}
          <p className="text-xl md:text-2xl font-serif italic text-slate-800 border-l-4 border-[#e11d48] pl-6 py-2">
            Paris has always been the city of love. But one day, Paris discovered
            something unexpected:
            <span className="block mt-2">
              love can be heavy—too heavy for a bridge.
            </span>
          </p>

          {/* SECTION 1 */}
          <section className="mt-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Chapter I — The spark (2008–2010)
            </h2>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              Around 2008, a quiet ritual began on the <strong>Pont des Arts</strong>.
              A couple placed a small padlock on the railings, wrote two names,
              and walked away as if they had just hidden a secret in plain sight.
            </p>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              No one called it the <strong>Love Lock Bridge Paris</strong> yet.
              But the idea spread the way real romance spreads: without a plan,
              without permission, and with a strange certainty that it would
              last.
            </p>
          </section>

          {/* SECTION 2 */}
          <section className="mt-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Chapter II — The world arrives (2011–2013)
            </h2>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              By 2011, travelers from everywhere were looking for the{" "}
              <strong>lock bridge</strong> they had seen online. Guides began
              to describe the Pont des Arts as the{" "}
              <strong>lock bridge in France</strong>—the place where couples
              sealed a promise and tossed the key into the Seine.
            </p>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              The bridge changed appearance day after day, until people started
              calling it what it had become:{" "}
              <strong>the bridge with locks in Paris</strong>, the{" "}
              <strong>love locks bridge Paris</strong>, the{" "}
              <strong>locks bridge Paris</strong>. Different words, same dream.
            </p>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              In photos, it looked like gold. In reality, it was metal—thousands
              of small objects turning a delicate pedestrian bridge into a
              growing monument.
            </p>
          </section>

          {/* SECTION 3 */}
          <section className="mt-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Chapter III — The warning (2014)
            </h2>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              Then came 2014. A section of railing collapsed under the weight.
              In a single moment, the myth of the{" "}
              <strong>Lock of Love Bridge</strong> collided with reality.
            </p>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              The <strong>Paris lock bridge</strong> wasn’t just romantic
              anymore—it was a safety issue, a heritage issue, a city issue. The
              question was no longer “Isn’t this beautiful?” but “How long can
              this hold?”
            </p>
          </section>

          {/* SECTION 4 */}
          <section className="mt-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Chapter IV — The ban (2015)
            </h2>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              In 2015, the city acted. The lock-covered railings were removed.
              The message became clear: attaching physical padlocks on the Pont
              des Arts is not allowed. The bridge was protected with new panels,
              including glass.
            </p>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              And that’s why people still search for{" "}
              <strong>lock bridge Paris</strong> today and feel confused: the
              bridge remains, the romance remains, but the physical locks do
              not.
            </p>
          </section>

          {/* SECTION 5 */}
          <section className="mt-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Chapter V — The ghost years (2016–2023)
            </h2>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              For years after the removal, the Pont des Arts lived like a legend
              after its ending. People arrived with a lock, asked locals where
              the famous railings were, and realized they were too late.
            </p>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              Some tried nearby fences or lampposts. Those locks were cut too.
              The <strong>French lock bridge</strong> was no longer a place for
              metal. It was a place for memory.
            </p>
          </section>

          {/* SECTION 6 */}
          <section className="mt-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Chapter VI — Today: a tradition that evolves (2024–today)
            </h2>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              Paris doesn’t erase love. It transforms it. If the old ritual
              damaged the bridge, the modern ritual has to be weightless.
            </p>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              That’s the new chapter of the{" "}
              <strong>Love Lock Bridge Paris</strong>: a{" "}
              <strong>Love Lock Paris</strong> experience that keeps the symbol
              alive without destroying the monument. A lock you can create, keep
              forever, and see on the bridge through a digital layer—without
              metal, without rust, without removal.
            </p>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              The names are still written. The date still matters. The promise
              is still the promise. Only the material changed—because the city
              learned that love should last, and the bridge should too.
            </p>
          </section>

          {/* EPILOGUE */}
          <section className="mt-12 rounded-3xl bg-slate-900 text-white p-8 md:p-10 overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-10 -top-10 text-white">
                {/* decorative */}
              </div>
            </div>
            <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold">
              Epilogue — Leave your mark, legally
            </h2>
            <p className="relative z-10 mt-4 text-slate-200 text-lg leading-relaxed">
              If you came here looking for the{" "}
              <strong>love lock bridge</strong>, you found something better than
              an old railing: the real story—and the new way to keep it alive.
            </p>
            <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/purchase">
                <Button className="bg-[#e11d48] hover:bg-[#be123c] font-bold h-12 px-6 rounded-full">
                  Create my Digital Love Lock
                </Button>
              </Link>
              <a
                href="#story"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 h-12 text-sm font-bold text-white/90 hover:text-white hover:bg-white/5"
              >
                Re-read from the beginning
              </a>
            </div>
          </section>

          {/* NATURAL KEYWORD FOOTER (still readable, not spammy) */}
          <p className="mt-10 text-sm text-slate-500 leading-relaxed">
            People also call it: <strong>Lock Bridge Paris</strong>,{" "}
            <strong>Paris Lock Bridge</strong>,{" "}
            <strong>Love Lock Bridge Paris</strong>,{" "}
            <strong>Bridge with locks in Paris</strong>,{" "}
            <strong>Lock bridge in France</strong>,{" "}
            <strong>Love locks bridge Paris</strong>,{" "}
            <strong>Locks bridge Paris</strong>,{" "}
            <strong>Bridge with locks Paris</strong>,{" "}
            <strong>Lock of Love Bridge</strong>,{" "}
            <strong>French lock bridge</strong>,{" "}
            <strong>Love Lock Paris</strong>.
          </p>
        </article>
      </main>
    </div>
  );
}
