import { CommandOptionType, SlashCreator, CommandContext, ApplicationCommandType } from 'slash-create';
import { BLUE } from '../config';
import { Command } from '../structures/';
import { Embed, getArticle, logger } from '../utils';

export default class WikiCommand extends Command {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'search with wikipedia',
      type: ApplicationCommandType.MESSAGE,
      description: 'The normal wiki command used for getting short summaries of something the user searched for.'
    });
  }

  async run(ctx: CommandContext) {
    ctx.defer();
    console.log(ctx);
    logger.info(ctx);

    // @ts-ignore
    const searchTerm = ctx.data.resolved;
    console.log(searchTerm);
    return 'Hello world';

    // const article = await getArticle(ctx.options.search);
    // const wikiEmbed = new Embed()
    //   .setAuthor('Wikipedia Bot')
    //   .setDescription(article.summary)
    //   .setColor(BLUE)
    //   .setURL(article.url);

    // if (article.image) wikiEmbed.setThumbnail(article.image);

    // return {
    //   embeds: [wikiEmbed]
    // };
  }
}
