// the idea is to have a function that will return the article
// it will first check if the article is in the cache and if not
// if will fetch it from the api
import cache from './cache';
import wiki from 'wikijs';
import { Article } from '../structures';
import { wikiConfig } from '../config';

export default async (searchterm: string, lang = 'en') => {
  const cachedArticle = await cache.get(searchterm);
  if (cachedArticle) {
    if (Date.now() - JSON.parse(cachedArticle).cached > 604800000) cache.del(searchterm);
    return new Article(JSON.parse(cachedArticle));
  }
  const wikiApi = wiki(wikiConfig(lang));
  const page = await wikiApi.find(searchterm);

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
