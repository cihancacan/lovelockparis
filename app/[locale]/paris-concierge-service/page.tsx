import Image from "next/image";

export const metadata = {
  title: "Paris Concierge Service | Luxury Private Concierge in Paris",
  description:
    "Luxury Paris Concierge Service for couples, groups and international travelers. Private yacht, jet, helicopter, fine dining, exclusive clubs, shopping, bespoke experiences.",
};

export default function ParisConciergeServicePage() {
  return (
    <main className="bg-white text-slate-900">

      {/* HERO */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Paris Concierge Service  
              <span className="block text-rose-600 mt-2">
                Luxury Experiences, Seamlessly Arranged
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600">
              Welcome to a discreet and ultra-premium concierge service in Paris,
              designed for couples, private groups and international travelers
              seeking effortless luxury.
            </p>

            <p className="mt-4 text-slate-600">
              From romantic dinners on the Seine to private aviation, exclusive
              clubs, yachts, helicopters, luxury shopping and bespoke requests —
              everything is handled with precision, discretion and taste.
            </p>

            <p className="mt-8 text-xl font-semibold">
              📞 +33 1 88 84 22 22
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Available by phone, email or live chat — 7 days a week
            </p>
          </div>

          {/* IMAGE 1 – Romantic Dinner */}
          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/concierge/romantic-dinner-yacht.jpg"
              alt="Romantic dinner on a private yacht in Paris"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center">
            Bespoke Luxury Concierge Services in Paris
          </h2>

          <p className="text-center text-slate-600 mt-4 max-w-3xl mx-auto">
            Every experience is tailor-made. Nothing is automated. Nothing is generic.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* IMAGE 2 – Jet / Helicopter / Van */}
            <div className="col-span-1 md:col-span-2 relative h-[360px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/concierge/private-jet-helicopter-paris.jpg"
                alt="Private jet, helicopter and Mercedes S-Class in Paris"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Private Aviation & Transport</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Private jet & commercial aircraft charter</li>
                <li>• Helicopter transfers & scenic flights</li>
                <li>• Chauffeur-driven Mercedes S-Class</li>
                <li>• Luxury vans & group transport</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Luxury Accommodation</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Five-star hotels & palace suites</li>
                <li>• Private apartments & penthouses</li>
                <li>• Historic mansions & hotel particuliers</li>
                <li>• Chalets & international villas</li>
              </ul>
            </div>

            {/* IMAGE 3 – Private Club */}
            <div className="col-span-1 md:col-span-2 relative h-[360px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/concierge/private-club-paris.jpg"
                alt="Exclusive private club access in Paris"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Dining & Nightlife</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Michelin-star restaurant reservations</li>
                <li>• Private dining experiences</li>
                <li>• Select private clubs (couples & groups)</li>
                <li>• Guaranteed access & VIP tables</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Shopping & Requests</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Luxury watches & fine jewelry</li>
                <li>• Designer bags & limited editions</li>
                <li>• Art, gifts & rare items</li>
                <li>• Fully discreet sourcing</li>
              </ul>
            </div>

            {/* IMAGE 4 – Yacht */}
            <div className="col-span-1 md:col-span-2 relative h-[360px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/concierge/private-yacht-paris.jpg"
                alt="Private yacht experience in Paris"
                fill
                className="object-cover"
              />
            </div>

          </div>

          <p className="mt-12 text-center text-slate-700 font-medium">
            If it is not listed here — simply ask.  
            We arrange what others cannot.
          </p>
        </div>
      </section>

      {/* INTERNATIONAL REVIEWS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center">
            Trusted by International Travelers
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700">
            <p>🇺🇸 “Paris felt effortless. Every detail was perfect.” — Michael, USA</p>
            <p>🇯🇵 “非常に丁寧で、信頼できるサービス。” — Kenji, Japan</p>
            <p>🇧🇷 “Luxo verdadeiro, sem stress.” — Rafael, Brazil</p>
            <p>🇦🇪 “Discreet, fast and extremely professional.” — Omar, UAE</p>
            <p>🇦🇺 “They handled everything while we enjoyed Paris.” — Sophie, Australia</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center">
            Frequently Asked Questions
          </h2>

          <div className="mt-12 space-y-6 text-slate-700">
            <p><strong>Do you work with couples and groups?</strong><br />Yes, both.</p>
            <p><strong>Can you organize last-minute requests?</strong><br />Yes, depending on feasibility.</p>
            <p><strong>Is the service discreet?</strong><br />Absolutely. Privacy is fundamental.</p>
            <p><strong>Do you offer international services?</strong><br />Yes, Paris is our core hub.</p>
            <p><strong>Can I request something unusual?</strong><br />That is exactly our role.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-semibold text-white">Paris Concierge Service</p>
          <p className="mt-2">📞 +33 1 88 84 22 22</p>
          <p className="mt-2 text-sm">
            Luxury concierge services in Paris for couples, groups and international travelers.
          </p>
        </div>
      </footer>

    </main>
  );
}
