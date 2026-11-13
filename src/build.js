// Builds the printable coloring book PDF.
//   node src/build.js              -> output/animal-friends-coloring-book.pdf
//   node src/build.js --blank-backs -> adds a blank page after every picture
//                                     (so markers don't bleed through)
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { animals, colorize } from './animals.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'output');
const args = new Set(process.argv.slice(2));
const TITLE = 'Animal Friends';
const SUBTITLE = 'A Coloring Book for Kids';

const art = (inner, size = '100%') => `
  <svg viewBox="0 0 400 400" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <g fill="#fff" stroke="#111" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">${inner}</g>
  </svg>`;

const page = (body, cls = '') => `<section class="page ${cls}"><div class="frame">${body}</div></section>`;
const blank = '<section class="page blank"></section>';

const rainbow = ['#FF5C8A', '#FF9F1C', '#FFD23F', '#4CC38A', '#3BA4F5', '#8E6CCF'];
const colorTitle = (text) => {
  let n = 0;
  return text.split('').map((ch) => (ch === ' ' ? '<br>' : `<span style="color:${rainbow[n++ % rainbow.length]}">${ch}</span>`)).join('');
};
const tiles = ['#FFF1C9', '#FFDDE7', '#D6F0FF', '#E6DCFA'];
const cover = page(`
  <h1 class="outline big">${colorTitle(TITLE)}</h1>
  <div class="cover-grid">
    ${animals.slice(0, 4).map((a, i) => `<div style="background:${tiles[i]}">${art(colorize(a.svg, a.coverColors))}</div>`).join('')}
  </div>
  <p class="sub">${SUBTITLE}</p>`, 'cover');

const owner = page(`
  <h2 class="outline">This book belongs to</h2>
  <div class="nameline"></div>
  <div class="owner-art">${art(animals[11].svg)}</div>
  <p class="hint">Color the bear, then turn the page to meet more animal friends!</p>`);

const pictures = animals.map((a) => page(`
  <h2 class="outline name">${a.name}</h2>
  <div class="art">${art(a.svg)}</div>`));

const pages = [cover, owner];
for (const p of pictures) {
  if (args.has('--blank-backs')) pages.push(blank);
  pages.push(p);
}

const fontUrl = pathToFileURL(join(root, 'fonts', 'Fredoka-Bold.ttf')).href;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Fredoka; src: url('${fontUrl}'); font-weight: 700; }
  @page { size: 8.5in 11in; margin: 0; }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: Fredoka, sans-serif; color: #111; }
  .page { width: 8.5in; height: 11in; padding: 0.5in; page-break-after: always; overflow: hidden; }
  .frame { height: 100%; border: 6px solid #111; border-radius: 28px; padding: 0.35in;
           display: flex; flex-direction: column; align-items: center; justify-content: space-between; }
  .outline { color: #fff; -webkit-text-stroke: 3px #111; paint-order: stroke fill; font-weight: 700;
             letter-spacing: 2px; text-align: center; line-height: 1.05; }
  .big { font-size: 76pt; -webkit-text-stroke: 4px #111; }
  h2 { font-size: 46pt; }
  .name { font-size: 80pt; -webkit-text-stroke: 4px #111; }
  .art { width: 6.4in; height: 6.4in; margin-bottom: 0.3in; }
  .cover-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.15in; width: 6in; }
  .cover-grid div { aspect-ratio: 1; }
  .cover .frame { background: linear-gradient(#BFE6FF, #E9F7FF 55%, #C9F2D4); }
  .cover .big { font-size: 84pt; text-shadow: 4px 5px 0 #111; }
  .cover-grid div { border: 5px solid #111; border-radius: 24px; padding: 6px; }
  .sub { font-size: 26pt; }
  .cover .sub { background: #FF5C8A; color: #fff; border: 5px solid #111; border-radius: 999px;
                padding: 0.08in 0.4in; -webkit-text-stroke: 1.5px #111; paint-order: stroke fill; }
  .nameline { width: 80%; border-bottom: 5px solid #111; height: 0.9in; }
  .owner-art { width: 5in; height: 5in; }
  .hint { font-size: 17pt; text-align: center; }
</style></head><body>${pages.join('')}</body></html>`;

mkdirSync(outDir, { recursive: true });
const htmlPath = join(outDir, 'book.html');
writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const tab = await browser.newPage();
await tab.goto(pathToFileURL(htmlPath).href);
await tab.evaluate(() => document.fonts.ready);
const pdfPath = join(outDir, 'animal-friends-coloring-book.pdf');
await tab.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });

await browser.close();
console.log(`Wrote ${pdfPath} (${pages.length} pages)`);
