import wiki from '../../wiki/functions';
import { logger } from '../../../utils';
import methods from '../methods';

export const raw = {
  name: 'wiki',
  description: 'Returns the summary of a wikipedia article',
  options: [
    {
      name: 'Search-Term',
      description: 'The search term you want to search for',
      required: true,
      type: 3,
    },
    {
      name: 'Language',
      description:
        'The language in which you want to search',
      type: 3,
      choices: [
        {
          name: 'English',
          value: 'en',
        },
        {
          name: 'German',
          value: 'de',
        },
        {
          name: 'Spanish',
          value: 'es',
        },
        {
          name: 'French',
          value: 'fr',
        },
        {
          name: 'Russian',
          value: 'ru',
        },
        {
          name: 'Slovak',
          value: 'sl',
        },
        {
          name: 'Turkish',
          value: 'tr',
        },
        {
          name: 'Yiddish',
          value: 'yi',
        },
      ],
    },
  ],
};

export const command = {
  // the id that discord returned us, we will need this
  // for the interaction handler
  id: '802662348154339328',
  name: 'wiki',
  execute: async (interaction: any): Promise<void> => {
    // send an initial response to edit later
    const returned = await methods.reply(
      interaction,
      'LOADING, PLEASE WAIT ...',
      4,
    );

    const { data } = interaction;
    let searchValue;
    let searchLang = 'en';

    for (const option in data.options) {
      const temp = data.options[option];
      if (temp.name === 'search-term') {
        searchValue = temp.value;
      }
      if (temp.name === 'language') {
        if (temp.value === '') return;
        searchLang = temp.value;
      }
    }

    const returnedObject = await wiki.getSummary(
      searchValue,
      searchLang,
    );

    if (returnedObject.error === true) {
      await methods.deleteOriginal(returned.data.token);
      await methods.embed.defaultErrorEmbed(
        returned.data.token,
        'Something went wrong .... :(  maybe try another search term and try again... ',
      );
    } else {
      const desc_long: any = await returnedObject
        .results[3];
      const desc = desc_long.substr(0, 1169) + '.....';

      await methods.deleteOriginal(returned.data.token);
      await methods.embed.defaultWikiEmbed(
        returned.data.token,
        {
          title: returnedObject.results[0],
          url: returnedObject.results[1],
          thumb: returnedObject.results[2],
          desc,
        },
      );
    }
  },
};
