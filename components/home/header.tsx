'use client';

import Link from 'next/link';
// AJOUT DE L'ICONE CAMERA
import { Heart, Sparkles, Shield, Menu, X, Lightbulb, BookOpen, Globe, Lock, Camera, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useAuth } from '@/lib/auth-context';
import { isAdmin } from '@/lib/admin';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

type HeaderProps = {
  translations?: any;
};

export function Header({ translations }: HeaderProps) {
  const { user } = useAuth();
  const showAdminLink = user && isAdmin(user.email);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Détection si on est sur la home
  const isHome = pathname === '/' || pathname.endsWith('/en') || pathname.endsWith('/fr') || pathname.endsWith('/es') || pathname.endsWith('/pt') || pathname.endsWith('/ar') || pathname.endsWith('/zh-CN');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = cn(
    "sticky top-0 z-50 transition-all duration-300 border-b",
    !isHome || isScrolled 
      ? "bg-white/95 backdrop-blur-md border-slate-200 py-3 shadow-sm" 
      : "bg-transparent border-transparent py-5"
  );

  const textClass = (!isHome || isScrolled) ? "text-slate-700" : "text-slate-800";
  const logoClass = (!isHome || isScrolled) ? "text-slate-900" : "text-slate-900"; 

  // Textes par défaut
  const t = translations || {
    navBridge: "The Bridge",
    ctaStart: "Secure My Spot"
  };

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="h-7 w-7 text-[#e11d48] fill-[#e11d48] group-hover:scale-110 transition-transform" />
              <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className={`text-xl md:text-2xl font-serif font-bold tracking-tight ${logoClass}`}>
              LoveLock<span className="text-[#e11d48]">Paris</span>
              <span className="text-[0.6em] align-top ml-0.5 text-slate-400 font-sans">TM</span>
            </span>
          </Link>

          {/* --- NAV DESKTOP (ORDI) --- */}
          <nav className="hidden lg:flex items-center gap-6 font-sans">
            <Link href="/concept" className={`text-sm font-bold hover:text-[#e11d48] transition-colors ${textClass}`}>Concept</Link>
            <Link href="/about" className={`text-sm font-bold hover:text-[#e11d48] transition-colors ${textClass}`}>History</Link>
            <Link href="/bridge" className={`text-sm font-bold hover:text-[#e11d48] transition-colors ${textClass}`}>3D Bridge</Link>
            
            {showAdminLink && (
              <Link href="/admin" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Admin
              </Link>
            )}
            
            <div className="h-4 w-px bg-slate-300 mx-2"></div>

            <LanguageSelector />

            {user ? (
               <Link href="/dashboard" className="text-sm font-bold text-slate-900 hover:text-[#e11d48]">My Dashboard</Link>
            ) : (
               <Link href="/login" className={`text-sm font-bold hover:text-[#e11d48] transition-colors ${textClass}`}>Login</Link>
            )}
            
            <Link href="/purchase">
              <Button size="sm" className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-full shadow-md transition-transform hover:-translate-y-0.5 font-sans px-6">
                {t.ctaStart}
              </Button>
            </Link>
          </nav>

          {/* --- NAV MOBILE --- */}
          <div className="flex items-center gap-1 lg:hidden">
            
            {/* 1. NOUVEAU BOUTON CAMÉRA AR (ACCÈS RAPIDE) */}
            <Link href="/ar-view">
              <Button variant="ghost" size="icon" className="text-slate-900 hover:bg-rose-50 hover:text-[#e11d48]">
                <Camera className="h-6 w-6" />
              </Button>
            </Link>

            {/* 2. GLOBE (LANGUE) */}
            <LanguageSelector />
            
            {/* 3. HAMBURGER */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-900 p-1">
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white border-l border-slate-100 font-sans overflow-y-auto">
                <SheetHeader className="text-left border-b border-slate-100 pb-4">
                  <SheetTitle className="flex items-center gap-2 font-serif text-slate-900">
                    <Heart className="h-5 w-5 text-[#e11d48] fill-[#e11d48]" />
                    Menu
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-1 mt-6">
                  {/* AJOUT LIEN AR DANS LE MENU AUSSI */}
                  <Link href="/ar-view" onClick={() => setIsOpen(false)} className="text-lg font-bold py-3 border-b border-slate-50 text-slate-800 hover:text-[#e11d48] flex items-center gap-3 bg-slate-50 px-2 rounded-lg mb-2">
                    <Smartphone size={18} className="text-[#e11d48]"/> AR View (Camera)
                  </Link>

                  <Link href="/concept" onClick={() => setIsOpen(false)} className="text-lg font-bold py-3 border-b border-slate-50 text-slate-800 hover:text-[#e11d48] flex items-center gap-3">
                    <Lightbulb size={18} className="text-[#e11d48]"/> Concept & Value
                  </Link>
                  <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-bold py-3 border-b border-slate-50 text-slate-800 hover:text-[#e11d48] flex items-center gap-3">
                    <BookOpen size={18} className="text-[#e11d48]"/> History
                  </Link>
                  <Link href="/bridge" onClick={() => setIsOpen(false)} className="text-lg font-bold py-3 border-b border-slate-50 text-slate-800 hover:text-[#e11d48] flex items-center gap-3">
                    <Globe size={18} className="text-[#e11d48]"/> Visit 3D Bridge
                  </Link>

                  {user ? (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold py-3 border-b border-slate-50 text-blue-600 flex items-center gap-3">
                      <Lock size={18} /> My Dashboard
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-bold py-3 border-b border-slate-50 text-slate-800 flex items-center gap-3">
                      <Lock size={18} /> Login
                    </Link>
                  )}
                  
                  <div className="mt-8 pb-8">
                    <Link href="/purchase" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold h-12 text-lg shadow-lg">
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