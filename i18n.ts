import { getRequestConfig } from 'next-intl/server';

// Liste des langues supportées
const locales = ['en', 'fr', 'zh-CN', 'ja', 'ko', 'es', 'pt', 'ar'];

export default getRequestConfig(async ({locale}) => {
  // 1. Vérification : Si la locale n'est pas dans la liste, on force l'anglais
  const baseLocale = locales.includes(locale as any) ? locale : 'en';

  // 2. Chargement des messages
  let messages;
  try {
    messages = (await import(`./messages/${baseLocale}.json`)).default;
  } catch (error) {
    // Si le fichier manque, fallback sur Anglais
    messages = (await import(`./messages/en.json`)).default;
  }

  return {
    locale: baseLocale, // On renvoie la locale pour être sûr
    messages,
    timeZone: 'Europe/Paris'
  };
});