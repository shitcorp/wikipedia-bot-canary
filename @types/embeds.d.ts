/**
The MIT License (MIT)

Copyright (c) 2016-2021 abalabahaha

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


https://github.com/abalabahaha/eris/blob/master/index.d.ts
*/

export interface EmbedOptions {
  author?: EmbedAuthorOptions;
  color?: number;
  description?: string;
  fields?: EmbedField[];
  footer?: EmbedFooterOptions;
  image?: EmbedImageOptions;
  thumbnail?: EmbedImageOptions;
  timestamp?: Date | string;
  title?: string;
  url?: string;
}

export interface EmbedAuthorOptions {
  icon_url?: string;
  name: string;
  url?: string;
}

export interface EmbedImageOptions {
  url?: string;
}

export interface EmbedFooterOptions {
  icon_url?: string;
  text: string;
}

interface EmbedField {
  inline?: boolean;
  name: string;
  value: string;
}
