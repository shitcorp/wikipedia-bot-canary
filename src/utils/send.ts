import { CommandContext, MessageOptions } from 'slash-create';
import { Embed } from './index';

export const settings: MessageOptions = {
  allowedMentions: {
    everyone: false,
    roles: false,
    users: false
  }
};

export default (ctx: CommandContext, content: string | Embed) => {
  if (typeof content === 'string') {
    ctx.send(content, settings);
  } else {
    ctx.send({
      ...content.toJSON(),
      ...settings
    });
  }
};
