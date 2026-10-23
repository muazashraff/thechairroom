# Adding your own photos

Every photo on the site is currently a labelled placeholder (a dashed box
with "PHOTO: ..." text). To replace one, drop a file at the exact path
below — same name, any of `.jpg`, `.jpeg`, `.png` or `.webp`. Nothing else
needs to change: the site finds the file automatically, runs it through
Astro's image pipeline (AVIF/WebP, responsive sizes, lazy loading) and
swaps out the placeholder.

```
src/assets/images/
  hero/
    full-setup.jpg       ← Hero photo. Wide shot of a full setup, daylight.
  gallery/
    full-setup.jpg       ← Wide shot of a full chair + table setup in a hall
    row-of-chairs.jpg    ← A neat row of chairs, low angle
    wood-closeup.jpg     ← Close-up of a chair back showing the wood
    seatpad-closeup.jpg  ← Close-up of the grey seat pad
    table-setup.jpg      ← A table with a few chairs set up around it
    chairs-stacked.jpg   ← Chairs stacked/loaded, ready to go
```

Tips for the phone shoot:

- Landscape for `hero/full-setup` and `gallery/full-setup` and
  `gallery/table-setup` (they sit in wide frames).
- Portrait works best for `gallery/row-of-chairs` and
  `gallery/chairs-stacked` (they sit in tall frames).
- Square-ish crops work best for the two close-ups.
- Natural light, no clutter in the background.
- Large source files are fine — Astro resizes and compresses them at
  build time. There's no need to resize anything yourself first.

If you only have some of the photos, that's fine — any slot without a
matching file keeps showing its placeholder until you add one.
