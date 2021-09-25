// the idea is to have a function that will return the article
// it will first check if the article is in the cache and if not
// if will fetch it from the api
import wiki from 'wikijs';
import { normalizeText, normalizeName } from 'normalize-text';

import { Article } from '../structures';
import { wikiConfig } from '../config';
import cache from './cache';

export default async (searchterm: string, lang = 'en') => {
  const sanitizedSearchTerm = normalizeText(normalizeName(searchterm));
  const cachedArticle = await cache.get(sanitizedSearchTerm);
  if (cachedArticle) {
    if (Date.now() - JSON.parse(cachedArticle).cached > 604800000) cache.del(searchterm);
    return new Article(JSON.parse(cachedArticle));
  }
  const wikiApi = wiki(wikiConfig(lang));
  const page = await wikiApi.find(sanitizedSearchTerm);

  const article = new Article({
    url: page.url(),
    summary: await page.summary(),
    image: (await page.mainImage()) || null
  });
  // article .cache gives the article the cached timestamp
  // and returns the article to json
  cache.set(searchterm, article.cache(), 'ex', 604800);
  return article;
};
