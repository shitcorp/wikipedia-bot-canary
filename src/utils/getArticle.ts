// the idea is to have a function that will return the article
// it will first check if the article is in the cache and if not
// if will fetch it from the api
import cache from './cache';
import wiki from 'wikijs';
import Article from '../structures/Article';
import { wikiConfig } from '../config/wiki';

export default async (searchterm: string, lang = 'en') => {
  const cachedArticle = await cache.get(searchterm);
  console.log(cachedArticle);
  if (cachedArticle) {
    console.log('cached:', JSON.parse(cachedArticle));
    return new Article(JSON.parse(cachedArticle));
  }
  const wikiApi = wiki(wikiConfig(lang));
  const page = await wikiApi.find(searchterm);
  const article = new Article({
    summary: await page.summary(),
    image: (await page.mainImage()) || null,
    url: page.url()
  });
  // article .cache gives the article the cached timestamp
  // and returns the article to json
  console.log(article);
  cache.set(searchterm, article.cache(), 'ex', 604800);
  return article;
};
