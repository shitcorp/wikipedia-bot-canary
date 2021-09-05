import { CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { Command } from '../structures/';
import { Embed } from '../utils';
import wiki from 'wikijs';

export default class WikiCommand extends Command {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'settings',
      description: 'Returns the general information about the search term.',
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'set',
          description: 'Set a new value',
          options: [
            {
              type: CommandOptionType.STRING,
              name: 'language',
              description: 'The language the bot uses to respond to you',
              choices: [
                {
                  name: 'English',
                  value: 'en'
                },
                {
                  name: 'German',
                  value: 'de'
                }
              ]
            }
          ]
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'get',
          description: 'Get the current settings values'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    // if no options is given
    console.log(ctx.options);
    ctx.defer();

    return `So you are ${ctx.options.set.language}`;
  }
}
