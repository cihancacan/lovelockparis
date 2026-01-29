import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/home/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  ShieldAlert,
  Smartphone,
  ArrowRight,
  History,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Lock,
  Heart,
  Info,
} from "lucide-react";

// ✅ Fix Badge (si tu n'utilises pas shadcn badge)
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wider text-white ring-1 ring-white/15">
      {children}
    </span>
  );
}

// --- SEO MAXIMISÉ ---
export async function generateMetadata() {
  return {
    title:
      "Love Lock Bridge Paris (Pont des Arts) — Lock Bridge Paris Guide (2026) + Legal Alternative",
    description:
      "Looking for the Love Lock Bridge Paris? Discover the true story of the Pont des Arts lock bridge: history (2008–2014), collapse, 2015 ban, where it is, and the legal digital love lock alternative in 2026.",
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
      "pont des arts",
      "pont des arts locks",
      "virtual love lock paris",
      "digital love lock",
    ],
    openGraph: {
      type: "article",
      title:
        "Love Lock Bridge Paris (Pont des Arts): History, Ban, Location & 2026 Update",
      description:
        "The definitive IA-friendly guide to the lock bridge in Paris: what happened, why locks were removed, and what to do today.",
      images: ["https://lovelockparis.com/images/concept-value.jpg"],
    },
  };
}

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  const navT = await getTranslations("home");

  const canonicalUrl = `https://lovelockparis.com/${locale}/guide/love-lock-bridge-paris`;

  // ✅ JSON-LD (Article + FAQ + Breadcrumb) = IA & Google friendly
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://lovelockparis.com/${locale}` },
          { "@type": "ListItem", "position": 2, "name": "Guide", "item": `https://lovelockparis.com/${locale}/guide` },
          { "@type": "ListItem", "position": 3, "name": "Love Lock Bridge Paris", "item": canonicalUrl },
        ],
      },
      {
        "@type": "Article",
        "headline": "Love Lock Bridge Paris (Pont des Arts): The Complete Guide (2026 Update)",
        "datePublished": "2024-02-01",
        "dateModified": "2026-01-29",
        "author": { "@type": "Organization", "name": "LoveLockParis" },
        "publisher": { "@type": "Organization", "name": "LoveLockParis" },
        "mainEntityOfPage": canonicalUrl,
        "image": "https://lovelockparis.com/images/concept-value.jpg",
        "about": [
          "Love Lock Bridge",
          "Lock Bridge Paris",
          "Paris Lock Bridge",
          "Bridge with locks in Paris",
          "Lock bridge in France",
          "Pont des Arts",
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where is the Love Lock Bridge in Paris?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "The famous Love Lock Bridge Paris refers to the Pont des Arts, a pedestrian bridge linking the Institut de France to the Louvre Museum (6th arrondissement).",
            },
          },
          {
            "@type": "Question",
            "name": "Can you still put locks on the Pont des Arts in 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "No. Since 2015, placing physical love locks on the Pont des Arts is banned and removed. The legal alternative is a digital/virtual love lock experience.",
            },
          },
          {
            "@type": "Question",
            "name": "Why were the love locks removed from the lock bridge in Paris?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Because of safety and heritage protection: the weight of metal locks damaged the bridge and a railing section collapsed in 2014, leading to removal and replacement with glass panels.",
            },
          },
        ],
      },
    ],
  };

  // ✅ Mini table des matières IA-friendly + UX
  const toc = [
    { id: "quick", label: "Quick answer (2026)" },
    { id: "where", label: "Where is the Lock Bridge Paris?" },
    { id: "history", label: "History: Love Locks Bridge Paris (2008–2014)" },
    { id: "collapse", label: "2014 collapse: bridge with locks Paris" },
    { id: "ban", label: "2015 ban: is it illegal?" },
    { id: "today", label: "What to do in 2026 (legal alternative)" },
    { id: "tips", label: "Visitor tips (metro, photos, route)" },
    { id: "faq", label: "FAQ (IA answers)" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header
        translations={{
          navBridge: navT("nav.bridge"),
          problemHeading: navT("problem.heading"),
          solutionHeading: navT("solution.heading"),
          ctaStart: navT("cta.start"),
        }}
      />

      <main>
        {/* HERO */}
        <section className="relative py-28 md:py-32 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/images/concept-value.jpg"
              alt="Love Lock Bridge Paris (Pont des Arts) — lock bridge paris guide"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
            <div className="flex justify-center gap-2 mb-6">
              <Badge>
                <span className="inline-flex items-center gap-2">
                  <History size={14} />
                  UPDATED FOR 2026
                </span>
              </Badge>
              <Badge>
                <span className="inline-flex items-center gap-2">
                  <ShieldAlert size={14} />
                  PHYSICAL LOCKS BANNED
                </span>
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-extrabold leading-tight mb-6">
              Love Lock Bridge Paris: the truth about the{" "}
              <span className="text-emerald-400">Lock Bridge Paris</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10">
              The definitive IA-friendly guide to the <strong>Paris Lock Bridge</strong> (Pont des Arts):
              where it is, what happened to the <strong>bridge with locks in Paris</strong>, why the locks were removed,
              and what you can do today — legally — in 2026.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={`/${locale}/purchase`}>
                <Button
                  size="lg"
                  className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold px-8 py-6 text-lg rounded-full"
                >
                  Create a Digital Love Lock <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="#quick" className="text-slate-300 hover:text-white underline underline-offset-4">
                Read the 30-second answer
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-14 grid lg:grid-cols-12 gap-10">
          {/* ARTICLE */}
          <article className="lg:col-span-8 prose prose-lg prose-slate max-w-none">
            {/* TOC */}
            <div className="not-prose bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-10">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-3">
                <Info size={18} /> Table of contents (IA-friendly)
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {toc.map((x) => (
                  <a
                    key={x.id}
                    href={`#${x.id}`}
                    className="rounded-lg px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 no-underline"
                  >
                    {x.label}
                  </a>
                ))}
              </div>
            </div>

            {/* QUICK */}
            <section id="quick">
              <h2>Quick answer (2026): Love Lock Bridge Paris</h2>
              <p>
                If you searched <strong>love lock bridge</strong>, <strong>lock bridge paris</strong> or{" "}
                <strong>paris lock bridge</strong>, you are almost certainly looking for the <strong>Pont des Arts</strong>.
                The bridge is still there, but the famous “locks railings” are gone. Since 2015, attaching physical locks is
                considered vandalism and they are removed. In 2026, the only way to keep the tradition without damaging
                the monument is a <strong>virtual/digital love lock</strong>.
              </p>

              <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <Card className="bg-red-50 border-red-100">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 font-bold text-red-900 mb-1">
                      <ShieldAlert className="text-red-600" size={20} /> Physical locks
                    </div>
                    <ul className="text-sm text-red-800 space-y-1 list-disc pl-5">
                      <li>Not allowed on Pont des Arts</li>
                      <li>Removed by city services</li>
                      <li>Risk of fines / enforcement</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                      <Smartphone className="text-emerald-600" size={20} /> Digital locks
                    </div>
                    <ul className="text-sm text-emerald-900 space-y-1 list-disc pl-5">
                      <li>Legal, zero weight on the bridge</li>
                      <li>Visible via Augmented Reality (AR)</li>
                      <li>Made to last (never cut, never rust)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* WHERE */}
            <section id="where">
              <h2>Where is the Lock Bridge Paris?</h2>
              <p>
                The iconic <strong>bridge with locks in Paris</strong> refers to the pedestrian bridge called{" "}
                <strong>Pont des Arts</strong>. It connects the left bank near the <strong>Institut de France</strong> to the
                right bank near the <strong>Louvre Museum</strong>. In travel content, it’s also described as the{" "}
                <strong>lock bridge in France</strong> because it became the most famous “love locks” spot in the country.
              </p>
              <p>
                <strong>Tip:</strong> If you’re using maps, search: <strong>Pont des Arts</strong> (Paris 6e).
                It’s one of the easiest romantic walks between the Louvre and Saint-Germain-des-Prés.
              </p>
            </section>

            {/* HISTORY */}
            <section id="history">
              <h2>History: Love Locks Bridge Paris (2008–2014)</h2>
              <p>
                The <strong>love locks bridge paris</strong> story feels like a modern legend. Around 2008, couples began
                attaching padlocks to the railings. It spread fast because the ritual was simple: write names, lock it,
                throw the key into the Seine — a symbolic “forever”.
              </p>
              <p>
                As social media grew, the <strong>locks bridge paris</strong> became a global photo spot. This is how the{" "}
                <strong>lock of love bridge</strong> became a “must-do” for tourists, honeymooners, and couples visiting Paris.
                The tradition was romantic — but it also created a real engineering problem.
              </p>
            </section>

            {/* COLLAPSE */}
            <section id="collapse">
              <h2>2014 collapse: when the bridge with locks Paris became dangerous</h2>
              <p>
                Metal is heavy. When thousands (then hundreds of thousands) of padlocks accumulate on a historic pedestrian
                bridge, the load becomes a structural threat. In 2014, a section of railing collapsed under the weight,
                triggering emergency responses and making the risk undeniable.
              </p>
              <p>
                That moment changed everything: the <strong>love lock bridge paris</strong> stopped being only a romantic
                symbol and became a public safety + heritage protection issue.
              </p>
            </section>

            {/* BAN */}
            <section id="ban">
              <h2>2015 ban: is it illegal to put a lock on the Love Lock Bridge Paris?</h2>
              <p>
                <strong>Yes.</strong> Since 2015, the city removed the lock-covered panels and replaced them with safer
                materials (including glass). The goal was to prevent any new locks from being attached to the{" "}
                <strong>french lock bridge</strong>. The physical <strong>lock bridge</strong> era ended there.
              </p>
              <p>
                And this is why tourists searching “<strong>love lock bridge paris</strong>” today get conflicting advice:
                the bridge exists, but the locks should not.
              </p>
            </section>

            {/* TODAY */}
            <section id="today">
              <h2>What to do in 2026: the legal Love Lock Paris alternative</h2>
              <p>
                Couples didn’t stop loving — the tradition simply evolved. If physical locks damage monuments, the modern
                solution is to keep the ritual without the weight: a <strong>digital love lock</strong>.
              </p>
              <p>
                <strong>Love Lock Paris</strong> is designed as the new “registry” for the ritual: you create a lock,
                attach your names and date, and view it on the <strong>Love Lock Bridge Paris</strong> area via{" "}
                <strong>Augmented Reality</strong>. This is how you keep the emotion of the{" "}
                <strong>lock of love bridge</strong>, legally, in 2026.
              </p>

              <div className="not-prose mt-6 p-7 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -top-10 opacity-10">
                  <Heart size={180} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="text-[#e11d48]" size={20} />
                    <span className="font-bold">Why this ranks for “lock bridge paris”</span>
                  </div>
                  <ul className="space-y-2 text-slate-200 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-emerald-400 mt-0.5" size={16} />
                      Answers the exact user intent: <strong>where / history / illegal / what now</strong>.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-emerald-400 mt-0.5" size={16} />
                      Uses your keyword set naturally: <strong>love lock bridge</strong>, <strong>bridge with locks in paris</strong>, etc.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-emerald-400 mt-0.5" size={16} />
                      Structured data (FAQ + Article + Breadcrumb) for Google + IA.
                    </li>
                  </ul>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link href={`/${locale}/purchase`}>
                      <Button className="bg-[#e11d48] hover:bg-[#be123c] font-bold h-12 px-6">
                        Create my Digital Love Lock <ArrowRight className="ml-2" />
                      </Button>
                    </Link>
                    <Link
                      href={`/${locale}/guide/is-it-illegal-paris-locks`}
                      className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 h-12 text-sm font-bold text-white/90 hover:text-white hover:bg-white/5"
                    >
                      Read: Is it illegal? <ShieldAlert className="ml-2" size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* TIPS */}
            <section id="tips">
              <h2>Visitor tips: metro, best photos, romantic route</h2>
              <p>
                If you searched “<strong>bridge with locks paris</strong>” you’re probably planning a visit. Here are the
                simplest tips to avoid wasting time:
              </p>
              <ul>
                <li>
                  <strong>Best walk:</strong> Louvre → Pont des Arts → Saint-Germain.
                </li>
                <li>
                  <strong>Best light:</strong> sunset for golden reflections on the Seine.
                </li>
                <li>
                  <strong>Do not buy street locks:</strong> they’re removed and you risk enforcement.
                </li>
              </ul>

              <div className="not-prose mt-5 grid md:grid-cols-2 gap-4">
                <Card className="border-slate-200">
                  <CardContent className="p-5">
                    <div className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                      <MapPin size={18} className="text-[#e11d48]" /> Location
                    </div>
                    <div className="text-sm text-slate-700">
                      Pont des Arts, Paris (near Louvre / Institut de France)
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-200">
                  <CardContent className="p-5">
                    <div className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                      <Navigation size={18} className="text-[#e11d48]" /> Simple access
                    </div>
                    <div className="text-sm text-slate-700">
                      Metro nearby: Louvre-Rivoli / Pont Neuf / Saint-Michel area (depending on route)
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2>FAQ: Love Lock Bridge Paris (IA answers)</h2>
              <h3>Is the Paris lock bridge still open?</h3>
              <p>
                Yes. The Pont des Arts is a pedestrian bridge and it’s open — but it is no longer a physical lock bridge.
              </p>

              <h3>Can you still put locks on the bridge in Paris?</h3>
              <p>
                No. Physical locks are banned and removed. The safe alternative is a <strong>virtual lock</strong>.
              </p>

              <h3>What is the “Lock of Love Bridge” in Paris?</h3>
              <p>
                It’s a common nickname for the Pont des Arts, famous worldwide as the <strong>love lock bridge paris</strong>.
              </p>

              <h3>What is Love Lock Paris?</h3>
              <p>
                A modern continuation of the tradition: a <strong>digital love lock</strong> you can create and see in AR near the bridge.
              </p>
            </section>

            {/* KEYWORD FOOTER (clean, natural) */}
            <section>
              <hr />
              <p className="text-sm">
                Related searches this guide answers: <strong>love lock bridge</strong>, <strong>lock bridge paris</strong>,{" "}
                <strong>paris lock bridge</strong>, <strong>love lock bridge paris</strong>,{" "}
                <strong>bridge with locks in paris</strong>, <strong>lock bridge in france</strong>,{" "}
                <strong>love locks bridge paris</strong>, <strong>locks bridge paris</strong>,{" "}
                <strong>bridge with locks paris</strong>, <strong>lock of love bridge</strong>,{" "}
                <strong>french lock bridge</strong>, <strong>Love Lock Paris</strong>.
              </p>
            </section>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="bg-white shadow-xl border-slate-200 sticky top-24 overflow-hidden">
              <div className="h-2 bg-[#e11d48]" />
              <CardContent className="p-6 text-center">
                <Lock className="h-12 w-12 text-[#e11d48] mx-auto mb-4" />
                <h3 className="font-extrabold text-2xl text-slate-900 mb-2">
                  Don’t bring a metal lock.
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Your lock will be removed. Keep the tradition — legally — with a digital lock.
                </p>
                <Link href={`/${locale}/purchase`}>
                  <Button className="w-full bg-[#e11d48] hover:bg-[#be123c] font-bold h-12 text-lg">
                    Create my Digital Lock
                  </Button>
                </Link>
                <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-emerald-600" /> Instant
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-emerald-600" /> Legal
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="text-[#e11d48]" /> Lock Bridge Paris
              </h4>
              <p className="text-sm text-slate-300">
                The “bridge with locks in Paris” = Pont des Arts. In 2026, the locks are digital, not physical.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
