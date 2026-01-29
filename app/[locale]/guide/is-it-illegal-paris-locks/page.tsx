import Link from "next/link";
import { Header } from "@/components/home/header";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  return {
    title:
      "Is It Illegal to Put a Love Lock in Paris? The Truth About the Lock Bridge",
    description:
      "Is it illegal to put a love lock on the Pont des Arts in Paris? Discover the true story behind the ban, the fines, and what couples can do today.",
    keywords: [
      "is it illegal paris locks",
      "lock bridge paris illegal",
      "love lock bridge paris illegal",
      "fine love lock paris",
      "pont des arts lock ban",
      "lock bridge paris law",
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

      <main className="container mx-auto px-4 py-24">
        <article className="mx-auto max-w-3xl space-y-20">

          {/* INTRO */}
          <section>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight">
              Is it illegal to put a love lock in Paris?
            </h1>

            <p className="mt-6 text-xl text-slate-700 leading-relaxed">
              It’s the question whispered on the Pont des Arts every single day.
              A couple stands still, a padlock hidden in a pocket,
              and the same doubt appears:
              <em> “Are we allowed to do this?”</em>
            </p>
          </section>

          {/* STORY */}
          <section>
            <p className="text-lg leading-relaxed text-slate-700">
              Years ago, no one asked.
              The <strong>love lock bridge Paris</strong> was a symbol of freedom,
              of spontaneous romance.
              People wrote names, closed the lock,
              and walked away smiling.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              But cities change.
              And when love leaves a physical mark,
              the city must protect itself.
            </p>
          </section>

          {/* LAW */}
          <section>
            <h2 className="text-3xl font-serif font-extrabold">
              When did it become illegal?
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              In 2015, Paris made a clear decision.
              After years of warnings,
              the city officially banned the placement of physical locks
              on the Pont des Arts and nearby structures.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              This is why today, attaching a padlock to the
              <strong> lock bridge Paris</strong> is considered vandalism.
              Locks placed on fences, lampposts, or railings are removed.
            </p>
          </section>

          {/* FINES */}
          <section>
            <h2 className="text-3xl font-serif font-extrabold">
              Do you get fined for placing a lock?
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              In theory, yes.
              The fine can reach several hundred euros.
              In practice, most locks are simply cut and removed.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              The result is always the same:
              the lock disappears.
              The promise is broken.
              The memory is lost.
            </p>
          </section>

          {/* CONTEXT */}
          <section>
            <p className="text-lg leading-relaxed text-slate-700">
              This is why the question “is it illegal?”
              keeps appearing in searches.
              People don’t want to break the law —
              they just want to keep a tradition alive.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              And to understand why this place matters so much,
              it helps to know exactly where it all happens —
              <Link
                href="/guide/where-is-pont-des-arts"
                className="text-[#e11d48] underline underline-offset-4 font-semibold ml-1"
              >
                on the Pont des Arts itself
              </Link>
              .
            </p>
          </section>

          {/* SOLUTION */}
          <section className="rounded-3xl bg-slate-900 text-white p-10">
            <h2 className="text-3xl font-serif font-extrabold">
              What couples do today
            </h2>

            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              Love didn’t stop in 2015.
              It simply found another way.
            </p>

            <p className="mt-4 text-lg text-slate-300 leading-relaxed">
              Instead of risking a fine or watching a lock get cut,
              couples now choose a weightless alternative:
              a digital love lock,
              visible on the bridge without damaging it.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/purchase">
                <Button className="bg-[#e11d48] hover:bg-[#be123c] font-bold px-8 py-4 rounded-full">
                  Create a legal love lock
                </Button>
              </Link>
              <Link
                href="/guide/love-lock-bridge-paris"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-bold text-white/90 hover:text-white hover:bg-white/5"
              >
                Read the full story
              </Link>
            </div>
          </section>

        </article>
      </main>
    </div>
  );
}
