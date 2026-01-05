'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Heart, Sparkles, Shield, Menu, 
  Camera, Smartphone, Lightbulb, BookOpen, Globe, Lock 
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
  const { user, loading } = useAuth(); // On récupère loading pour éviter le clignotement
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Détection Admin
  const showAdminLink = !loading && user && isAdmin(user.email);

  // Détection Page d'accueil (plus robuste)
  // On considère qu'on est sur la home si le chemin est '/' ou '/en', '/fr' etc.
  const isHome = pathname === '/' || /^\/[a-z]{2}(-([A-Z]{2}))?$/.test(pathname);

  // Gestion du scroll pour l'effet de transparence
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Styles dynamiques
  const headerClass = cn(
    "sticky top-0 z-50 transition-all duration-300 border-b",
    !isHome || isScrolled 
      ? "bg-white/95 backdrop-blur-md border-slate-200 py-2 shadow-sm" 
      : "bg-transparent border-transparent py-4"
  );

  const textClass = (!isHome || isScrolled) ? "text-slate-700" : "text-slate-800";
  const logoClass = (!isHome || isScrolled) ? "text-slate-900" : "text-white drop-shadow-md"; // Logo blanc sur Hero, noir ailleurs

  // Valeurs par défaut si les traductions ne chargent pas
  const t = translations || {
    navBridge: "The Bridge",
    ctaStart: "Secure My Spot"
  };

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center space-x-2 group z-50">
            <div className="relative">
              <Heart className="h-7 w-7 text-[#e11d48] fill-[#e11d48] group-hover:scale-110 transition-transform" />
              <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className={cn("text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors", 
              (!isHome || isScrolled) ? "text-slate-900" : "text-white"
            )}>
              LoveLock<span className="text-[#e11d48]">Paris</span>
              <span className="text-[0.6em] align-top ml-0.5 opacity-60 font-sans">TM</span>
            </span>
          </Link>

          {/* --- NAVIGATION ORDI (DESKTOP) --- */}
          <nav className="hidden lg:flex items-center gap-6 font-sans">
            <Link href="/concept" className={`text-sm font-bold hover:text-[#e11d48] transition-colors ${textClass}`}>
              Concept
            </Link>
            <Link href="/about" className={`text-sm font-bold hover:text-[#e11d48] transition-colors ${textClass}`}>
              History
            </Link>
            <Link href="/bridge" className={`text-sm font-bold hover:text-[#e11d48] transition-colors ${textClass}`}>
              3D Bridge
            </Link>
            
            {showAdminLink && (
              <Link href="/admin" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                <Shield className="h-3 w-3" /> Admin
              </Link>
            )}
            
            <div className={`h-4 w-px mx-2 ${(!isHome || isScrolled) ? "bg-slate-300" : "bg-white/30"}`}></div>

            <LanguageSelector />

            {!loading && (
              user ? (
                 <Link href="/dashboard" className={`text-sm font-bold hover:text-[#e11d48] ${textClass}`}>
                   Dashboard
                 </Link>
              ) : (
                 <Link href="/purchase" className={`text-sm font-bold hover:text-[#e11d48] ${textClass}`}>
                   Login
                 </Link>
              )
            )}
            
            <Link href="/purchase">
              <Button size="sm" className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-full shadow-lg transition-transform hover:-translate-y-0.5 px-6">
                {t.ctaStart}
              </Button>
            </Link>
          </nav>

          {/* --- NAVIGATION MOBILE --- */}
          <div className="flex items-center gap-1 lg:hidden">
            
            {/* 1. ICONE CAMÉRA (ACCÈS RAPIDE AR) */}
            <Link href="/ar-view">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "hover:bg-rose-50 hover:text-[#e11d48] transition-colors",
                  (!isHome || isScrolled) ? "text-slate-900" : "text-white"
                )}
                aria-label="Open AR Camera"
              >
                <Camera className="h-6 w-6" />
              </Button>
            </Link>

            {/* 2. SÉLECTEUR LANGUE */}
            <div className={(!isHome || isScrolled) ? "text-slate-900" : "text-white"}>
              <LanguageSelector />
            </div>
            
            {/* 3. MENU HAMBURGER */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "p-1",
                    (!isHome || isScrolled) ? "text-slate-900" : "text-white"
                  )}
                >
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-[300px] bg-white border-l border-slate-100 font-sans overflow-y-auto">
                <SheetHeader className="text-left border-b border-slate-100 pb-4">
                  <SheetTitle className="flex items-center gap-2 font-serif text-slate-900 text-xl">
                    <Heart className="h-6 w-6 text-[#e11d48] fill-[#e11d48]" />
                    Menu
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-2 mt-6">
                  {/* BOUTON AR MOBILE DANS LE MENU */}
                  <Link 
                    href="/ar-view" 
                    onClick={() => setIsOpen(false)} 
                    className="group flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50 transition-all"
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#e11d48] group-hover:scale-110 transition-transform">
                      <Smartphone size={20} />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">AR Camera</span>
                  </Link>

                  <div className="h-px bg-slate-100 my-2"></div>

                  <Link href="/concept" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-bold text-lg">
                    <Lightbulb size={20} className="text-slate-400" /> Concept
                  </Link>
                  <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-bold text-lg">
                    <BookOpen size={20} className="text-slate-400" /> History
                  </Link>
                  <Link href="/bridge" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-bold text-lg">
                    <Globe size={20} className="text-slate-400" /> 3D Bridge
                  </Link>

                  {!loading && (
                    user ? (
                      <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-lg text-blue-600 font-bold text-lg">
                        <Lock size={20} /> Dashboard
                      </Link>
                    ) : (
                      <Link href="/purchase" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg text-slate-700 font-bold text-lg">
                        <Lock size={20} className="text-slate-400" /> Login
                      </Link>
                    )
                  )}

                  {showAdminLink && (
                     <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg text-amber-700 font-bold text-lg mt-2">
                        <Shield size={20} /> Admin Panel
                     </Link>
                  )}
                  
                  <div className="mt-8">
                    <Link href="/purchase" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold h-14 text-xl rounded-xl shadow-lg">
                        {t.ctaStart}
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}
