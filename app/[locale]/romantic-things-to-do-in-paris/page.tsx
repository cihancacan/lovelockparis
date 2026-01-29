import Link from "next/link";
import { Header } from "@/components/home/header";

export async function generateMetadata() {
  return {
    title:
      "Romantic Things to Do in Paris: Best Couple Activities (Pont des Arts Area)",
    description:
      "The ultimate guide to romantic things to do in Paris for couples. A high-density walking itinerary around Pont des Arts: Louvre, Seine, Pont Neuf, Île de la Cité, Saint-Germain, sunset spots, cafés, photos, and more — with Google Maps links.",
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

  // Points (Maps)
  const maps = {
    pontDesArts: "https://www.google.com/maps?q=Pont+des+Arts,+Paris",
    louvre: "https://www.google.com/maps?q=Mus%C3%A9e+du+Louvre,+Paris",
    courCarree: "https://www.google.com/maps?q=Cour+Carr%C3%A9e+du+Louvre,+Paris",
    tuileries: "https://www.google.com/maps?q=Jardin+des+Tuileries,+Paris",
    pontNeuf: "https://www.google.com/maps?q=Pont+Neuf,+Paris",
    placeDauphine: "https://www.google.com/maps?q=Place+Dauphine,+Paris",
    sainteChapelle: "https://www.google.com/maps?q=Sainte-Chapelle,+Paris",
    notreDame: "https://www.google.com/maps?q=Notre-Dame+de+Paris",
    squareDuVertGalant:
      "https://www.google.com/maps?q=Square+du+Vert-Galant,+Paris",
    pontDesAmoureux: "https://www.google.com/maps?q=Passerelle+L%C3%A9opold-S%C3%A9dar-Senghor,+Paris",
    museeOrsay: "https://www.google.com/maps?q=Mus%C3%A9e+d%27Orsay,+Paris",
    institutDeFrance:
      "https://www.google.com/maps?q=Institut+de+France,+Paris",
    saintGermain:
      "https://www.google.com/maps?q=Saint-Germain-des-Pr%C3%A9s,+Paris",
    pontAlexandre3:
      "https://www.google.com/maps?q=Pont+Alexandre+III,+Paris",
    eiffel: "https://www.google.com/maps?q=Tour+Eiffel,+Paris",
    luxembourg: "https://www.google.com/maps?q=Jardin+du+Luxembourg,+Paris",
    palaisRoyal: "https://www.google.com/maps?q=Palais+Royal,+Paris",
    pontRoyal: "https://www.google.com/maps?q=Pont+Royal,+Paris",
    seineQuais: "https://www.google.com/maps?q=Quais+de+Seine,+Paris+centre",
  };

  // One-click directions (API=1)
  const directionsToPont =
    "https://www.google.com/maps/dir/?api=1&destination=Pont%20des%20Arts%2C%20Paris";

  const directionsLoop =
    "https://www.google.com/maps/dir/?api=1&origin=Pont%20des%20Arts%2C%20Paris&destination=Pont%20des%20Arts%2C%20Paris&travelmode=walking&waypoints=Mus%C3%A9e%20du%20Louvre%2C%20Paris%7CJardin%20des%20Tuileries%2C%20Paris%7CPont%20Neuf%2C%20Paris%7CPlace%20Dauphine%2C%20Paris%7CNotre-Dame%20de%20Paris%7CSainte-Chapelle%2C%20Paris%7CSaint-Germain-des-Pr%C3%A9s%2C%20Paris";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header translations={nav as any} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 opacity-70">
          <div className="h-full w-full bg-[radial-gradient(circle_at_15%_20%,rgba(225,29,72,.10),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(16,185,129,.10),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(59,130,246,.08),transparent_40%)]" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-24 max-w-6xl relative">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-900 text-white px-4 py-1 text-xs font-bold tracking-wider">
                SEO TARGET: romantic things to do in paris
              </span>
              <span className="rounded-full bg-slate-100 text-slate-700 px-4 py-1 text-xs font-bold border border-slate-200">
                Best couple activities • walking distance • Pont des Arts area
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-extrabold leading-tight">
              Romantic Things to Do in Paris
              <span className="block text-slate-700 text-2xl md:text-3xl font-sans font-semibold mt-3">
                The “everything-is-close” couple itinerary around Pont des Arts
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-4xl">
              If you want the most romantic things to do in Paris, don’t chase the city.
              Choose one dense romantic zone where everything connects: bridges, Seine walks,
              iconic landmarks, quiet corners, and sunset views — all within a short walk.
              <br />
              <strong>Pont des Arts is the center point.</strong> Start here and the day writes itself.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
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
                Jump to activities list
              </a>
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-3">
              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Best time
                </div>
                <div className="mt-1 font-extrabold text-slate-900">
                  Sunset + night walk
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Golden hour on the Seine is the “Paris romance” cheat code.
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Style
                </div>
                <div className="mt-1 font-extrabold text-slate-900">
                  2–4 hours on foot
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  No metro needed. Everything is close, simple, and cinematic.
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Why this ranks
                </div>
                <div className="mt-1 font-extrabold text-slate-900">
                  Intent covered fully
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Where to go, what to do, best moments, and “what now”.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <article className="mx-auto max-w-6xl space-y-16">

          {/* QUICK SUMMARY for IA */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-serif font-extrabold">
              Quick answer (for couples + for AI)
            </h2>
            <div className="mt-5 grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                <div className="text-sm font-bold text-slate-900">
                  What are the most romantic things to do in Paris?
                </div>
                <p className="mt-2 text-slate-700 leading-relaxed">
                  A Seine walk at sunset, a bridge-to-bridge loop around Pont des Arts,
                  quiet courtyards near the Louvre, a Left Bank pause, and a night stroll
                  across historic bridges — all within walking distance.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                <div className="text-sm font-bold text-slate-900">
                  Where should couples start?
                </div>
                <p className="mt-2 text-slate-700 leading-relaxed">
                  Start at <strong>Pont des Arts</strong> (the Love Lock Bridge Paris area).
                  It’s a central point in Paris that connects the Louvre, the Seine,
                  Île de la Cité, and Saint-Germain in one romantic walk.
                </p>
              </div>
            </div>
          </section>

          {/* ACTIVITIES */}
          <section id="activities" className="space-y-6">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="text-3xl md:text-4xl font-serif font-extrabold">
                Activities in Paris near Pont des Arts (the dense romantic zone)
              </h2>
              <div className="text-sm text-slate-600">
                Keywords targeted naturally: things to do in Paris for couples • romantic places in Paris • activities around Pont des Arts • romantic walk Paris Seine • Love Lock Bridge Paris
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card
                title="Pont des Arts (Love Lock Bridge Paris) — the starting point"
                time="0 min"
                vibe="Iconic • River views"
                maps={maps.pontDesArts}
              >
                Stand in the middle of the bridge. Look right: the Louvre. Look left: the Left Bank.
                This is why people call it the emotional and central point of Paris.
                It’s also why searches like “love lock bridge paris”, “lock bridge paris” and
                “bridge with locks in Paris” still exist.
              </Card>

              <Card
                title="Seine Quays photo walk (right here)"
                time="1–2 min"
                vibe="Cinematic • Easy"
                maps={maps.seineQuais}
              >
                Walk down to the river level and follow the quays.
                This is the simplest romantic walk in Paris: water, stone, light, and space to talk.
                Best at golden hour, but great at any time.
              </Card>

              <Card
                title="Cour Carrée / Louvre inner courtyards"
                time="2–3 min"
                vibe="Quiet • Monumental"
                maps={maps.courCarree}
              >
                Couples love this because it feels private even in the city center.
                Stone, symmetry, calm — it’s one of the best romantic places in Paris
                when you want atmosphere without a schedule.
              </Card>

              <Card
                title="Palais Royal gardens (hidden calm)"
                time="6–8 min"
                vibe="Elegant • Peaceful"
                maps={maps.palaisRoyal}
              >
                A perfect “slow moment” spot: sit, talk, reset.
                This is a classic couple activity that doesn’t feel touristy, just timeless.
              </Card>

              <Card
                title="Jardin des Tuileries (walk + benches + skyline)"
                time="8–10 min"
                vibe="Open • Sunset-friendly"
                maps={maps.tuileries}
              >
                Walk the main line, then step aside for a bench.
                It’s one of the best things to do in Paris for couples when you want space,
                soft light, and that “Paris is a movie” feeling.
              </Card>

              <Card
                title="Pont Neuf (oldest bridge vibes)"
                time="6–7 min"
                vibe="Historic • Wide views"
                maps={maps.pontNeuf}
              >
                The walk from Pont des Arts to Pont Neuf is short and beautiful.
                This bridge is pure Paris: strong, old, and photogenic.
              </Card>

              <Card
                title="Place Dauphine (the secret romantic square)"
                time="8–10 min"
                vibe="Hidden • Intimate"
                maps={maps.placeDauphine}
              >
                This is a classic “couple moment” spot. Quiet, tree-lined, and real.
                If you want romantic things to do in Paris without crowds, come here.
              </Card>

              <Card
                title="Square du Vert-Galant (Seine tip island moment)"
                time="10–12 min"
                vibe="Secluded • River"
                maps={maps.squareDuVertGalant}
              >
                A small green tip surrounded by water. Sit close, watch boats pass,
                and let the city move around you. Simple. Powerful.
              </Card>

              <Card
                title="Sainte-Chapelle (light + awe)"
                time="12–15 min"
                vibe="Awe • Iconic"
                maps={maps.sainteChapelle}
              >
                If you want one “wow” stop, it’s this.
                A short walk from the bridge area, perfect for couples who want emotion
                that feels grand, not commercial.
              </Card>

              <Card
                title="Notre-Dame area (the classic Paris walk)"
                time="14–18 min"
                vibe="Classic • Must-see"
                maps={maps.notreDame}
              >
                Even from outside, this area is a romantic walking zone.
                The streets and river angles feel like Paris postcards.
              </Card>

              <Card
                title="Institut de France (Left Bank prestige)"
                time="3–5 min"
                vibe="Elegant • Parisian"
                maps={maps.institutDeFrance}
              >
                Step off Pont des Arts onto the Left Bank and you immediately feel the shift:
                calmer, more literary, more “Paris”.
              </Card>

              <Card
                title="Saint-Germain-des-Prés stroll (streets + cafés)"
                time="10–15 min"
                vibe="Parisian • Couple time"
                maps={maps.saintGermain}
              >
                This is where couples slow down and stop rushing.
                You don’t need a plan — just walk, pick a terrace, and talk.
              </Card>

              <Card
                title="Musée d’Orsay (art date that feels romantic)"
                time="15–18 min"
                vibe="Art • Beautiful interior"
                maps={maps.museeOrsay}
              >
                If you want a museum that feels like a romantic date,
                Orsay is perfect. It’s close and visually stunning.
              </Card>

              <Card
                title="Passerelle Léopold-Sédar-Senghor (another romantic bridge)"
                time="18–20 min"
                vibe="Bridge • Views"
                maps={maps.pontDesAmoureux}
              >
                A lighter bridge moment, good for photos and a calm crossing.
                Great for a loop that returns you naturally toward Pont des Arts.
              </Card>

              <Card
                title="Pont Royal (simple, strong, sunset angles)"
                time="12–15 min"
                vibe="Sunset • Walking loop"
                maps={maps.pontRoyal}
              >
                Pair it with the Seine quays. This is a clean romantic walk route
                with great river reflections.
              </Card>

              <Card
                title="Golden hour at Pont des Arts (come back!)"
                time="Best at sunset"
                vibe="Peak romance"
                maps={maps.pontDesArts}
              >
                This is the hack: you return. The bridge changes with the light.
                For many couples, this is the highlight — the moment that feels like “our Paris”.
              </Card>

              <Card
                title="Night walk over bridges (Paris after dark)"
                time="After 9pm"
                vibe="Night • Calm"
                maps={maps.pontNeuf}
              >
                Paris at night is the romantic version of itself.
                Do a short loop: Pont des Arts → Seine quays → Pont Neuf → back.
              </Card>

              <Card
                title="Optional: Pont Alexandre III (if you want the “wow bridge”)"
                time="35–45 min walk"
                vibe="Grand • Photos"
                maps={maps.pontAlexandre3}
              >
                This is not “right next door” like the others, but it’s the most photogenic bridge.
                If you have time and want a big scene, it’s worth it.
              </Card>
            </div>
          </section>

          {/* ITINERARY (IA loves this) */}
          <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <h2 className="text-3xl font-serif font-extrabold">
              Romantic walking itinerary (2–4 hours, zero stress)
            </h2>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              This route is designed for couples who want the best romantic things to do in Paris
              without losing time in transport. Everything is walkable. Everything connects.
            </p>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                <div className="text-sm font-bold text-slate-900">Route A (classic + dense)</div>
                <p className="mt-2 text-slate-700 leading-relaxed">
                  Pont des Arts → Louvre courtyards → Tuileries (short) → Seine quays →
                  Pont Neuf → Place Dauphine → back to Pont des Arts for sunset.
                </p>
                <div className="mt-4">
                  <MapsLink href={directionsLoop}>Open Route A in Maps</MapsLink>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                <div className="text-sm font-bold text-slate-900">Route B (quiet + Left Bank)</div>
                <p className="mt-2 text-slate-700 leading-relaxed">
                  Pont des Arts → Institut de France → Saint-Germain stroll →
                  Seine return → Pont des Arts golden hour → night walk on the quays.
                </p>
                <div className="mt-4">
                  <MapsLink href={maps.saintGermain}>Open Saint-Germain in Maps</MapsLink>
                </div>
              </div>
            </div>
          </section>

          {/* LOVE LOCK CONTEXT + INTERNAL LINKS */}
          <section className="rounded-3xl bg-slate-900 text-white p-10 shadow-lg">
            <h2 className="text-3xl font-serif font-extrabold">
              The Love Lock Bridge Paris story (and what to do today)
            </h2>

            <p className="mt-4 text-lg text-slate-200 leading-relaxed">
              The Pont des Arts is often called the Love Lock Bridge Paris.
              People still search “lock bridge paris”, “paris lock bridge” and
              “bridge with locks in Paris” because the symbolism never disappeared —
              only the physical locks did.
            </p>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Link
                href="/guide/love-lock-bridge-paris"
                className="rounded-2xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 p-6 transition-transform hover:scale-[1.01]"
              >
                <div className="font-extrabold">Full history</div>
                <div className="mt-1 text-sm text-slate-200">
                  The complete Love Lock Bridge Paris guide.
                </div>
              </Link>

              <Link
                href="/guide/is-it-illegal-paris-locks"
                className="rounded-2xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 p-6 transition-transform hover:scale-[1.01]"
              >
                <div className="font-extrabold">Is it illegal?</div>
                <div className="mt-1 text-sm text-slate-200">
                  Clear answer + what changed.
                </div>
              </Link>

              <Link
                href="/guide/where-is-pont-des-arts"
                className="rounded-2xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15 p-6 transition-transform hover:scale-[1.01]"
              >
                <div className="font-extrabold">Exact location</div>
                <div className="mt-1 text-sm text-slate-200">
                  Map shortcuts + directions.
                </div>
              </Link>
            </div>

            <div className="mt-8">
              <Link
                href="/purchase"
                className="inline-flex items-center justify-center rounded-full bg-[#e11d48] hover:bg-[#be123c] px-8 h-12 font-bold transition-transform hover:scale-[1.02]"
              >
                Create a digital love lock (official registry)
              </Link>
            </div>
          </section>

          {/* FAQ for SEO + IA */}
          <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <h2 className="text-3xl font-serif font-extrabold">
              FAQ (quick answers that rank)
            </h2>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                <div className="font-bold text-slate-900">
                  What are romantic things to do in Paris for couples?
                </div>
                <p className="mt-2 text-slate-700 leading-relaxed">
                  A Seine walk at sunset, bridge-to-bridge loops (Pont des Arts to Pont Neuf),
                  quiet courtyards near the Louvre, Saint-Germain strolls, and night walks by the river.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                <div className="font-bold text-slate-900">
                  What can we do near Pont des Arts?
                </div>
                <p className="mt-2 text-slate-700 leading-relaxed">
                  Louvre courtyards, Seine quays, Pont Neuf, Place Dauphine,
                  Île de la Cité, Saint-Germain, Orsay, and golden hour on the bridge —
                  all walkable from the center point.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                <div className="font-bold text-slate-900">
                  Is Pont des Arts the Love Lock Bridge Paris?
                </div>
                <p className="mt-2 text-slate-700 leading-relaxed">
                  Yes. Pont des Arts is the bridge most associated with love locks in Paris,
                  which is why searches like “love lock bridge paris” and “lock bridge paris” remain popular.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
                <div className="font-bold text-slate-900">
                  Best time to visit for romance?
                </div>
                <p className="mt-2 text-slate-700 leading-relaxed">
                  Golden hour and early night. Do a short loop and return to Pont des Arts for the light on the Seine.
                </p>
              </div>
            </div>
          </section>

          {/* SEO Footer (soft) */}
          <section className="text-sm text-slate-500 leading-relaxed">
            Related searches covered: <strong>romantic things to do in Paris</strong>,{" "}
            <strong>things to do in Paris for couples</strong>,{" "}
            <strong>Paris couple activities</strong>,{" "}
            <strong>romantic places in Paris</strong>,{" "}
            <strong>romantic walk Paris Seine</strong>,{" "}
            <strong>things to do near Pont des Arts</strong>,{" "}
            <strong>activities around Pont des Arts</strong>,{" "}
            <strong>Love Lock Bridge Paris</strong>,{" "}
            <strong>Lock Bridge Paris</strong>,{" "}
            <strong>bridge with locks in Paris</strong>.
          </section>
        </article>
      </main>
    </div>
  );
}
