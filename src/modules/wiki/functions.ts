import wiki from 'wikijs';
import Constants from '../constants/Constants';
import returnobject from '../../@types/returnobject';
import { logger } from '../../utils';

const returnobject: returnobject = { error: false };

export default {
  /**
   * Central function that returns a wikipediaobject with an
   *  error or the requested information. The returned object
   * has the following keys in the wiki property:
   * - title,
   * - url,
   * - image,
   * - text(summary),
   * - refs(references/sources),
   * - info,
   * - page(the full wikipage object)
   * @method getWikiObject
   * @param {string} searchterm - Argument sent by the user (/wiki [searchterm])
   * @param {string} lang - Language in which the results should be sent.
   * @returns {returnobject} returnobject
   */
  getWikiObject: async (
    searchterm: string,
    lang = 'en',
  ): Promise<returnobject> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let apiUrl: any = Constants.apiUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers: any = Constants.headers;
    const apiString: string = apiUrl[lang];

    if (apiString === undefined)
      apiUrl = 'https://en.wikipedia.org/w/api.php';

    try {
      const search = await wiki({
        apiUrl: apiString,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        headers,
      }).search(searchterm);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wikiPage: any = await wiki({
        apiUrl: apiString,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        headers,
      }).page(search.results[0]);

      returnobject.wiki = {
        title: await wikiPage.raw.title,
        url: await wikiPage.raw.fullurl,
        image: await wikiPage.mainImage(),
        text: await wikiPage.summary(),
        refs: await wikiPage.references(),
        info: await wikiPage.fullInfo(),
        page: await wikiPage,
      };
    } catch (e) {
      logger.error(e);
      returnobject.error = true;
      returnobject.errormsg =
        'Something went wrong when trying to fetch the requested page. Most likely an error with wikijs. Check error logs for details; \nError:' +
        e.toString().substr(0, 75);
    }

    return returnobject;
  },
};
