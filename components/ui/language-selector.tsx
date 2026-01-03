'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // LISTE COMPLÈTE DES LANGUES
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }, // Ajouté
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }, // Ajouté
  ];

  const handleLanguageChange = (newLocale: string) => {
    // On remplace le code langue dans l'URL (ex: /en/purchase -> /fr/purchase)
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    
    // Si l'URL n'avait pas de locale (ex: /), on ajoute la nouvelle
    const finalPath = newPath === pathname ? `/${newLocale}${pathname}` : newPath;
    
    router.push(finalPath);
  };

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2 text-slate-600 hover:text-[#e11d48]">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{currentLang.name}</span>
          <span className="md:hidden">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-slate-100 shadow-lg">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="cursor-pointer gap-2 hover:bg-slate-50 hover:text-[#e11d48]"
          >
            <span className="text-lg">{lang.flag}</span>
            <span className={locale === lang.code ? "font-bold" : ""}>
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}