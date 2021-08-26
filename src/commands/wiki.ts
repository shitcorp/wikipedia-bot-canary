import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import wiki from 'wikijs';
import { logger } from '../utils';

export default class WikiCommand extends SlashCommand {
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

        ctx.send(summary);
      })
      .catch(() => {
        ctx.send('an error happened');
      });

    // return ctx.options.search ? `You like ${ctx.options.search}? Nice!` : `Hello, ${ctx.member.displayName}!`;
  }
}
