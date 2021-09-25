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
          description: 'Specify the language.',
          required: false,
          choices: [
            {
              name: 'German',
              value: 'de'
            },
            {
              name: 'French',
              value: 'fr'
            },
            {
              name: 'Spanish',
              value: 'es'
            },
            {
              name: 'Russian',
              value: 'ru'
            },
            {
              name: 'Slovenian',
              value: 'sl'
            },
            {
              name: 'Turkish',
              value: 'tr'
            },
            {
              name: 'Yiddish',
              value: 'yi'
            }
          ]
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    ctx.defer();
    const article = await getArticle(ctx.options.search, ctx.options.language);
    const wikiEmbed = new Embed()
      .setAuthor('Wikipedia Bot')
      .setTitle(ctx.options.search)
      .setDescription(article.summary)
      .setColor(BLUE)
      .setURL(article.url);

    if (article.image) wikiEmbed.setThumbnail(article.image);

    return {
      embeds: [wikiEmbed]
    };
  }
}
