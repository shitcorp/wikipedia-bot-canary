import wiki from 'wikijs';
import Constants from '../constants/Constants';
import * as Sentry from '@sentry/node';

export default {
  /**
   * Function that returns a returnobject with an error or the requested information
   * @function getSummary
   * @param {String} argument - Argument sent by the user (!wiki [argument])
   * @param {String} lang - Language in which the result should be sent.
   *
   * @returns {Object} returnobject:
   * {
   *      error: Boolean,
   *      results: Array[
   *          title,
   *          fullurl,
   *          mainImage,
   *          summary
   *      ]
   * }
   *
   */
  getSummary: async (argument: string, lang = 'en') => {
    let apiUrl: any = Constants.apiUrl;
    const headers: any = Constants.headers;
    const apiString: string = apiUrl[lang];

    const returnobject = {
      error: false,
      results: [Promise],
    };

    if (apiString === undefined)
      apiUrl = 'https://en.wikipedia.org/w/api.php';

    try {
      const search = await wiki({
        apiUrl: apiString,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        headers,
      }).search(argument);
      const wikiPage = await wiki({
        apiUrl: apiString,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        headers,
      }).page(search.results[0]);

      returnobject.results = await Promise.all([
        wikiPage.raw.title,
        wikiPage.raw.fullurl,
        wikiPage.mainImage(),
        wikiPage.summary(),
      ]);
    } catch (e) {
      returnobject.error = true;
      Sentry.captureException(e);
    }

    return returnobject;
  },
  // method to get the full article
  getFullArticle: async () => {},
  /**
   * @function getReferences
   * @param {String} argument - Keyword you want the references for
   *
   * @returns {Object} returnobject:
   * {
   *      error: Boolean,
   *      results: Array[
   *          title,
   *          fullurl,
   *          mainImage,
   *          references
   *      ]
   * }
   *
   */
  getReferences: async (argument: string) => {
    const returnobject = {
      error: false,
      results: [Promise],
    };
    const headers = Constants.headers;

    try {
      const sourceSearch = await wiki({ headers }).search(
        argument,
      );
      const wikiPageSources = await wiki({ headers }).page(
        sourceSearch.results[0],
      );

      const sourceResults = await Promise.all([
        wikiPageSources.raw.title,
        wikiPageSources.raw.fullurl,
        wikiPageSources.mainImage(),
        wikiPageSources.references(),
      ]);

      returnobject.results = sourceResults;
    } catch (e) {
      returnobject.error = true;
      Sentry.captureException(e);
    }

    return returnobject;
  },
  /**
   * @function getShortInformation
   * @param {String} argument - argument you want to search for and get information on
   *
   * @returns {Object} returnobject:
   * {
   *      error: Boolean,
   *      page: wikipediaPage,
   *      info: wikipediaPage.info
   * }
   */
  getShortInformation: async (argument: string) => {
    const returnobject = {
      error: false,
      page: '',
      info: '',
    };

    try {
      const data = await wiki().search(argument);
      const page = await wiki().page(data.results[0]);
      const info = await page.fullInfo();

      returnobject.page = page;
      returnobject.info = info;
    } catch (e) {
      returnobject.error = true;
      Sentry.captureException(e);
    }

    return returnobject;
  },
};
