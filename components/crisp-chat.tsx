"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  const pathname = usePathname();

  // ❌ Ne pas afficher Crisp sur la page AR (toutes langues)
  // Exemples : /fr/ar-view, /en/ar-view, /zh-CN/ar-view ...
  const isARPage = pathname?.includes("/ar-view");

  useEffect(() => {
    if (isARPage) return;

    // Ton ID Crisp
    Crisp.configure("2cd2d759-05b7-40fb-924b-1b7a448620a7");
  }, [isARPage]);

  return null;
};
