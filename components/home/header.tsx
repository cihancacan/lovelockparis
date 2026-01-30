'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Heart, Shield, Menu, 
  Camera, Smartphone, Lightbulb, BookOpen, Globe, Lock, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth-context';
import { isAdmin } from '@/lib/admin';
import { cn } from '@/lib/utils';

type HeaderProps = {
  translations?: {
    navBridge: string;
    problemHeading: string;
    solutionHeading: string;
    ctaStart: string;
  };
};

export function Header({ translations }: HeaderProps) {
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const showAdminLink = !loading && user && isAdmin(user.email);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = cn(
    "sticky top-0 z-50 transition-all duration-300 border-b w-full",
    isScrolled 
      ? "bg-white/95 backdrop-blur-md border-slate-200 py-2 shadow-sm" 
      : "bg-white/80 backdrop-blur-sm border-transparent py-4" 
  );

  const t = translations || {
    navBridge: "The Bridge",
    ctaStart: "Secure My Spot"
  };

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-2 group z-50">
            <Heart className="h-7 w-7 text-[#e11d48] fill-[#e11d48]" />
            <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-slate-900">
              LoveLock<span className="text-[#e11d48]">Paris</span>
            </span>
          </Link>

          {/* ===== DESKTOP NAV ===== */}
          <nav className="hidden lg:flex items-center gap-6 font-sans">

            {/* CONCIERGE (AJOUTÉ) */}
            <Link
              href="/paris-concierge-service"
              className="text-sm font-extrabold text-[#e11d48] hover:text-[#be123c] transition-colors"
            >
              Concierge
            </Link>

            <Link href="/marketplace">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-bold text-sm">
                <TrendingUp size={16}/> Marketplace
              </div>
            </Link>

            <Link href="/concept" className="text-sm font-bold text-slate-700 hover:text-[#e11d48]">
              Concept
            </Link>
            <Link href="/about" className="text-sm font-bold text-slate-700 hover:text-[#e11d48]">
              History
            </Link>
            <Link href="/bridge" className="text-sm font-bold text-slate-700 hover:text-[#e11d48]">
              3D Bridge
            </Link>

            {showAdminLink && (
              <Link href="/admin" className="text-sm font-bold text-blue-600">
                <Shield className="h-3 w-3 inline" /> Admin
              </Link>
            )}

            <LanguageSelector />

            {!loading && (
              user ? (
                <Link href="/dashboard" className="text-sm font-bold text-slate-900">
                  Dashboard
                </Link>
              ) : (
                <Link href="/purchase" className="text-sm font-bold text-slate-700">
                  Login
                </Link>
              )
            )}

            <Link href="/purchase">
              <Button className="bg-[#e11d48] text-white font-bold rounded-full px-6">
                {t.ctaStart}
              </Button>
            </Link>
          </nav>

          {/* ===== MOBILE NAV ===== */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-[#e11d48]" /> Menu
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-2">

                  {/* CONCIERGE MOBILE (AJOUTÉ) */}
                  <Link
                    href="/paris-concierge-service"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-[#e11d48] font-extrabold"
                  >
                    Concierge
                  </Link>

                  <Link href="/marketplace" onClick={() => setIsOpen(false)}>
                    Marketplace
                  </Link>
                  <Link href="/bridge" onClick={() => setIsOpen(false)}>
                    3D Bridge
                  </Link>
                  <Link href="/concept" onClick={() => setIsOpen(false)}>
                    Concept
                  </Link>
                  <Link href="/about" onClick={() => setIsOpen(false)}>
                    History
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}
