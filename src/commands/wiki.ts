import { CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import wiki from 'wikijs';
import { Command } from '../structures/';

export default class WikiCommand extends Command {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'wiki',
      description: 'The normal wiki command used for getting short summaries of something the user searched for.',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'search',
          description: 'What would you like to search?',
          required: true
        }
        // {
        //   type: CommandOptionType.STRING,
        //   name: 'language',
        //   description: 'Specify a language.',
        //   required: false,
        //   choices: [
        //     {
        //       name: 'de',
        //       value: 'de'
        //     }
        //   ]
        // }
      ]
    });
  }

  async run(ctx: CommandContext) {
    ctx.defer();

    wiki()
      .page(ctx.options.search)
      .then(async (page) => {
        let summary = await page.summary();

        if (summary.length >= 2000) {
          summary = summary.slice(0, 2000);
        }

        this.send(ctx, summary);
      })
      .catch(() => {
        this.send(ctx, 'an error happened');
      });

    // return ctx.options.search ? `You like ${ctx.options.search}? Nice!` : `Hello, ${ctx.member.displayName}!`;
  }
}
