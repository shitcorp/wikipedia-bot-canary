// the idea is to have a function that will return the article
// it will first check if the article is in the cache and if not
// if will fetch it from the api

// external imports
import wiki from 'wikijs';
import { normalizeText, normalizeName } from 'normalize-text';

// internal imports
import { Article, Zookeeper } from '../structures';
import { wikiConfig } from '../config';
import { cache } from '.';

export async function getArticle(searchterm: string, lang = 'en') {
  const sanitizedSearchTerm = normalizeText(normalizeName(searchterm));
  const cachedArticle = await cache.get(sanitizedSearchTerm);
  if (cachedArticle) {
    if (Date.now() - JSON.parse(cachedArticle).cached > 604800000) cache.del(searchterm);
    return new Article(JSON.parse(cachedArticle));
  }
  const wikiApi = wiki(wikiConfig(lang ?? 'en'));
  const page = await wikiApi.find(sanitizedSearchTerm);

  const article = new Article({
    url: page.url(),
    summary: await page.summary(),
    image: (await page.mainImage()) || null
  });
  // the article.cache() method gives the article the
  // cached timestamp and returns the article as json
  cache.set(sanitizedSearchTerm, article.cache(), 'ex', 604800);
  return article;
}

export function trimLength(str: string, maxLength = 2000) {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
}

// takes in 2 arrays and "merges" them into an object
// https://www.tutorialspoint.com/how-to-combine-2-arrays-into-1-object-in-javascript
export function combineArrays(first: any[], second: any[]) {
  return first.reduce((acc, val, ind) => {
    acc[val] = second[ind];
    return acc;
  }, {});
}

export const ZooKeeper = new Zookeeper();
