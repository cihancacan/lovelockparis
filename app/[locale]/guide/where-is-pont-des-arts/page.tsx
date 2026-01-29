import Link from "next/link";
import { Header } from "@/components/home/header";

export async function generateMetadata() {
  return {
    title:
      "Where Is the Love Lock Bridge Paris? Pont des Arts Location Explained",
    description:
      "Where is the famous Love Lock Bridge Paris located? Discover the Pont des Arts, its exact position, and why lovers are drawn to this bridge.",
    keywords: [
      "where is pont des arts",
      "love lock bridge location",
      "bridge with locks paris map",
      "pont des arts paris location",
      "lock bridge paris location",
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

          <section>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold">
              Where is the Love Lock Bridge in Paris?
            </h1>

            <p className="mt-6 text-xl text-slate-700 leading-relaxed">
              People don’t search for the Pont des Arts by accident.
              They search for it because they feel drawn to something —
              even before they know where it is.
            </p>
          </section>

          <section>
            <p className="text-lg leading-relaxed text-slate-700">
              The bridge lies quietly between two worlds:
              the Louvre on one side,
              Saint-Germain-des-Prés on the other.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              It is a pedestrian bridge,
              light and open,
              designed not for speed but for pause.
              That is why it became the
              <strong> bridge with locks in Paris</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-extrabold">
              Why this bridge?
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              Lovers don’t choose the Pont des Arts because of a sign.
              They choose it because of what it connects.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              Art and life.
              History and youth.
              Silence and movement.
            </p>
          </section>

          <section>
            <p className="text-lg leading-relaxed text-slate-700">
              This is where the story of the
              <strong> love lock bridge Paris</strong> truly began.
              And it’s why people still arrive here,
              even after the locks are gone.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              To understand how the ritual started,
              how it ended,
              and what remains today,
              the full story continues here —
              <Link
                href="/guide/love-lock-bridge-paris"
                className="text-[#e11d48] underline underline-offset-4 font-semibold ml-1"
              >
                the complete Love Lock Bridge Paris story
              </Link>
              .
            </p>
          </section>

        </article>
      </main>
    </div>
  );
}
