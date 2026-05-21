"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Crisp } from "crisp-sdk-web";
import { WidgetMount } from "@/components/live-assist/WidgetMount";

export const CrispChat = () => {
  const pathname = usePathname();
  const isARPage = pathname?.includes("/ar-view");

  useEffect(() => {
    if (isARPage) return;
    Crisp.configure("2cd2d759-05b7-40fb-924b-1b7a448620a7");
  }, [isARPage]);

  if (isARPage) return null;
  return <WidgetMount />;
};
