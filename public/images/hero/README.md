# Hero collage photos

Drop the real event/activation photos for the homepage hero reel here, then list
them in `src/site.config.ts` under `heroCollage`.

Guidelines:
- Web-ready: ~1200px wide, JPG or WebP, ideally under ~500KB each (the originals
  in Drive are 15–27MB, which is far too large to serve directly).
- 10–15 images works best for the two-row scrolling collage.
- Landscape or square crop reads best in the reel tiles.

Then add entries like:

    { src: "/images/hero/nutrl-tailgate.jpg", alt: "NÜTRL campus tailgate", seed: "nutrl-1" }

Leaving `heroCollage` empty falls back to the stock event photos.
