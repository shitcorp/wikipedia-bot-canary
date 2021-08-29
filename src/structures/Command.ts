import { SlashCommand, SlashCommandOptions, SlashCreator } from 'slash-create';
import { logger } from '../utils';

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
}
