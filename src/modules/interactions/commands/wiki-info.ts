import { interaction } from '../../../@types/interaction';
import returnobject from '../../../@types/returnobject';
import wiki from '../../wiki/functions';
import methods from '../methods';
import { Command, CommandRaw } from '../../../@types/cmd';

export const raw: CommandRaw = {
  name: 'wiki-info',
  description:
    'Returns information about a specified wikipedia article',
  options: [
    {
      name: 'Search-Term',
      description:
        'The search term that you want information about',
      required: true,
      type: 3,
    },
  ],
};

export const command: Command = {
  // the id that discord returned us, we will need this
  // for the interaction handler
  id: '803241756488368138',
  name: 'wiki-info',
  help: 'useful command description to show in help menu',
  execute: async (
    interaction: interaction,
  ): Promise<void> => {
    if (!interaction.data) return;
    if (!interaction.data.options) return;
    if (interaction.data.options[0].value === '') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchTerm: any =
      interaction.data.options[0].value;
    const returnedObject: returnobject = await wiki.getWikiObject(
      searchTerm,
    );
    if (!returnedObject.wiki) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generalInfo: any = returnedObject.wiki.info;
    let desc = '';
    for (const key in generalInfo.general) {
      console.log(key, generalInfo.general[key]);
      desc += `**${key}** : ${generalInfo.general[key]} \n`;
    }
    await methods.embed.defaultWikiEmbed(
      interaction.token,
      {
        title: generalInfo.general.name,
        thumb: returnedObject.wiki.image,
        desc,
        // `
        // __**Name:**__     ${generalInfo.general.name}
        // __**Genus:**__    ${generalInfo.general.genus}
        // __**Species:**__  ${generalInfo.general.species}`,
      },
    );
  },
};
