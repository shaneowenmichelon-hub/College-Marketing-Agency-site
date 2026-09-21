# Hero collage photos (drag-and-drop)

Any image you drop in THIS folder (`public/images/hero/`) automatically appears
in the homepage hero collage — no code change needed. Files are read at build
time and served optimized (AVIF/WebP, resized, lazy) via next/image.

Guidelines:
- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif`.
- 10–15 landscape/square photos works best for the two scrolling rows.
- Any resolution is fine (next/image resizes for you), but keep originals under
  ~8MB each so the repo stays lean.
- They render in filename order — prefix with `01-`, `02-`, … to control order.

When this folder has no images, the collage falls back to stock event photos.
