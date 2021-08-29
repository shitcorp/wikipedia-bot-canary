import { SlashCreator, CommandContext } from 'slash-create';
import { Command } from '../structures/';
import { Embed } from '../utils';
import { partners } from '../config';

export default class WikiCommand extends Command {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'partners',
      description: 'Some projects of partners'
    });
  }

  async run(ctx: CommandContext) {
    ctx.defer();
    const partnerEmbed = new Embed().setAuthor('Wikipedia Bot').setColor('0099ff');

    for (const partner of partners) {
      partnerEmbed.addField(partner.name, `${partner.description}\n[Read more](${partner.link})`, true);
    }

    return {
      embeds: [partnerEmbed]
    };
  }
}
