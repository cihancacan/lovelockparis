import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/home/header";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  return {
    title:
      "Love Lock Bridge Paris — Complete Love Story, History & What to Do Today",
    description:
      "The definitive romantic story of the Love Lock Bridge Paris. From love before the locks, to the Pont des Arts tradition, the ban, and the modern alternative.",
    keywords: [
      "love lock bridge",
      "love lock bridge paris",
      "lock bridge paris",
      "paris lock bridge",
      "bridge with locks in paris",
      "lock bridge in france",
      "love locks bridge paris",
      "locks bridge paris",
      "lock of love bridge",
      "french lock bridge",
      "love lock paris",
      "pont des arts",
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
      <section className="relative py-36 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/concept-value.jpg"
            alt="Love Lock Bridge Paris Pont des Arts"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />

        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold leading-tight">
            Love Lock Bridge Paris
            <span className="block text-emerald-400">
              a love story written across time
            </span>
          </h1>

          <p className="mt-8 text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            This is the complete story of the bridge with locks in Paris —
            from love before the locks, to the rise of the lock bridge Paris,
            to what remains today.
          </p>

          <div className="mt-12">
            <a
              href="#story"
              className="text-slate-300 hover:text-white underline underline-offset-4"
            >
              Begin the story
            </a>
          </div>
        </div>
      </section>

      {/* STORY */}
      <main id="story" className="container mx-auto px-4 py-24">
        <article className="mx-auto max-w-3xl space-y-24">

          {/* INTRO */}
          <section>
            <p className="text-3xl font-serif italic text-slate-800 leading-relaxed border-l-4 border-[#e11d48] pl-8">
              Long before anyone called it the Love Lock Bridge,
              before metal and promises crowded its railings,
              the Pont des Arts was already a bridge of love.
            </p>
          </section>

          {/* CHAPTER 1 */}
          <section>
            <h2 className="text-4xl font-serif font-extrabold">
              Chapter I — Before the locks, there was Paris
            </h2>

            <p className="mt-8 text-lg leading-relaxed">
              Paris did not wait for padlocks to become the city of love.
              Lovers have crossed the Pont des Arts for centuries,
              drawn not by a ritual but by a feeling.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              This pedestrian bridge, suspended between the Louvre
              and the Left Bank, has always invited people to slow down.
              Painters paused here. Musicians stopped here.
              Couples leaned against the railing,
              not to leave a mark, but to breathe together.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              If you follow the geography of romance in Paris,
              you inevitably arrive here.
              This is why so many travelers ask the same question:
              where exactly is the Pont des Arts,
              and why does it feel different from every other bridge?
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              The answer begins with place —
              <Link
                href="/guide/where-is-pont-des-arts"
                className="text-[#e11d48] underline underline-offset-4 font-semibold ml-1"
              >
                where the bridge stands between history and love
              </Link>
              .
            </p>
          </section>

          {/* CHAPTER 2 */}
          <section>
            <h2 className="text-4xl font-serif font-extrabold">
              Chapter II — The first promise (2008)
            </h2>

            <p className="mt-8 text-lg leading-relaxed">
              No one knows who placed the first lock.
              That is how true love stories begin —
              anonymously, without witnesses.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              Around 2008, a small metal padlock appeared on the bridge.
              Two names engraved.
              A date.
              A key thrown into the Seine.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              The gesture was simple.
              But Paris amplified it.
              And soon, the Pont des Arts began to change.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              Visitors started asking for the love lock bridge Paris.
              Guidebooks mentioned a strange new ritual.
              Photos spread.
              The lock bridge Paris was born.
            </p>
          </section>

          {/* CHAPTER 3 */}
          <section>
            <h2 className="text-4xl font-serif font-extrabold">
              Chapter III — When the world arrived (2010–2013)
            </h2>

            <p className="mt-8 text-lg leading-relaxed">
              Love multiplied.
              Locks multiplied faster.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              Couples came from everywhere.
              They searched for the bridge with locks in Paris,
              sometimes calling it the Paris lock bridge,
              sometimes the lock bridge in France.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              Different languages, same gesture.
              Write the names.
              Close the lock.
              Throw the key.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              By 2013, the bridge no longer looked like iron and wood.
              It shimmered.
              It glittered.
              It carried thousands of stories —
              and thousands of kilos of metal.
            </p>
          </section>

          {/* CHAPTER 4 */}
          <section>
            <h2 className="text-4xl font-serif font-extrabold">
              Chapter IV — The collapse (2014)
            </h2>

            <p className="mt-8 text-lg leading-relaxed">
              Love is light.
              Metal is not.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              In 2014, part of the railing collapsed under the weight.
              No tragedy.
              No victims.
              Just a warning.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              The city understood something essential:
              the lock of love bridge was no longer a symbol,
              it was a structural problem.
            </p>
          </section>

          {/* CHAPTER 5 */}
          <section>
            <h2 className="text-4xl font-serif font-extrabold">
              Chapter V — When love was banned (2015)
            </h2>

            <p className="mt-8 text-lg leading-relaxed">
              In 2015, the locks were removed.
              The railings replaced.
              Glass took the place of metal.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              Many visitors arrived with padlocks in their pockets,
              unaware that the ritual had changed.
              Some felt disappointed.
              Others confused.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              One question echoed again and again:
              is it really illegal now to place a lock?
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              The full explanation lives here —
              <Link
                href="/guide/is-it-illegal-paris-locks"
                className="text-[#e11d48] underline underline-offset-4 font-semibold"
              >
                why love locks are no longer allowed on the bridge
              </Link>
              .
            </p>
          </section>

          {/* CHAPTER 6 */}
          <section>
            <h2 className="text-4xl font-serif font-extrabold">
              Chapter VI — The silence years (2016–2022)
            </h2>

            <p className="mt-8 text-lg leading-relaxed">
              For years, the Pont des Arts felt like a memory of itself.
              Still beautiful.
              Still romantic.
              But missing something.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              People still searched online for the love locks bridge Paris.
              They still asked locals where the locks were.
              And they still stood here, unsure of what to do.
            </p>
          </section>

          {/* CHAPTER 7 */}
          <section>
            <h2 className="text-4xl font-serif font-extrabold">
              Chapter VII — Today: love without weight
            </h2>

            <p className="mt-8 text-lg leading-relaxed">
              Love did not disappear.
              It adapted.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              The modern Love Lock Bridge Paris is not about metal.
              It is about memory.
              About writing a name without breaking the bridge.
            </p>

            <p className="mt-4 text-lg leading-relaxed">
              Today, couples can still leave their mark —
              not with iron,
              but with a digital love lock,
              visible on the bridge through a new layer of reality.
            </p>
          </section>

          {/* EPILOGUE */}
          <section className="rounded-3xl bg-slate-900 text-white p-12">
            <h2 className="text-4xl font-serif font-extrabold">
              Epilogue — Paris always finds a way
            </h2>

            <p className="mt-8 text-lg text-slate-300 leading-relaxed">
              The bridge remains.
              The city remains.
              Love remains.
            </p>

            <p className="mt-4 text-lg text-slate-300 leading-relaxed">
              The Love Lock Bridge Paris is no longer a place of locks,
              but it is still a place of promises.
            </p>

            <div className="mt-10">
              <Link href="/purchase">
                <Button className="bg-[#e11d48] hover:bg-[#be123c] font-bold px-10 py-5 rounded-full text-lg">
                  Write your own chapter
                </Button>
              </Link>
            </div>
          </section>

        </article>
      </main>
    </div>
  );
}
