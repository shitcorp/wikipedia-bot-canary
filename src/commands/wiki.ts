import { CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { BLUE } from '../config';
import { Command } from '../structures/';
import { Embed, getArticle, logger } from '../utils';

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
        },
        {
          type: CommandOptionType.STRING,
          name: 'language',
          description: 'Specify a language.',
          required: false,
          choices: [
            {
              name: 'de',
              value: 'de'
            },
            {
              name: 'fr',
              value: 'fr'
            },
            {
              name: 'es',
              value: 'es'
            },
            {
              name: 'ru',
              value: 'ru'
            },
            {
              name: 'sl',
              value: 'sl'
            },
            {
              name: 'tr',
              value: 'tr'
            },
            {
              name: 'yi',
              value: 'yi'
            }
          ]
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    console.log(ctx);
    logger.info(ctx);
    if (ctx.commandType === 3) return 'Hello world';
    ctx.defer();

    const article = await getArticle(ctx.options.search, ctx.options.language);
    const wikiEmbed = new Embed()
      .setAuthor('Wikipedia Bot')
      .setDescription(article.summary)
      .setColor(BLUE)
      .setURL(article.url);

    if (article.image) wikiEmbed.setThumbnail(article.image);

    return {
      embeds: [wikiEmbed]
    };
  }
}
