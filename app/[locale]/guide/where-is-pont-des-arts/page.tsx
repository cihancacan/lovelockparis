import Link from "next/link";
import { Header } from "@/components/home/header";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  return {
    title:
      "Where Is the Love Lock Bridge Paris? Pont des Arts Location + Google Maps",
    description:
      "Where is Pont des Arts (Love Lock Bridge Paris)? Get the exact location, Google Maps shortcut, directions, and why this bridge is a central point of Paris.",
    keywords: [
      "where is pont des arts",
      "pont des arts location",
      "love lock bridge location",
      "lock bridge paris location",
      "bridge with locks paris map",
      "paris lock bridge",
      "love lock bridge paris",
      "lock bridge in france",
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

  const mapsPlace = "https://www.google.com/maps?q=Pont+des+Arts,+Paris";
  const mapsDirections =
    "https://www.google.com/maps/dir/?api=1&destination=Pont%20des%20Arts%2C%20Paris";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header translations={nav as any} />

      {/* HERO */}
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-bold tracking-wider text-slate-700 border border-slate-200">
            WHERE IS PONT DES ARTS • LOVE LOCK BRIDGE PARIS • MAP
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-serif font-extrabold leading-tight">
            Where is the Love Lock Bridge in Paris?
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-700 leading-relaxed max-w-3xl">
            People search <strong>where is Pont des Arts</strong> because they’re
            not looking for “a bridge”. They’re looking for the{" "}
            <strong>Love Lock Bridge Paris</strong> — also called{" "}
            <strong>lock bridge Paris</strong> or the{" "}
            <strong>bridge with locks in Paris</strong>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={mapsPlace}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white font-bold px-6 h-12 hover:bg-slate-800 transition-transform hover:scale-[1.02]"
            >
              Open in Google Maps
            </a>
            <a
              href={mapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#e11d48] text-white font-bold px-6 h-12 hover:bg-[#be123c] transition-transform hover:scale-[1.02]"
            >
              Get directions
            </a>
            <Link
              href="/guide/love-lock-bridge-paris"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 h-12 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-transform hover:scale-[1.02]"
            >
              Read the full story
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-14">
        <article className="mx-auto max-w-3xl space-y-14">
          {/* LOCATION */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl md:text-3xl font-serif font-extrabold">
              Exact location (simple answer)
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              The <strong>Pont des Arts</strong> is a pedestrian bridge over the Seine.
              It connects the area near the <strong>Louvre Museum</strong> (right bank)
              to the <strong>Institut de France</strong> / Saint-Germain side (left bank).
              This is why it became the most famous <strong>lock bridge in France</strong>.
            </p>

            <div className="mt-6 grid md:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Quick map searches
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  People also search: <strong>love lock bridge location</strong>,{" "}
                  <strong>bridge with locks paris map</strong>,{" "}
                  <strong>lock bridge paris location</strong>.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  1-click access
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Use “Open in Google Maps” or “Get directions” above.
                </p>
              </div>
            </div>
          </section>

          {/* CENTRAL POINT */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl md:text-3xl font-serif font-extrabold">
              Why it’s also a “center point” of Paris
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              Pont des Arts sits in a place where Paris becomes walkable in every direction.
              From this bridge you can reach the Louvre, Seine river walks, Île de la Cité,
              Pont Neuf, and Saint-Germain quickly. That “central” position is one reason
              the <strong>Paris lock bridge</strong> became the world’s romantic reference.
            </p>
          </section>

          {/* INTERNAL LINKS */}
          <section className="bg-slate-900 text-white rounded-3xl p-8">
            <h2 className="text-2xl md:text-3xl font-serif font-extrabold">
              Two questions people ask right after “where is it?”
            </h2>

            <div className="mt-6 grid gap-3">
              <Link
                href="/guide/is-it-illegal-paris-locks"
                className="rounded-2xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 p-5 transition-transform hover:scale-[1.01]"
              >
                <div className="font-extrabold">Is it illegal to put locks in Paris?</div>
                <div className="mt-1 text-sm text-slate-200">
                  The truth about the lock bridge ban and what couples do today.
                </div>
              </Link>

              <Link
                href="/guide/love-lock-bridge-paris"
                className="rounded-2xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 p-5 transition-transform hover:scale-[1.01]"
              >
                <div className="font-extrabold">Why is it called the Love Lock Bridge Paris?</div>
                <div className="mt-1 text-sm text-slate-200">
                  The full story of the bridge with locks in Paris—from origin to today.
                </div>
              </Link>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#e11d48] hover:bg-[#be123c] font-bold h-12 px-6 transition-transform hover:scale-[1.02]"
              >
                Directions to Pont des Arts
              </a>
              <Link href="/purchase">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-full h-12 px-6 transition-transform hover:scale-[1.02]">
                  Create Love Lock Paris
                </Button>
              </Link>
            </div>
          </section>

          {/* SEO soft footer */}
          <section className="text-sm text-slate-500 leading-relaxed">
            Related searches: <strong>where is Pont des Arts</strong>,{" "}
            <strong>Pont des Arts location</strong>,{" "}
            <strong>love lock bridge location</strong>,{" "}
            <strong>bridge with locks paris map</strong>,{" "}
            <strong>lock bridge Paris location</strong>,{" "}
            <strong>Love Lock Bridge Paris</strong>,{" "}
            <strong>Paris lock bridge</strong>,{" "}
            <strong>lock bridge in France</strong>,{" "}
            <strong>Love Lock Paris</strong>.
          </section>
        </article>
      </main>
    </div>
  );
}
