import { CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { BLUE } from '../config';
import { Command } from '../structures/';
import { Embed } from '../utils';

export default class WikiCommand extends Command {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'help',
      description: 'Information on how to use the bot and its commands.',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'cmd',
          description: 'What command do you want more information about?',
          required: false
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    if (ctx.options.cmd) {
      console.log(this.creator.commands.get(ctx.options.cmd));
      const cmd = this.creator.commands.get(ctx.options.cmd);
      if (!cmd) {
        return 'That command does not exist.';
      }
      // @ts-ignore
      return cmd.getHelpEmbed();
    }

    const helpEmbed = new Embed()
      .setAuthor('Wikipedia - Help')
      .setColor(BLUE)
      .setDescription(
        'Here are the commands you can use with wikipedia bot. To get more information about a certain command, run the command /help <cmdname>'
      );
    this.creator.commands.forEach((cmd) => {
      if (cmd.commandName === 'help') return;
      helpEmbed.addField(cmd.commandName, cmd.description, true);
    });
    ctx.defer();

    return { embeds: [helpEmbed] };
  }
}
