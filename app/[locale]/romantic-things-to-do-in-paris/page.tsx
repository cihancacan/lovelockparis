import Link from "next/link";
import { Header } from "@/components/home/header";

export async function generateMetadata() {
  return {
    title:
      "Romantic Things to Do in Paris: Best Couple Activities (Pont des Arts Area)",
    description:
      "Discover the best romantic things to do in Paris for couples. A high-density walking itinerary around Pont des Arts: Louvre, Seine views, Pont Neuf, Île de la Cité, Saint-Germain, sunset spots, cafés, photo moments, and more — with Google Maps links.",
    keywords: [
      "romantic things to do in paris",
      "things to do in paris for couples",
      "paris couple activities",
      "romantic places in paris",
      "romantic walk paris seine",
      "things to do near pont des arts",
      "activities around pont des arts",
      "pont des arts paris",
      "love lock bridge paris",
      "lock bridge paris",
      "bridge with locks in paris",
      "paris concierge service",
      "private concierge paris",
    ],
    openGraph: {
      title:
        "Romantic Things to Do in Paris: Couple Activities Around Pont des Arts",
      description:
        "A walking itinerary packed with romantic places and couple activities around Pont des Arts — with Maps links and the Love Lock Bridge story.",
      type: "article",
    },
  };
}

function MapsLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#e11d48] font-semibold underline underline-offset-4 hover:opacity-80"
    >
      {children}
    </a>
  );
}

function Card({
  title,
  time,
  vibe,
  maps,
  children,
}: {
  title: string;
  time: string;
  vibe: string;
  maps: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
            {time}
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-100">
            {vibe}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-serif font-extrabold text-slate-900">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-slate-700 leading-relaxed">{children}</p>

      <div className="mt-4">
        <MapsLink href={maps}>Open in Google Maps</MapsLink>
      </div>
    </div>
  );
}

