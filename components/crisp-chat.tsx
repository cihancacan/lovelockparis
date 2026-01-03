"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    // Remplace par TON VRAI ID Crisp ici
    Crisp.configure("2cd2d759-05b7-40fb-924b-1b7a448620a7");
  }, []);

  return null;
};
