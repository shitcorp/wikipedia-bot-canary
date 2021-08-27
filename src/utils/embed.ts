import { EmbedOptions, EmbedField } from '../../@types/embeds';
import trimLength from './trimLength';

// interface EmbedObject {
//   title?: string;
//   url?: string;
//   description?: string;
//   author?: EmbedAuthorOptions;
//   color?: number;
//   fields?: Embed[];
//   // image?: string;
//   thumbnail?: string;
//   timestamp?: number;
//   footer?: EmbedFooterOptions;
//   //  ^
//   readonly createdAt?: Date;
// }

/**
 * Max length of each item
 *
 * https://discord.com/developers/docs/resources/channel#embed-limits
 */
const titleLen = 256;
const descriptionLen = 4096;
const fieldNameLen = 256;
const fieldValueLen = 1024;
const footerTextLen = 2048;
const authorNameLen = 256;

/**
 * Creates an Embed
 */
export default class Embed {
  private embed: EmbedOptions = {};

  /**
   * Adds a field to the embed (max 25).
   * @param name
   * @param value
   * @param inline
   */
  public addField(name: string, value: string | number | boolean, inline = false): this {
    if (!this.embed.fields) {
      this.embed.fields = [];
    }

    // if 25 or more embeds, don't add more
    if (this.embed.fields.length >= 25) return this;

    // if value is a number, make it a string
    if (typeof value === 'number') value = value.toString();
    // if value is a boolean, make it a string
    else if (typeof value === 'boolean') value = value.toString();

    const field: EmbedField = {
      name: trimLength(name, fieldNameLen),
      value: trimLength(value, fieldValueLen),
      inline
    };

    this.embed.fields.push(field);

    return this;
  }

  /**
   * Sets the author of this embed.
   * @param name
   * @param iconURl
   * @param url
   */
  public setAuthor(name: string, iconURl = '', url = ''): this {
    this.embed.author = { name: trimLength(name, authorNameLen) };

    if (iconURl) {
      this.embed.author.icon_url = iconURl;
    }

    if (url) {
      this.embed.author.url = url;
    }

    return this;
  }

  /**
   * Sets the color of this embed.
   * @param color
   */
  public setColor(color: number): this {
    this.embed.color = color;

    return this;
  }

  /**
   * Sets the description of this embed.
   * @param description
   */
  public setDescription(description: string): this {
    this.embed.description = trimLength(description, descriptionLen);

    return this;
  }

  /**
   * Sets the footer of this embed.
   * @param text
   * @param iconURl
   */
  public setFooter(text: string, iconURl = ''): this {
    this.embed.footer = { text: trimLength(text, footerTextLen) };

    if (iconURl) {
      this.embed.footer.icon_url = iconURl;
    }

    return this;
  }

  /**
   * Sets the image of this embed.
   * @param url
   */
  public setImage(url: string): this {
    this.embed.url = url;

    return this;
  }

  /**
   * Sets the timestamp of this embed.
   * @param url
   */
  public setThumbnail(url: string): this {
    this.embed.thumbnail = { url };

    return this;
  }

  /**
   * Sets the title of this embed.
   * @param title
   */
  public setTitle(title: string): this {
    this.embed.title = trimLength(title, titleLen);

    return this;
  }

  /**
   * Sets the URL of this embed.
   * @param url
   */
  public setURL(url: string): this {
    this.embed.url = url;

    return this;
  }

  /**
   * Sets the timestamp of this embed.
   * @param timestamp
   */
  public setTimestamp(timestamp: Date | number = Date.now()) {
    // if date object, get time in ms
    if (timestamp instanceof Date) timestamp = timestamp.getTime();

    this.embed.timestamp = new Date(timestamp).toISOString();
    return this;
  }

  /**
   * Converts embed to JSON
   * @returns embed
   */
  public toJSON(): EmbedOptions {
    return this.embed;
  }
}
