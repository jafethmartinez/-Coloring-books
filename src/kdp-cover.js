// Builds the full wraparound paperback cover for Amazon KDP:
// back cover + spine + front cover in one PDF, with 0.125" bleed on every side.
//   node src/kdp-cover.js              -> 6 x 9 in book (default)
//   node src/kdp-cover.js --trim=8.5x11 -> 8.5 x 11 in book
// Settings must match what is chosen in KDP: the same trim size, no bleed
// interior, black & white on white paper, and the interior page count below.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { animals, colorize } from './animals.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'output', 'kdp');

const trimArg = (process.argv.find((a) => a.startsWith('--trim=')) || '--trim=6x9').slice(7);
const [TRIM_W, TRIM_H] = trimArg.split('x').map(Number);
const BLEED = 0.125;
const k = Math.min(TRIM_W / 8.5, TRIM_H / 11); // scales the 8.5 x 11 design to fit
const u = (v, unit = 'in') => `${+(v * k).toFixed(4)}${unit}`;
const PAGE_COUNT = 1 + animals.length; // "belongs to" page + one page per animal
const SPINE = +(PAGE_COUNT * 0.002252).toFixed(4); // KDP: white paper, B&W
const W = +(2 * BLEED + 2 * TRIM_W + SPINE).toFixed(4);
const H = TRIM_H + 2 * BLEED;
const FRONT_X = BLEED + TRIM_W + SPINE; // left edge of the front cover's trim
const SAFE = +(0.5 * k).toFixed(3); // keep everything this far inside the trim line

const art = (inner) => `
  <svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <g fill="#fff" stroke="#111" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">${inner}</g>
  </svg>`;
const rainbow = ['#FF5C8A', '#FF9F1C', '#FFD23F', '#4CC38A', '#3BA4F5', '#8E6CCF'];
const colorText = (text, br = true) => {
  let n = 0;
  return text.split('').map((ch) => (ch === ' ' ? (br ? '<br>' : ' ') : `<span style="color:${rainbow[n++ % rainbow.length]}">${ch}</span>`)).join('');
};
const tiles = ['#FFF1C9', '#FFDDE7', '#D6F0FF', '#E6DCFA'];
const byName = (n) => animals.find((a) => a.name === n);
const backAnimals = ['Turtle', 'Elephant', 'Lion', 'Bunny', 'Panda', 'Penguin', 'Giraffe', 'Octopus', 'Fox'].map(byName);

const front = `
  <div class="panel" style="left:${FRONT_X + SAFE}in">
    <h1 class="outline big">${colorText('Animal Friends')}</h1>
    <div class="grid2">
      ${animals.slice(0, 4).map((a, i) => `<div style="background:${tiles[i]}">${art(colorize(a.svg, a.coverColors))}</div>`).join('')}
    </div>
    <p class="pill">A Coloring Book for Kids</p>
  </div>`;

const back = `
  <div class="panel back" style="left:${BLEED + SAFE}in">
    <h2 class="outline">${colorText(`Meet ${animals.length} Animal Friends!`, false)}</h2>
    <div class="grid4">
      ${backAnimals.map((a, i) => `<div style="background:${tiles[i % 4]}">${art(a.svg)}</div>`).join('')}
    </div>
    <div class="blurb">
      <p>Big, simple pictures with thick, bold lines that are easy for little hands to color.</p>
      <ul>
        <li>${animals.length} cute animals to color</li>
        <li>Animal names in big bubble letters</li>
        <li>Made for ages 3–8</li>
        <li>${TRIM_W} × ${TRIM_H} inch pages</li>
      </ul>
    </div>
  </div>`;

const fontUrl = pathToFileURL(join(root, 'fonts', 'Fredoka-Bold.ttf')).href;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Fredoka; src: url('${fontUrl}'); font-weight: 700; }
  @page { size: ${W}in ${H}in; margin: 0; }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: Fredoka, sans-serif; color: #111; }
  .sheet { position: relative; width: ${W}in; height: ${H}in; overflow: hidden;
           background: linear-gradient(#BFE6FF, #E9F7FF 55%, #C9F2D4); }
  .panel { position: absolute; top: ${BLEED + SAFE}in; width: ${TRIM_W - 2 * SAFE}in; height: ${TRIM_H - 2 * SAFE}in;
           border: ${u(6, 'px')} solid #111; border-radius: ${u(28, 'px')}; padding: ${u(0.35)};
           display: flex; flex-direction: column; align-items: center; justify-content: space-between; }
  .outline { -webkit-text-stroke: ${u(3, 'px')} #111; paint-order: stroke fill; letter-spacing: ${u(2, 'px')};
             text-align: center; line-height: 1.05; text-shadow: ${u(3, 'px')} ${u(4, 'px')} 0 #111; }
  .big { font-size: ${u(84, 'pt')}; -webkit-text-stroke: ${u(4, 'px')} #111; text-shadow: ${u(4, 'px')} ${u(5, 'px')} 0 #111; }
  h2 { font-size: ${u(40, 'pt')}; }
  .grid2, .grid4 { display: grid; gap: ${u(0.15)}; }
  .grid2 { grid-template-columns: 1fr 1fr; width: ${u(6)}; }
  .grid4 { grid-template-columns: repeat(3, 1fr); width: 88%; }
  .grid2 div, .grid4 div { aspect-ratio: 1; border: ${u(5, 'px')} solid #111; border-radius: ${u(22, 'px')}; padding: ${u(4, 'px')}; }
  .pill { font-size: ${u(26, 'pt')}; background: #FF5C8A; color: #fff; border: ${u(5, 'px')} solid #111; border-radius: 999px;
          padding: ${u(0.08)} ${u(0.4)}; -webkit-text-stroke: ${u(1.5, 'px')} #111; paint-order: stroke fill; }
  /* Leave the bottom-right corner of the back cover empty: KDP prints the barcode there. */
  .blurb { align-self: flex-start; width: 62%; background: #fff; border: ${u(5, 'px')} solid #111; border-radius: ${u(22, 'px')};
           padding: ${u(0.2)} ${u(0.25)}; font-size: ${u(17, 'pt')}; line-height: 1.3; }
  .blurb ul { margin-top: ${u(0.08)}; padding-left: ${u(0.3)}; }
</style></head><body><div class="sheet">${back}${front}</div></body></html>`;

mkdirSync(outDir, { recursive: true });
const htmlPath = join(outDir, 'cover.html');
writeFileSync(htmlPath, html);
const browser = await chromium.launch();
const tab = await browser.newPage();
await tab.goto(pathToFileURL(htmlPath).href);
await tab.evaluate(() => document.fonts.ready);
const pdfPath = join(outDir, `animal-friends-kdp-cover-${trimArg}.pdf`);
await tab.pdf({ path: pdfPath, width: `${W}in`, height: `${H}in`, printBackground: true, pageRanges: '1' });
await browser.close();
// Chromium rounds the page size slightly; make it exactly what KDP expects.
execFileSync('python3', [join(root, 'tools', 'set_pdf_size.py'), pdfPath, String(W), String(H)]);
console.log(`Wrote ${pdfPath}: ${W} x ${H} in (spine ${SPINE} in for ${PAGE_COUNT} pages)`);
