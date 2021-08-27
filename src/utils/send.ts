import { CommandContext, MessageOptions } from 'slash-create';
import { Embed } from './index';
import trimLength from './trimLength';

export const settings: MessageOptions = {
  allowedMentions: {
    everyone: false,
    roles: false,
    users: false
  }
};

export default (ctx: CommandContext, content: string | Embed) => {
  if (typeof content === 'string') {
    ctx.send(trimLength(content, 2000), settings);
  } else {
    ctx.send({
      embeds: [content.toJSON()],
      ...settings
    });
  }
};
