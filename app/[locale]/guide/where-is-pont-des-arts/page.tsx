import Link from "next/link";
import { Header } from "@/components/home/header";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  return {
    title:
      "Where Is the Love Lock Bridge Paris? Pont des Arts Location + Google Maps",
    description:
      "Where is Pont des Arts (Love Lock Bridge Paris)? Get the exact location, Google Maps shortcut, best route, and why this bridge is the central point of Paris romance.",
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
  const mapsDirections = "https://www.google.com/maps/dir/?api=1&destination=Pont%20des%20Arts%2C%20Paris";

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
            You’re not looking for “a bridge.” You’re looking for <em>that</em> bridge —
            the one people call the <strong>Love Lock Bridge Paris</strong>,{" "}
            <strong>lock bridge Paris</strong>, or the <strong>bridge with locks in Paris</strong>.
            Here’s the exact location + the easiest way to get there.
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
          {/* LOCATION BLOCK */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl md:text-3xl font-serif font-extrabold">
              The exact location (simple answer)
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
                  What people search
                </div>
                <div className="mt-2 font-extrabold text-slate-900">
                  “Where is Pont des Arts?”
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Same as “Love Lock Bridge Paris location” or “bridge with locks Paris map”.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Quick map
                </div>
                <div className="mt-2 font-extrabold text-slate-900">
                  1-click access
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Use the buttons above to open Google Maps or directions instantly.
                </p>
              </div>
            </div>
          </section>

          {/* CENTRAL POINT */}
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-serif font-extrabold">
              Why this bridge feels like the “center point” of Paris
            </h2>
            <p>
              The Pont des Arts sits in a spot where Paris becomes easy.
              From here, everything romantic is “close enough to walk”:
              Louvre courtyards, Seine quays, Île de la Cité, Pont Neuf, Saint-Germain,
              sunset viewpoints, cafés, and photo spots.
            </p>
            <p>
              That’s why the <strong>Paris lock bridge</strong> became the symbol:
              not just because locks were there, but because this bridge is a crossroads of Paris.
              You can start here and build your entire day around it.
            </p>
          </section>

          {/* ROUTES */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-serif font-extrabold">
              Romantic routes (choose your mood)
            </h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 hover:bg-slate-100 transition">
                <div className="text-sm font-extrabold text-slate-900">
                  Route A — “Classic Paris”
                </div>
                <p className="mt-2 text-slate-700">
                  Louvre → Pont des Arts → Saint-Germain walk → café → Seine at sunset.
                  This is the route most people imagine when they search{" "}
                  <strong>love lock bridge paris</strong>.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 hover:bg-slate-100 transition">
                <div className="text-sm font-extrabold text-slate-900">
                  Route B — “Postcard photos”
                </div>
                <p className="mt-2 text-slate-700">
                  Pont des Arts → Pont Neuf → Île de la Cité → Notre-Dame area → back to the Seine.
                  Perfect if you searched <strong>bridge with locks in Paris</strong> for the view.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 hover:bg-slate-100 transition">
                <div className="text-sm font-extrabold text-slate-900">
                  Route C — “Quiet love”
                </div>
                <p className="mt-2 text-slate-700">
                  Early morning walk → Pont des Arts → calm Seine quays.
                  The bridge is almost silent, and it feels like Paris belongs to you.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white font-bold px-6 h-12 hover:bg-slate-800 transition-transform hover:scale-[1.02]"
              >
                Directions to Pont des Arts
              </a>

              <Link href="/guide/is-it-illegal-paris-locks">
                <Button className="bg-[#e11d48] hover:bg-[#be123c] font-bold rounded-full h-12 px-6 transition-transform hover:scale-[1.02]">
                  Is it illegal to put locks?
                </Button>
              </Link>
            </div>
          </section>

          {/* STORY + SEO */}
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-serif font-extrabold">
              The bridge with locks in Paris — what to expect today
            </h2>
            <p>
              Many people still call it the <strong>Love Lock Bridge</strong> or the{" "}
              <strong>love locks bridge Paris</strong>. The bridge is still open and still iconic.
              What changed is the physical lock tradition—removed to protect the monument.
            </p>
            <p>
              If you want the full narrative—from the first promise to what remains now—
              the main chapter is here:{" "}
              <Link
                href="/guide/love-lock-bridge-paris"
                className="text-[#e11d48] underline underline-offset-4 font-semibold"
              >
                Love Lock Bridge Paris (complete story)
              </Link>
              .
            </p>
          </section>

          {/* CTA */}
          <section className="rounded-3xl bg-slate-900 text-white p-10 relative overflow-hidden">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#e11d48]/25 blur-3xl" />
            <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

            <h2 className="relative z-10 text-3xl md:text-4xl font-serif font-extrabold">
              If you came here for love…
            </h2>
            <p className="relative z-10 mt-4 text-slate-200 text-lg leading-relaxed">
              This place is still the heart of a thousand stories. The Pont des Arts is the central point
              where Paris feels closest—where a simple walk becomes a memory.
            </p>

            <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/purchase">
                <Button className="bg-[#e11d48] hover:bg-[#be123c] font-bold rounded-full h-12 px-7 transition-transform hover:scale-[1.02]">
                  Create Love Lock Paris
                </Button>
              </Link>
              <a
                href={mapsPlace}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 h-12 text-sm font-bold text-white/90 hover:text-white hover:bg-white/5 transition-transform hover:scale-[1.02]"
              >
                Open Pont des Arts in Maps
              </a>
            </div>
          </section>

          {/* SEO soft footer */}
          <section className="text-sm text-slate-500 leading-relaxed">
            Related searches: <strong>where is Pont des Arts</strong>,{" "}
            <strong>love lock bridge location</strong>,{" "}
            <strong>lock bridge Paris location</strong>,{" "}
            <strong>bridge with locks Paris map</strong>,{" "}
            <strong>Paris lock bridge</strong>,{" "}
            <strong>Love Lock Bridge Paris</strong>,{" "}
            <strong>lock bridge in France</strong>,{" "}
            <strong>Love Lock Paris</strong>.
          </section>
        </article>
      </main>
    </div>
  );
}
