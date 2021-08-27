import { Options } from 'wikijs';

export const apiUrl = {
  // german
  de: 'https://de.wikipedia.org/w/api.php',
  // english
  en: 'https://en.wikipedia.org/w/api.php',
  // spanish
  es: 'https://es.wikipedia.org/w/api.php',
  // french
  fr: 'https://fr.wikipedia.org/w/api.php',
  // russian
  ru: 'https://ru.wikipedia.org/w/api.php',
  // slovak
  sl: 'https://sl.wikipedia.org/w/api.php',
  // turkish
  tr: 'https://tr.wikipedia.org/w/api.php',
  // yiddish
  yi: 'https://yi.wikipedia.org/w/api.php'
};

export const wikiConfig = (lang: string): Options => {
  return {
    apiUrl: apiUrl[lang],
    headers: {
      'User-Agent': 'wikipedia-bot-requests (https://julianyaman.de; julianyaman@posteo.eu) wiki.ts'
    }
  };
};

export const wikipediaIcon = 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png';
