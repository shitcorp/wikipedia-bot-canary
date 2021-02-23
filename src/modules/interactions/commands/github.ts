import methods from '../methods';
import { interaction } from '../../../@types/interaction';
import { Command, CommandRaw } from '../../../@types/cmd';

export const raw: CommandRaw = {
  name: 'github',
  description:
    'Returns the link to the github repository of this project.',
};

export const command: Command = {
  // the id that discord returned us, we will need this
  // for the interaction handler
  id: '803360609172586546',
  name: 'github',
  help: 'useful command description to show in help menu',
  execute: async (
    interaction: interaction,
  ): Promise<void> => {
    await methods.embed.defaultWikiEmbed(
      interaction.token,
      {
        title: 'Fork us on Github',
        desc: `
        This project lives from community input, so whether its just submitting an issue, requesting a feature, or contributing code, every contribution is welcome and appreciated <3
        `,
        url:
          'https://github.com/wikipedia-bot/wikipedia-bot-canary',
      },
    );
  },
};
