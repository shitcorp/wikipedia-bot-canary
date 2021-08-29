import { trimLength } from '../utils';

export default class Article {
  summary: string;
  image: string;
  url: string;
  // time the article was cached
  private cached: number;
  constructor({ summary, image, url }: { summary: string; image: string; url: string }) {
    this.summary = trimLength(summary) || null;
    this.image = image || null;
    this.url = url || null;
    return this;
  }
  setSummary(summary: string) {
    this.summary = trimLength(summary);
    return this;
  }
  setImage(image: string) {
    this.image = image;
    return this;
  }
  setUrl(url: string) {
    this.url = url;
    return this;
  }
  toString() {
    return JSON.stringify({ summary: this.summary, image: this.image, url: this.url, cached: this.cached });
  }
  toJSON() {
    return JSON.stringify({ summary: this.summary, image: this.image, url: this.url, cached: this.cached });
  }
  cache() {
    this.cached = Date.now();
    return this.toJSON();
  }
}
