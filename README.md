# Coloring Books

## Animal Friends — a coloring book for kids

**[Download the PDF](output/animal-friends-coloring-book.pdf)**: 26 letter-size pages (8.5 × 11 in).
Everything except the cover is in [one PDF](output/animal-friends-interior-no-cover.pdf) (25 pages).
Every page is also saved as its own PDF in [`output/pages/`](output/pages/).

- Cover page
- "This book belongs to ____" page
- 24 animals: Cat, Dog, Fish, Owl, Turtle, Elephant, Lion, Bunny, Pig, Frog, Snail, Bear,
  Duck, Penguin, Giraffe, Monkey, Mouse, Cow, Sheep, Panda, Fox, Octopus, Whale, Crab

Every picture uses big, simple shapes and thick outlines, made for ages 3–8.

### Printing tips
- Print at **100% / "Actual size"**, not "Fit to page".
- Using markers? Print one-sided, or build the version with blank backs (below) so ink doesn't bleed through.

### Rebuilding or editing the book
The drawings are plain SVG code in `src/animals.js`. Change one, or add a new animal, then run:

```bash
npm install playwright   # one time only
node src/build.js                # -> output/animal-friends-coloring-book.pdf
node src/build.js --blank-backs  # adds a blank page behind every picture
```

The title font is [Fredoka](https://fonts.google.com/specimen/Fredoka) (SIL Open Font License).

## Amazon KDP (paperback) files

Ready-to-upload files are in [`output/kdp/`](output/kdp/), for two trim sizes:

| Trim size | Interior (upload as "Manuscript") | Cover (front + spine + back) |
|---|---|---|
| **6 × 9 in** | `animal-friends-interior-6x9.pdf` (25 pages) | `animal-friends-kdp-cover-6x9.pdf` (12.306 × 9.25 in) |
| 8.5 × 11 in | `animal-friends-interior-8.5x11.pdf` (25 pages) | `animal-friends-kdp-cover-8.5x11.pdf` (17.306 × 11.25 in) |

KDP settings to choose: **Black & white interior, white paper**, trim size to match the files,
**Bleed: No bleed**, cover finish matte or glossy. The cover already includes 0.125 in bleed
and leaves the bottom-right of the back cover empty for the barcode.

Rebuild them with:
```bash
node src/build.js --trim=6x9 && node src/kdp-cover.js --trim=6x9
```
(Exact page sizes are set with `tools/set_pdf_size.py`, which needs `pip install pypdf`.)
