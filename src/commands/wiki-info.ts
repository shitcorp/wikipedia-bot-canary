import { CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { Command } from '../structures/';
import { Embed } from '../utils';
import wiki from 'wikijs';

export default class WikiCommand extends Command {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'wiki-info',
      description: 'Returns the general information about the search term.',
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

    const article = await wiki().find(ctx.options.search);
    const wikiEmbed = new Embed()
      .setAuthor('Wikipedia Bot')
      .setDescription(article.fullInfo().toString())
      .setColor('0099ff')
      .setURL(article.url());

    if (await article.mainImage()) wikiEmbed.setThumbnail(await article.mainImage());

    return {
      embeds: [wikiEmbed]
    };
  }
}
