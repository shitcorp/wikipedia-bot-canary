import wiki from '../../wiki/functions';
//import { logger } from '../../../utils';
//import methods from '../methods';
import { interaction } from '../../../@types/interaction';
import returnobject from '../../../@types/returnobject';
import methods from '../methods';
import { Command, CommandRaw } from '../../../@types/cmd';

export const raw: CommandRaw = {
  name: 'sources',
  description:
    'Returns the sources/references of a given wikipedia article',
  options: [
    {
      name: 'Search-Term',
      description:
        'The wikipedia article you want the sources of.',
      required: true,
      type: 3,
    },
  ],
};

export const command: Command = {
  // the id that discord returned us, we will need this
  // for the interaction handler
  id: '803362420210663464',
  name: 'sources',
  help: 'useful command description to show in help menu',
  execute: async (
    interaction: interaction,
  ): Promise<void> => {
    if (!interaction.data) return;
    if (!interaction.data.options) return;
    if (interaction.data.options[0].value === '') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const returnedinteraction: any = await methods.reply(
      interaction,
      'LOADING, PLEASE WAIT ...',
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchTerm: any =
      interaction.data.options[0].value;
    const returnedObject: returnobject = await wiki.getWikiObject(
      searchTerm,
    );
    //console.log(returnedObject.wiki?.refs);

    let desc = '';
    for (let i = 0; i < 34; i++) {
      if (!returnedObject.wiki?.refs) return;
      let link = returnedObject.wiki?.refs[i];
      if (
        returnedObject.wiki?.refs[i].startsWith(
          'https://',
        ) === true ||
        returnedObject.wiki?.refs[i].startsWith(
          'http://',
        ) === true
      ) {
        // https://stackoverflow.com/questions/569137/how-to-get-domain-name-from-url
        link = `[${link.replace(
          /.+\/\/|www.|\..+/g,
          '',
        )}](${returnedObject.wiki?.refs[i]})`;
      }
      desc += ` >> ${link} <<\n`;
    }
    console.log(returnedinteraction, desc);
    const title =
      'References for ' + returnedObject.wiki?.title;
    await methods.embed.defaultEmbed(
      returnedinteraction.data.token,
      {
        title,
        desc,
      },
    );
    await methods.deleteOriginal(
      returnedinteraction.data.token,
    );
  },
};
