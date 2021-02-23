import {
  ApplicationCommandInteractionData,
  InteractionType,
  Snowflake,
} from 'slash-commands';
import { GuildMember } from '../../@types/interaction';

export default class Interaction {
  id: Snowflake;
  type: InteractionType; // InteractionType (1-2)
  token: string;
  guild_id: string;
  channel_id: string;
  member: GuildMember;
  data?: ApplicationCommandInteractionData;
  constructor({
    id,
    type,
    token,
    guild_id,
    channel_id,
    member,
    data,
  }: {
    id: Snowflake;
    type: InteractionType;
    token: string;
    guild_id: string;
    channel_id: string;
    member: GuildMember;
    data?: ApplicationCommandInteractionData;
  }) {
    this.id = id;
    this.type = type;
    this.token = token;
    this.guild_id = guild_id;
    this.channel_id = channel_id;
    this.member = member;
    this.data = data;
  }
}
