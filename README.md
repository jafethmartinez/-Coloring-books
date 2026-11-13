# Coloring Books

## Animal Friends — a coloring book for kids

**[Download the PDF](output/animal-friends-coloring-book.pdf)**: 14 letter-size pages (8.5 × 11 in).

- Cover page
- "This book belongs to ____" page
- 12 animals: Cat, Dog, Fish, Owl, Turtle, Elephant, Lion, Bunny, Pig, Frog, Snail, Bear

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
