const wiki = require("wikijs").default;

let { apiUrl, headers, wiki_logo } = require("../constants/Constants");
export const wikifunctions = {
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
  getSummary: async (argument: String, lang = "en") => {
    const returnobject = { error: false, results:[Promise] };
    apiUrl = apiUrl[lang];
    if (apiUrl === undefined) apiUrl = "https://en.wikipedia.org/w/api.php";

    try {
      const search = await wiki({ apiUrl, headers }).search(argument);
      const wikiPage = await wiki({ apiUrl, headers }).page(search.results[0]);

      returnobject.results = await Promise.all([
        wikiPage.raw.title,
        wikiPage.raw.fullurl,
        wikiPage.mainImage(),
        wikiPage.summary(),
      ]);
    } catch (e) {
      returnobject.error = true;
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
  getReferences: async (argument: String) => {
    const returnobject = { error: false, results: [Promise] };

    try {
      const sourceSearch = await wiki({ headers }).search(argument);
      const wikiPageSources = await wiki({ headers }).page(
        sourceSearch.results[0]
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
  getShortInformation: async (argument: String) => {
    const returnobject = { error: false, page: '', info: ''};

    try {
      const data = await wiki().search(argument);
      const page = await wiki().page(data.results[0]);
      const info = await page.fullInfo();

      returnobject.page = page;
      returnobject.info = info;
    } catch (e) {
      returnobject.error = true;
    }

    return returnobject;
  },
};
