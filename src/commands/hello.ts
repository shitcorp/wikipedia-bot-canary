import { CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { Command } from '../structures';

export default class HelloCommand extends Command {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'hello',
      description: 'Says hello to you.',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'food',
          description: 'What food do you like?'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    return ctx.options.food ? `You like ${ctx.options.food}? Nice!` : `Hello, ${ctx.member.displayName}!`;
  }
}
