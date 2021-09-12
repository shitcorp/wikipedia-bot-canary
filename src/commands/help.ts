import { CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { Command } from '../structures/';
import { BLUE } from '../config';
import { Embed } from '../utils';

export default class WikiCommand extends Command {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'help',
      description: 'Information on how to use the bot and its commands.',
      guildIDs: process.env.NODE_ENV === 'production' ? [] : [process.env.DEV_GUILD],
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
    ctx.defer();

    const baseEmbed = new Embed().setColor(BLUE);
    if (ctx.options.cmd) {
      const cmd = this.creator.commands.find((commandName) => commandName.commandName === ctx.options.cmd);
      if (!cmd) {
        return 'That command does not exist.';
      }
      let desc = cmd.description;
      const detailEmbed = baseEmbed.setAuthor(`Command: ${ctx.options.cmd}`);
      if (cmd.options) {
        desc += '\n\n__**Command Options:**__ \n';

        cmd.options.forEach((option) => {
          console.log(option);
          let optionDesc = option.description;
          // @ts-ignore
          if (option.choices) {
            optionDesc += ` (available: \``;
            // @ts-ignore
            option.choices.forEach((choice) => {
              optionDesc += choice.name + ' | ';
            });
            optionDesc = optionDesc.slice(0, -3);
            optionDesc += `\`)`;
          }
          detailEmbed.addField(option.required ? option.name + '*' : option.name, optionDesc);
        });
        detailEmbed.setFooter('* = required');
      }
      return {
        embeds: [detailEmbed.setDescription(desc)]
      };
    }

    let output =
      '\nHere are the commands you can use with wikipedia bot. To get more information about a certain command, run the command /help <cmdname> \n\n';
    this.creator.commands.forEach((cmd) => {
      if (cmd.commandName === 'help') return;
      output += `**/${cmd.commandName}** \n > ${cmd.description}\n`;
    });

    return {
      embeds: [baseEmbed.setAuthor('Wikipedia - Help').setDescription(output)]
    };
  }
}