export default function Page() {
  const nav = {
    navBridge: "Bridge",
    problemHeading: "Problem",
    solutionHeading: "Solution",
    ctaStart: "Start",
  };

  const maps = {
    pontDesArts: "https://www.google.com/maps?q=Pont+des+Arts,+Paris",
    courCarree: "https://www.google.com/maps?q=Cour+Carr%C3%A9e+du+Louvre,+Paris",
    tuileries: "https://www.google.com/maps?q=Jardin+des+Tuileries,+Paris",
    pontNeuf: "https://www.google.com/maps?q=Pont+Neuf,+Paris",
    placeDauphine: "https://www.google.com/maps?q=Place+Dauphine,+Paris",
    sainteChapelle: "https://www.google.com/maps?q=Sainte-Chapelle,+Paris",
    notreDame: "https://www.google.com/maps?q=Notre-Dame+de+Paris",
    squareDuVertGalant:
      "https://www.google.com/maps?q=Square+du+Vert-Galant,+Paris",
    museeOrsay: "https://www.google.com/maps?q=Mus%C3%A9e+d%27Orsay,+Paris",
    institutDeFrance:
      "https://www.google.com/maps?q=Institut+de+France,+Paris",
    saintGermain:
      "https://www.google.com/maps?q=Saint-Germain-des-Pr%C3%A9s,+Paris",
    pontAlexandre3:
      "https://www.google.com/maps?q=Pont+Alexandre+III,+Paris",
    palaisRoyal: "https://www.google.com/maps?q=Palais+Royal,+Paris",
    pontRoyal: "https://www.google.com/maps?q=Pont+Royal,+Paris",
    seineQuais: "https://www.google.com/maps?q=Quais+de+Seine,+Paris+centre",
  };

  const directionsToPont =
    "https://www.google.com/maps/dir/?api=1&destination=Pont%20des%20Arts%2C%20Paris";

  const directionsLoop =
    "https://www.google.com/maps/dir/?api=1&origin=Pont%20des%20Arts%2C%20Paris&destination=Pont%20des%20Arts%2C%20Paris&travelmode=walking&waypoints=Cour%20Carr%C3%A9e%20du%20Louvre%2C%20Paris%7CJardin%20des%20Tuileries%2C%20Paris%7CPont%20Neuf%2C%20Paris%7CPlace%20Dauphine%2C%20Paris%7CNotre-Dame%20de%20Paris%7CSainte-Chapelle%2C%20Paris%7CSaint-Germain-des-Pr%C3%A9s%2C%20Paris";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header translations={nav as any} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 opacity-70">
          <div className="h-full w-full bg-[radial-gradient(circle_at_15%_20%,rgba(225,29,72,.10),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(16,185,129,.10),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(59,130,246,.08),transparent_40%)]" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-24 max-w-6xl relative">
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold leading-tight">
            Romantic Things to Do in Paris
            <span className="block text-slate-700 text-2xl md:text-3xl font-sans font-semibold mt-3">
              A couple itinerary around Pont des Arts (everything is walkable)
            </span>
          </h1>

          <p className="mt-7 text-lg md:text-xl text-slate-700 leading-relaxed max-w-4xl">
            Start at <strong>Pont des Arts</strong>, follow the Seine, pass through iconic landmarks and
            hidden squares — and come back at sunset. This route is designed to feel effortless,
            romantic, and truly Paris.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={directionsToPont}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white font-bold px-7 h-12 hover:bg-slate-800 transition-transform hover:scale-[1.02]"
            >
              Directions to Pont des Arts
            </a>

            <a
              href={directionsLoop}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#e11d48] text-white font-bold px-7 h-12 hover:bg-[#be123c] transition-transform hover:scale-[1.02]"
            >
              Open the full walking loop (Maps)
            </a>

            <a
              href="#activities"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white font-bold text-slate-800 px-7 h-12 hover:bg-slate-50 transition-transform hover:scale-[1.02]"
            >
              Jump to activities
            </a>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <article className="mx-auto max-w-6xl space-y-16">
          {/* ACTIVITIES */}
          <section id="activities" className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-extrabold">
              The best romantic activities around Pont des Arts
            </h2>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card
                title="Pont des Arts — the famous Love Lock Bridge Paris"
                time="0 min"
                vibe="Iconic • River views"
                maps={maps.pontDesArts}
              >
                Begin on the bridge. It’s the perfect central point connecting the Louvre,
                the Left Bank, and the Seine — and the reason people still search
                “love lock bridge paris” and “lock bridge paris”.
              </Card>

              <Card
                title="Seine quays stroll (right next to the bridge)"
                time="1–2 min"
                vibe="Easy • Cinematic"
                maps={maps.seineQuais}
              >
                Walk along the river at your own pace. The reflections, the stone, the light —
                it’s the classic romantic walk in Paris.
              </Card>

              <Card
                title="Louvre inner courtyards (Cour Carrée)"
                time="2–3 min"
                vibe="Quiet • Monumental"
                maps={maps.courCarree}
              >
                A calm, beautiful place to slow down. Perfect for couples who want romantic Paris
                without rushing.
              </Card>

              <Card
                title="Palais Royal gardens (peaceful hidden calm)"
                time="6–8 min"
                vibe="Elegant • Peaceful"
                maps={maps.palaisRoyal}
              >
                Sit, talk, breathe. A small romantic pause that feels very “real Paris”.
              </Card>

              <Card
                title="Tuileries garden walk + benches"
                time="8–10 min"
                vibe="Open • Relaxing"
                maps={maps.tuileries}
              >
                A simple walk that feels like a movie at golden hour. Paris romance, effortless.
              </Card>

              <Card
                title="Pont Neuf + Place Dauphine (classic couple loop)"
                time="6–12 min"
                vibe="Historic • Intimate"
                maps={maps.pontNeuf}
              >
                Cross Pont Neuf, then disappear into Place Dauphine. It’s one of the best hidden couple moments
                in central Paris.
              </Card>

              <Card
                title="Sainte-Chapelle + Notre-Dame area (the “wow” stop)"
                time="12–18 min"
                vibe="Awe • Iconic"
                maps={maps.sainteChapelle}
              >
                If you want one unforgettable stop, choose this. A short walk from Pont des Arts.
              </Card>

              <Card
                title="Saint-Germain stroll (streets, cafés, atmosphere)"
                time="10–15 min"
                vibe="Parisian • Slow"
                maps={maps.saintGermain}
              >
                The perfect area to slow down and enjoy the day like Parisians do.
              </Card>

              <Card
                title="Musée d’Orsay (romantic museum date)"
                time="15–18 min"
                vibe="Art • Beautiful"
                maps={maps.museeOrsay}
              >
                A museum that feels like a date — and easy to reach on foot along the Seine.
              </Card>

              <Card
                title="Square du Vert-Galant (Seine tip island moment)"
                time="10–12 min"
                vibe="Secluded • Water"
                maps={maps.squareDuVertGalant}
              >
                A quiet place surrounded by water — one of the best spots to sit close and watch the city move.
              </Card>

              <Card
                title="Pont Alexandre III (optional photo moment)"
                time="35–45 min walk"
                vibe="Grand • Photos"
                maps={maps.pontAlexandre3}
              >
                If you have time and want a dramatic bridge scene, this is the famous “wow” spot.
              </Card>

              <Card
                title="Golden hour back on Pont des Arts"
                time="Best at sunset"
                vibe="Peak romance"
                maps={maps.pontDesArts}
              >
                Come back for sunset. The bridge changes with the light — it often becomes the highlight.
              </Card>
            </div>
          </section>

          {/* LOVE LOCK + INTERNAL LINKS */}
          <section className="rounded-3xl bg-slate-900 text-white p-10 shadow-lg">
            <h2 className="text-3xl font-serif font-extrabold">
              The Love Lock Bridge Paris story (and what to do today)
            </h2>

            <p className="mt-4 text-lg text-slate-200 leading-relaxed">
              People still search “love lock bridge paris”, “lock bridge paris”, and “bridge with locks in Paris”
              because the symbolism never disappeared.
            </p>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Link
                href="/guide/love-lock-bridge-paris"
                className="rounded-2xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 p-6 transition-transform hover:scale-[1.01]"
              >
                <div className="font-extrabold">Full history</div>
                <div className="mt-1 text-sm text-slate-200">
                  The complete story of the Love Lock Bridge.
                </div>
              </Link>

              <Link
                href="/guide/is-it-illegal-paris-locks"
                className="rounded-2xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 p-6 transition-transform hover:scale-[1.01]"
              >
                <div className="font-extrabold">Is it illegal?</div>
                <div className="mt-1 text-sm text-slate-200">
                  Clear answer and what changed.
                </div>
              </Link>

              <Link
                href="/guide/where-is-pont-des-arts"
                className="rounded-2xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 p-6 transition-transform hover:scale-[1.01]"
              >
                <div className="font-extrabold">Exact location</div>
                <div className="mt-1 text-sm text-slate-200">
                  Maps shortcuts + directions.
                </div>
              </Link>
            </div>

            <div className="mt-8">
              <Link
                href="/purchase"
                className="inline-flex items-center justify-center rounded-full bg-[#e11d48] hover:bg-[#be123c] px-8 h-12 font-bold transition-transform hover:scale-[1.02]"
              >
                Create a digital love lock
              </Link>
            </div>
          </section>

          {/* ✅ NEW: SOFT REDIRECT TO CONCIERGE */}
          <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <h2 className="text-3xl md:text-4xl font-serif font-extrabold">
                  Paris Concierge Service for Couples
                </h2>
                <p className="mt-4 text-lg text-slate-700 leading-relaxed">
                  Want the same romantic experience, but planned for you — discreetly and perfectly timed?
                  Our team curates couple moments in Paris: tables, secret routes, photo timing, and smooth reservations
                  around Pont des Arts and the Seine.
                </p>

                <ul className="mt-6 space-y-3 text-slate-700">
                  <li>• Romantic dinner reservations (no tourist traps)</li>
                  <li>• Secret couple walks designed by locals</li>
                  <li>• Night experience planning (discreet, curated)</li>
                  <li>• “One perfect Paris day” couple itinerary</li>
                </ul>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/paris-concierge-service"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white font-bold px-8 h-12 hover:bg-slate-800 transition-transform hover:scale-[1.02]"
                  >
                    Explore our Paris concierge service
                  </Link>

                  <Link
                    href="/paris-concierge-service#request"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white font-bold text-slate-800 px-8 h-12 hover:bg-slate-50 transition-transform hover:scale-[1.02]"
                  >
                    Request a couple plan
                  </Link>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Optional. This guide stays free for everyone.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-slate-900 text-white p-8 shadow-lg">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    LoveLockParis Romantic Concierge
                  </div>
                  <div className="mt-3 text-2xl font-extrabold font-serif">
                    A curated Paris experience — made for two.
                  </div>
                  <p className="mt-3 text-slate-200 leading-relaxed">
                    If you’re visiting for a honeymoon, anniversary, or proposal trip,
                    we’ll shape the day around your vibe — and keep it simple.
                  </p>

                  <div className="mt-6">
                    <Link
                      href="/paris-concierge-service"
                      className="inline-flex items-center justify-center rounded-full bg-[#e11d48] hover:bg-[#be123c] px-8 h-12 font-bold transition-transform hover:scale-[1.02] w-full"
                    >
                      Open concierge page
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
