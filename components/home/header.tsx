'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Heart, Menu, Globe2, BookOpen, LayoutDashboard, LogIn, Shield } from 'lucide-react';
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

const navCopy: Record<string, any> = {
  en:{how:'How it works',bridge:'3D Bridge',about:'Our story',login:'Login',dashboard:'Dashboard',menu:'Menu'},
  fr:{how:'Comment ça marche',bridge:'Pont 3D',about:'Notre histoire',login:'Connexion',dashboard:'Tableau de bord',menu:'Menu'},
  es:{how:'Cómo funciona',bridge:'Puente 3D',about:'Nuestra historia',login:'Entrar',dashboard:'Panel',menu:'Menú'},
  pt:{how:'Como funciona',bridge:'Ponte 3D',about:'Nossa história',login:'Entrar',dashboard:'Painel',menu:'Menu'},
  'zh-CN':{how:'如何使用',bridge:'3D 艺术桥',about:'我们的故事',login:'登录',dashboard:'账户',menu:'菜单'},
  ja:{how:'使い方',bridge:'3Dブリッジ',about:'ストーリー',login:'ログイン',dashboard:'ダッシュボード',menu:'メニュー'},
  ko:{how:'이용 방법',bridge:'3D 브리지',about:'스토리',login:'로그인',dashboard:'대시보드',menu:'메뉴'},
  ar:{how:'كيف يعمل',bridge:'الجسر ثلاثي الأبعاد',about:'قصتنا',login:'تسجيل الدخول',dashboard:'لوحة التحكم',menu:'القائمة'},
};

export function Header({ translations }: HeaderProps) {
  const locale = useLocale();
  const c = navCopy[locale] || navCopy.en;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const showAdminLink = !loading && user && isAdmin(user.email);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cta = translations?.ctaStart || (locale === 'fr' ? 'Créer notre cadenas' : 'Create our Love Lock');

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b transition-all',
      isScrolled ? 'border-slate-200 bg-white/95 py-2 shadow-sm backdrop-blur-md' : 'border-transparent bg-white/90 py-3 backdrop-blur'
    )}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link href={prefix || '/'} className="flex items-center gap-2">
          <Heart className="h-7 w-7 fill-[#e11d48] text-[#e11d48]" />
          <span className="font-serif text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            LoveLock<span className="text-[#e11d48]">Paris</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href={`${prefix || ''}/#how-it-works`} className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">{c.how}</Link>
          <Link href={`${prefix}/bridge`} className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">{translations?.navBridge || c.bridge}</Link>
          <Link href={`${prefix}/about`} className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">{c.about}</Link>
          {showAdminLink && <Link href={`${prefix}/admin`} className="flex items-center gap-1 text-xs font-bold text-blue-600"><Shield className="h-3 w-3"/>Admin</Link>}
          <LanguageSelector />
          {!loading && (
            user
              ? <Link href={`${prefix}/dashboard`} className="text-sm font-semibold text-slate-600 hover:text-slate-950">{c.dashboard}</Link>
              : <Link href={`${prefix}/purchase`} className="text-sm font-semibold text-slate-500 hover:text-slate-950">{c.login}</Link>
          )}
          <Link href={`${prefix}/purchase`}>
            <Button className="rounded-full bg-[#e11d48] px-6 font-bold text-white shadow-md hover:bg-[#be123c]">{cta}</Button>
          </Link>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSelector />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={c.menu}><Menu className="h-7 w-7"/></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[310px] bg-white">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-serif text-xl">
                  <Heart className="h-5 w-5 fill-[#e11d48] text-[#e11d48]"/>LoveLockParis
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-2">
                <Link href={`${prefix || ''}/#how-it-works`} onClick={()=>setIsOpen(false)} className="flex items-center gap-3 rounded-xl p-3 font-bold text-slate-700 hover:bg-slate-50"><Globe2 className="h-5 w-5 text-slate-400"/>{c.how}</Link>
                <Link href={`${prefix}/bridge`} onClick={()=>setIsOpen(false)} className="flex items-center gap-3 rounded-xl p-3 font-bold text-slate-700 hover:bg-slate-50"><Globe2 className="h-5 w-5 text-slate-400"/>{c.bridge}</Link>
                <Link href={`${prefix}/about`} onClick={()=>setIsOpen(false)} className="flex items-center gap-3 rounded-xl p-3 font-bold text-slate-700 hover:bg-slate-50"><BookOpen className="h-5 w-5 text-slate-400"/>{c.about}</Link>
                {!loading && (
                  user
                    ? <Link href={`${prefix}/dashboard`} onClick={()=>setIsOpen(false)} className="flex items-center gap-3 rounded-xl p-3 font-bold text-slate-700 hover:bg-slate-50"><LayoutDashboard className="h-5 w-5 text-slate-400"/>{c.dashboard}</Link>
                    : <Link href={`${prefix}/purchase`} onClick={()=>setIsOpen(false)} className="flex items-center gap-3 rounded-xl p-3 font-bold text-slate-700 hover:bg-slate-50"><LogIn className="h-5 w-5 text-slate-400"/>{c.login}</Link>
                )}
                {showAdminLink && <Link href={`${prefix}/admin`} onClick={()=>setIsOpen(false)} className="flex items-center gap-3 rounded-xl bg-blue-50 p-3 font-bold text-blue-700"><Shield className="h-5 w-5"/>Admin</Link>}
                <Link href={`${prefix}/purchase`} onClick={()=>setIsOpen(false)} className="block pt-5">
                  <Button className="h-14 w-full rounded-xl bg-[#e11d48] text-base font-black text-white hover:bg-[#be123c]">
                    <Heart className="mr-2 h-5 w-5 fill-current"/>{cta}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
