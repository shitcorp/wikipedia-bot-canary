import { CommandOptionType, SlashCreator, CommandContext, ApplicationCommandType } from 'slash-create';
// import { francAll } from 'franc';
import { BLUE } from '../config';
import { Command } from '../structures/';
import { Embed, getArticle, logger } from '../utils';

export default class WikiCommand extends Command {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'search with wikipedia',
      type: ApplicationCommandType.MESSAGE,
      guildIDs: process.env.NODE_ENV === 'production' ? [] : [process.env.DEV_GUILD],
      description: 'The normal wiki command used for getting short summaries of something the user searched for.'
    });
  }

  async run(ctx: CommandContext) {
    ctx.defer();

    const messages = ctx.data.data.resolved.messages;
    const searchTerm = messages[Object.keys(messages)[0]].content;

    const article = await getArticle(searchTerm);
    const wikiEmbed = new Embed()
      .setAuthor('Wikipedia Bot')
      .setTitle(searchTerm)
      .setDescription(article.summary)
      .setColor(BLUE)
      .setURL(article.url);

    if (article.image) wikiEmbed.setThumbnail(article.image);

    return {
      embeds: [wikiEmbed]
    };
  }
}
