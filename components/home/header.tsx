"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";

type HeaderTranslations = {
  navBridge?: string;
  navConcierge?: string;
  ctaStart?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Header({
  locale,
  translations,
}: {
  locale: string;
  translations?: HeaderTranslations;
}) {
  const [open, setOpen] = React.useState(false);

  const t: Required<HeaderTranslations> = {
    navBridge: translations?.navBridge ?? "3D Bridge",
    navConcierge: translations?.navConcierge ?? "Concierge",
    ctaStart: translations?.ctaStart ?? "Start",
  };

  const homeHref = `/${locale}`;
  const conciergeHref = `/${locale}/paris-concierge-service`;
  const bridgeHref = `/${locale}#bridge`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link href={homeHref} className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* Remplace le src si ton logo est ailleurs */}
              <Image
                src="/logo.png"
                alt="Love Lock Paris"
                fill
                className="object-contain p-1"
                sizes="36px"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">
                Love Lock Paris
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Paris • Premium Experience
              </div>
            </div>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href={conciergeHref}
              className="text-sm font-bold text-slate-900 hover:text-rose-600 transition"
            >
              {t.navConcierge}
            </Link>

            <Link
              href={bridgeHref}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
            >
              {t.navBridge}
            </Link>

            <Link href={homeHref}>
              <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold">
                {t.ctaStart}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>

          {/* BOUTON MOBILE */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <div
        className={cx(
          "fixed inset-0 z-[60] md:hidden transition",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Overlay */}
        <div
          className={cx(
            "absolute inset-0 bg-black/40 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <div
          className={cx(
            "absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl transition-transform",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="font-extrabold text-slate-900">Menu</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-5 py-5 space-y-3">
            <Link
              href={conciergeHref}
              onClick={() => setOpen(false)}
              className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-extrabold text-slate-900"
            >
              {t.navConcierge}
              <div className="text-xs font-semibold text-slate-500 mt-1">
                Paris VIP • Clubs privés • Jet • Hélico • Yacht
              </div>
            </Link>

            <Link
              href={bridgeHref}
              onClick={() => setOpen(false)}
              className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-slate-900"
            >
              {t.navBridge}
            </Link>

            <Link href={homeHref} onClick={() => setOpen(false)}>
              <Button className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6">
                {t.ctaStart}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <div className="pt-3 text-xs text-slate-500 leading-relaxed">
              Le chat est déjà sur le site. Pour réserver : email ou téléphone.
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-5">
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} Love Lock Paris
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
