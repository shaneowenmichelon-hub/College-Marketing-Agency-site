# Hero collage photos (drag-and-drop)

Any image you drop in THIS folder (`public/images/hero/`) automatically appears
in the homepage hero collage — no code change needed. Files are read at build
time and served optimized (AVIF/WebP, resized, lazy) via next/image.

Lead with **people at the activation** — attendees, ambassadors, staffed booths,
product in hand. Close-up product shots belong in `../activations/`, which is
not read automatically, so one sponsor's product never dominates the site.

## Crop them 3:2 before dropping them in

This is the one rule that matters. The collage tile is locked to **3:2
landscape** and the photo fills it. Drop in a portrait phone photo and the tile
shows a narrow horizontal band of it, scaled up — which is what made the strip
look smudged until October 2026. Crop to 3:2 yourself and the whole frame
shows, sharp.

- Target **1000 x 667** (3:2). Anything larger is fine; next/image resizes down.
- Crop so faces and the product in hand are inside the frame. Automatic
  "smart" cropping was tried and tends to cut heads off — it chases colour and
  skin tone, so it lands on torsos.

## Other guidelines

- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif`.
- 12–16 photos is a good rotation. One pass of the row has to be wider than the
  screen for the loop to hide its own repeat; below about 12 it starts to show.
- Keep each file under ~8MB so the repo stays lean.
- They render in filename order — prefix with `01-`, `02-`, … to control order.

Add alt text for a new file in `src/lib/hero-photos.ts` (the `ALT` map); files
not listed there get a generic description.

When this folder has no images, the collage falls back to `sitePhotos` in
`src/site.config.ts`. Those entries point at these same files, and
`sitePhotos[0]` is also the photo the Book a Call page shows — so if you rename
anything here, update that array too.
