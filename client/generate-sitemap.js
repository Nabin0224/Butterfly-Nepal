// generate-sitemap.js
import { writeFileSync } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

const sitemap = new SitemapStream({ hostname: 'https://butterflynepal.com' });

[
  '/',
  '/listing',
  '/legal',
].forEach((path) => sitemap.write({ url: path }));

sitemap.end();

streamToPromise(sitemap).then((data) => {
  writeFileSync('./public/sitemap.xml', data.toString());
  console.log('✅ sitemap.xml generated successfully');
});