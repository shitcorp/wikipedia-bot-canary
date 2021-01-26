import methods from '../methods';
import { interaction } from '../../../@types/interaction';
import { Command, CommandRaw } from '../../../@types/cmd';

export const raw: CommandRaw = {
  name: 'info',
  description:
    'Returns information about the bot and how to use it',
};

export const command: Command = {
  // the id that discord returned us, we will need this
  // for the interaction handler
  id: '803393672472166402',
  name: 'info',
  help: 'useful command description to show in help menu',
  execute: async (
    interaction: interaction,
  ): Promise<void> => {
    methods.embed.defaultEmbed(interaction.token, {
      title: 'General Bot Information',
      desc: `
      [TODO]
      `,
    });
  },
};
