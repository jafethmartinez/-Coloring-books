// Builds the printable coloring book PDF.
//   node src/build.js              -> output/animal-friends-coloring-book.pdf
//   node src/build.js --blank-backs -> adds a blank page after every picture
//                                     (so markers don't bleed through)
//   node src/build.js --trim=6x9    -> only the KDP interior (no cover) at 6 x 9 in:
//                                     output/kdp/animal-friends-interior-6x9.pdf
import { chromium } from 'playwright';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { animals, colorize } from './animals.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'output');
const args = new Set(process.argv.slice(2));
const trimArg = (process.argv.find((a) => a.startsWith('--trim=')) || '').slice(7);
const [TRIM_W, TRIM_H] = trimArg ? trimArg.split('x').map(Number) : [8.5, 11];
const k = Math.min(TRIM_W / 8.5, TRIM_H / 11); // scales the 8.5 x 11 design to fit
const u = (v, unit = 'in') => `${+(v * k).toFixed(4)}${unit}`;
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
  <h2 class="outline">This book<br>belongs to</h2>
  <div class="nameline"></div>
  <div class="owner-art">${art(animals[11].svg)}</div>
  <p class="hint">Color the bear, then turn the page to meet more animal friends!</p>`);

const pictures = animals.map((a) => page(`
  <h2 class="outline name">${a.name}</h2>
  <div class="art">${art(a.svg)}</div>`));

const pages = [cover, owner];
// File names for the one-PDF-per-page copies (null = blank page, not saved).
const names = ['cover', 'this-book-belongs-to'];
for (const [i, p] of pictures.entries()) {
  if (args.has('--blank-backs')) { pages.push(blank); names.push(null); }
  pages.push(p);
  names.push(animals[i].name.toLowerCase());
}

const fontUrl = pathToFileURL(join(root, 'fonts', 'Fredoka-Bold.ttf')).href;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Fredoka; src: url('${fontUrl}'); font-weight: 700; }
  @page { size: ${TRIM_W}in ${TRIM_H}in; margin: 0; }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: Fredoka, sans-serif; color: #111; }
  /* 0.5in page margin keeps everything inside KDP's required margins at any trim size. */
  .page { width: ${TRIM_W}in; height: ${TRIM_H}in; padding: 0.5in; page-break-after: always; overflow: hidden; }
  .frame { height: 100%; border: ${u(6, 'px')} solid #111; border-radius: ${u(28, 'px')}; padding: ${u(0.35)};
           display: flex; flex-direction: column; align-items: center; justify-content: space-between; }
  .outline { color: #fff; -webkit-text-stroke: ${u(3, 'px')} #111; paint-order: stroke fill; font-weight: 700;
             letter-spacing: ${u(2, 'px')}; text-align: center; line-height: 1.05; }
  .big { font-size: ${u(76, 'pt')}; -webkit-text-stroke: ${u(4, 'px')} #111; }
  h2 { font-size: ${u(46, 'pt')}; }
  .name { font-size: ${u(80, 'pt')}; -webkit-text-stroke: ${u(4, 'px')} #111; }
  .art { width: ${u(6.2)}; height: ${u(6.2)}; margin: auto 0; }
  .cover-grid { display: grid; grid-template-columns: 1fr 1fr; gap: ${u(0.15)}; width: ${u(6)}; }
  .cover-grid div { aspect-ratio: 1; }
  .cover .frame { background: linear-gradient(#BFE6FF, #E9F7FF 55%, #C9F2D4); }
  .cover .big { font-size: ${u(84, 'pt')}; text-shadow: ${u(4, 'px')} ${u(5, 'px')} 0 #111; }
  .cover-grid div { border: ${u(5, 'px')} solid #111; border-radius: ${u(24, 'px')}; padding: ${u(6, 'px')}; }
  .sub { font-size: ${u(26, 'pt')}; }
  .cover .sub { background: #FF5C8A; color: #fff; border: ${u(5, 'px')} solid #111; border-radius: 999px;
                padding: ${u(0.08)} ${u(0.4)}; -webkit-text-stroke: ${u(1.5, 'px')} #111; paint-order: stroke fill; }
  .nameline { width: 80%; border-bottom: ${u(5, 'px')} solid #111; height: ${u(0.9)}; }
  .owner-art { width: ${u(5)}; height: ${u(5)}; }
  .hint { font-size: ${u(20, 'pt')}; text-align: center; }
</style></head><body>${pages.join('')}</body></html>`;

mkdirSync(outDir, { recursive: true });
const htmlPath = join(outDir, 'book.html');
writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const tab = await browser.newPage();
await tab.goto(pathToFileURL(htmlPath).href);
await tab.evaluate(() => document.fonts.ready);
const fixSize = (file) => execFileSync('python3', [join(root, 'tools', 'set_pdf_size.py'), file, String(TRIM_W), String(TRIM_H)]);

if (trimArg) {
  // KDP interior only: every page except the cover, at the chosen trim size.
  mkdirSync(join(outDir, 'kdp'), { recursive: true });
  const file = join(outDir, 'kdp', `animal-friends-interior-${trimArg}.pdf`);
  await tab.pdf({ path: file, pageRanges: `2-${pages.length}`, preferCSSPageSize: true, printBackground: true });
  fixSize(file);
  await browser.close();
  console.log(`Wrote ${file} (${pages.length - 1} pages, ${TRIM_W} x ${TRIM_H} in)`);
  process.exit(0);
}

const pdfPath = join(outDir, 'animal-friends-coloring-book.pdf');
await tab.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });

// Everything except the cover, in one PDF (the "interior" for printing).
const interiorPath = join(outDir, 'animal-friends-interior-no-cover.pdf');
await tab.pdf({ path: interiorPath, pageRanges: `2-${pages.length}`, preferCSSPageSize: true, printBackground: true });

// Also save every page as its own PDF in output/pages/.
const pagesDir = join(outDir, 'pages');
rmSync(pagesDir, { recursive: true, force: true });
mkdirSync(pagesDir, { recursive: true });
let n = 0;
for (const [i, name] of names.entries()) {
  if (!name) continue;
  const file = join(pagesDir, `${String(++n).padStart(2, '0')}-${name}.pdf`);
  await tab.pdf({ path: file, pageRanges: String(i + 1), preferCSSPageSize: true, printBackground: true });
}

await browser.close();
console.log(`Wrote ${pdfPath} (${pages.length} pages) and ${n} single-page PDFs in ${pagesDir}`);
