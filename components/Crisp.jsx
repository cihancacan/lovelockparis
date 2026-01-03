'use client'; // Nécessaire car le script s'exécute côté client (navigateur)

import { useEffect } from 'react';

export default function Crisp() {
  useEffect(() => {
    // C'est VOTRE code Crisp exact
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "2cd2d759-05b7-40fb-924b-1b7a448620a7";
    (function() {
      const d = document;
      const s = d.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = 1;
      d.getElementsByTagName('head')[0].appendChild(s);
    })();
  }, []); // S'exécute une seule fois au chargement de la page

  return null; // Ce composant ne rend rien à l'écran
}
