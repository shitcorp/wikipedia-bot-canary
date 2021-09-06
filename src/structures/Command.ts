import { SlashCommand, SlashCommandOptions, SlashCreator } from 'slash-create';
import { GREEN } from '../config';
import { Embed, logger } from '../utils';

export default class Command extends SlashCommand {
  public logger = logger;

  constructor(creator: SlashCreator, opts: SlashCommandOptions) {
    super(creator, opts);

    logger.debug({
      name: opts.name,
      description: opts.description,
      options: opts.options
    });
  }
  getHelpEmbed() {
    return new Embed().setAuthor(`Wikipedia - ${this.commandName}`).setDescription(this.description).setColor(GREEN);
  }
}
