import type puppeteerCore from 'puppeteer-core';

// The default export of both `puppeteer` and `puppeteer-core` share this shape.
export type PuppeteerLike = typeof puppeteerCore;
