import Link from "next/link";
import { Header } from "@/components/home/header";

export async function generateMetadata() {
  return {
    title: "Romantic Things to Do in Paris: The Ultimate Guide for Couples",
    description:
      "Looking for romantic things to do in Paris? Discover the most romantic area of the city around the Pont des Arts: walks, landmarks, Seine views, history, and meaningful moments — all within walking distance.",
    keywords: [
      "romantic things to do in paris",
      "things to do in paris for couples",
      "romantic places in paris",
      "paris couple activities",
      "activities in paris near pont des arts",
      "things to do around pont des arts",
      "romantic walk paris seine",
      "love lock bridge paris",
      "pont des arts paris",
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
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-24 max-w-6xl">
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold leading-tight">
            Romantic Things to Do in Paris
          </h1>

          <p className="mt-8 text-xl text-slate-700 leading-relaxed max-w-4xl">
            Paris is not romantic because of one monument or one activity.
            It is romantic because of how everything connects.
            <br /><br />
            If you are looking for truly romantic things to do in Paris,
            there is one area where the city naturally slows down,
            where couples walk more closely,
            and where the Seine becomes part of the experience:
            <strong> the Pont des Arts area.</strong>
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-20">
        <article className="mx-auto max-w-4xl space-y-24">

          {/* WHY THIS AREA */}
          <section>
            <h2 className="text-3xl font-serif font-extrabold">
              Why the Pont des Arts area is the most romantic part of Paris
            </h2>

            <p className="mt-6 text-lg text-slate-700 leading-relaxed">
              Many visitors search for romantic places in Paris without realizing
              that the most meaningful experiences are concentrated in a very small radius.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              The Pont des Arts sits exactly between the Louvre,
              the Seine, and Saint-Germain-des-Prés.
              This location makes it one of the most central points in Paris —
              geographically, historically, and emotionally.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              Within a few minutes on foot,
              couples can experience walks, views, silence,
              history, and atmosphere without ever needing transport.
              This density is what makes the area unique.
            </p>
          </section>

          {/* ACTIVITY 1 */}
          <section>
            <h2 className="text-3xl font-serif font-extrabold">
              Start at the Pont des Arts — the heart of the city
            </h2>

            <p className="mt-6 text-lg text-slate-700 leading-relaxed">
              The Pont des Arts is a pedestrian bridge crossing the Seine,
              connecting the Louvre to the Left Bank.
              Standing here, Paris feels balanced.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              This bridge became internationally known as the
              <strong> Love Lock Bridge Paris</strong>,
              where couples once attached locks as a symbol of commitment.
              Even today, without physical locks,
              the bridge remains one of the most emotionally charged places in the city.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              For many couples, this is where a romantic walk in Paris naturally begins.
            </p>
          </section>

          {/* ACTIVITY 2 */}
          <section>
            <h2 className="text-3xl font-serif font-extrabold">
              Walk toward the Louvre courtyards (2–3 minutes)
            </h2>

            <p className="mt-6 text-lg text-slate-700 leading-relaxed">
              From the Pont des Arts, crossing toward the Louvre takes only a few minutes.
              Entering the inner courtyards creates an immediate contrast
              between the energy of the city and a quieter, almost private atmosphere.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              This is one of the simplest yet most romantic activities in Paris for couples:
              walking side by side, surrounded by history,
              without any pressure to visit or consume.
            </p>
          </section>

          {/* ACTIVITY 3 */}
          <section>
            <h2 className="text-3xl font-serif font-extrabold">
              Follow the Seine toward Pont Neuf (5 minutes)
            </h2>

            <p className="mt-6 text-lg text-slate-700 leading-relaxed">
              Walking along the Seine is one of the most searched
              romantic things to do in Paris — and for good reason.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              From the Pont des Arts, the riverside paths lead naturally toward Pont Neuf.
              Benches, stone steps, and open views allow couples to slow down,
              talk, and watch the city move at a distance.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              This short walk is often described as one of the most intimate
              Paris couple activities in the city center.
            </p>
          </section>

          {/* ACTIVITY 4 */}
          <section>
            <h2 className="text-3xl font-serif font-extrabold">
              Pause on the Left Bank (5–7 minutes)
            </h2>

            <p className="mt-6 text-lg text-slate-700 leading-relaxed">
              On the Left Bank side, small streets and cafés naturally invite pauses.
              This area near Saint-Germain-des-Prés is known for conversations,
              not schedules.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              For couples, these moments of pause often become
              the most memorable part of the day —
              not an attraction, but a shared moment.
            </p>
          </section>

          {/* ACTIVITY 5 */}
          <section>
            <h2 className="text-3xl font-serif font-extrabold">
              Return to the bridge at golden hour
            </h2>

            <p className="mt-6 text-lg text-slate-700 leading-relaxed">
              One of the most powerful activities around the Pont des Arts
              is simply coming back.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              As the sun lowers, the Seine reflects light,
              the Louvre softens in color,
              and the bridge feels completely different from earlier in the day.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              Many couples describe this moment as the emotional peak
              of their romantic walk in Paris.
            </p>
          </section>

          {/* HISTORY + LINKS */}
          <section className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
            <h2 className="text-3xl font-serif font-extrabold">
              Love, history, and symbolism of the Pont des Arts
            </h2>

            <p className="mt-6 text-lg text-slate-700 leading-relaxed">
              The history of love locks on the Pont des Arts
              explains why this bridge continues to attract couples today.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              Understanding what changed — and why —
              helps visitors experience the bridge with respect
              for both the city and its meaning.
            </p>

            <div className="mt-8 space-y-4">
              <Link
                href="/guide/love-lock-bridge-paris"
                className="block text-[#e11d48] underline underline-offset-4 font-semibold"
              >
                → The complete story of the Love Lock Bridge Paris
              </Link>

              <Link
                href="/guide/is-it-illegal-paris-locks"
                className="block text-[#e11d48] underline underline-offset-4 font-semibold"
              >
                → Is it still illegal to place a love lock in Paris?
              </Link>

              <Link
                href="/guide/where-is-pont-des-arts"
                className="block text-[#e11d48] underline underline-offset-4 font-semibold"
              >
                → Where exactly is the Pont des Arts located?
              </Link>
            </div>
          </section>

          {/* CONCLUSION */}
          <section>
            <p className="text-lg text-slate-700 leading-relaxed">
              Romantic things to do in Paris are not about doing more.
              They are about choosing the right place.
            </p>

            <p className="mt-4 text-lg text-slate-700 leading-relaxed">
              Around the Pont des Arts, everything is already there.
              You just have to walk.
            </p>
          </section>

        </article>
      </main>
    </div>
  );
}
