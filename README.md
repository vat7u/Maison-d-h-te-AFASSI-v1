# Maison d'hôtes Afassi Website Blueprint

## System Overview

Static marketing and booking-request website for Maison d'hôtes Afassi, a
guesthouse in Chefchaouen, Morocco. Copy is in French. Three HTML pages share
one stylesheet and plain JavaScript; there is no framework, bundler or
server-side code.

- `index.html` — home page: hero slider, story, partner logos, rooms,
  guest reviews (navy band), booking-request form, latest journal posts,
  photo strip.
- `blog.html` — journal list with category tabs and a featured post.
- `article.html` — one journal post, selected by the `p` query parameter.
- `styles.css` — page styles built on the design-system tokens in `ds/`.

Every page loads `ds/styles.css` then `styles.css`. Script order on the home
page is `blog/posts.js` → `blog/blog.js` → `site.js` → `reviews/ratings.js`
→ `reviews/mock-reviews.js` → `reviews/reviews.js` → `script.js`
(`index.html:320-326`). `blog.html` and `article.html` also carry an inline
script (see "Inline scripts" below).

## Local Interface & Invariants

### `site.js` (loaded by all three pages)

- `showToast(text)` — shows the `.toast` status message for 3.2 s, creating
  the element on first use.
- `observeFades(root = document)` — observes `.fade:not(.in)` elements under
  `root` and adds `in` when 12 % of one is visible.
- Site language (`site.js:23-55`): `SITE_LANGS` (`fr`, `en`, `ar`, `es`),
  `getSiteLang()` and `setSiteLang(lang)`. The `.lang-switch button[data-lang]`
  buttons call `setSiteLang`, which updates `aria-pressed`, saves the choice
  in `localStorage` under `afassi-lang`, and dispatches `afassi:langchange`
  on `document` with `detail.lang`. Choosing `en`, `ar` or `es` also shows a
  "coming soon" toast from `comingSoon`: only the reviews section follows the
  language; page copy and `<html lang>` stay French.
- Invariant: `site.js` adds the `js` class to `<html>` (`site.js:2`), which
  hides every `.fade` element until it gets `in` (`styles.css:438-439`;
  under `prefers-reduced-motion` they stay visible, `styles.css:443`). Content inserted after
  `site.js` runs must be passed to `observeFades`, or `site.js` must load after
  it (`article.html:131` loads it last for this reason).

### `script.js` (home page only)

- Hero slider over `.hero-slide` images: the `is-active` class rotates every
  6000 ms, dot buttons are generated in `#hero-dots`, and it pauses on hover
  and while the tab is hidden. With `prefers-reduced-motion: reduce` it does
  not advance on its own.
- Partner logo slider (`fillTrack`, `script.js:35-57`): clones
  `.partner-track .partner-list` (copies get `aria-hidden` and empty `alt`)
  until the band is full, sets `--partner-shift` to one list width and
  `--partner-duration` to about 40 px/s, and adds `is-running`; it refills
  on resize. With `prefers-reduced-motion: reduce` nothing is cloned and the
  logos stay still.
- `rooms` map (`indigo`, `safran`, `menthe`) and `showRoom(id)` keep the
  booking summary card in sync with `#room-select` and with `[data-room]`
  buttons.
- Invariant: each `[data-room]` value and each `#room-select` option value
  must be a key of `rooms` (`script.js:71-75`), or `showRoom` throws.
- Invariant: only the first `.partner-list` in the HTML is the source; add or
  remove logos there, never in the generated copies.
- Invariant: `script.js` needs `AFASSI_POSTS`, `postCard` (from `blog/`) and
  `observeFades` (from `site.js`) to be loaded first (`script.js:101-102`).

### Inline scripts (journal pages)

- `blog.html:101-141` — builds the category tabs from `AFASSI_POSTS`
  (`Toutes` plus each distinct `category`), reads the optional `?cat=` query
  parameter, and renders the featured post (only on `Toutes`), the card grid
  and the empty message. Clicking a tab updates the address with
  `history.replaceState` (`blog.html:137`) and calls `observeFades`.
- `article.html:89-130` — finds the post whose `slug` equals the `p` query
  parameter. If none matches it renders an "Article introuvable" section with
  a link back to `blog.html`; otherwise it sets `document.title`, appends a
  `<meta name="description">` from `excerpt`, renders the article with
  `renderBody`, and lists up to three other posts as related cards.
- Invariant: on `article.html` this script runs before `site.js`
  (`article.html:131`), so the first `observeFades()` call in `site.js`
  picks up the elements it inserts; `blog.html` loads `site.js` first
  (`blog.html:100`) and therefore calls `observeFades()` itself.
- Invariant: both pages load `blog/posts.js` then `blog/blog.js` before the
  inline script (`blog.html:98-99`, `article.html:87-88`).

## Subdirectories & System Boundaries

- blog: [./blog/README.md](./blog/README.md) — journal post data
  (`AFASSI_POSTS`) and HTML rendering helpers (`postCard`, `renderBody`,
  `formatDate`, `readingTime`, `postUrl`, `escapeHtml`).
- reviews: [./reviews/README.md](./reviews/README.md) — home-page reviews
  section: static platform ratings (`AFASSI_RATINGS`), temporary fictional
  reviews (`AFASSI_REVIEWS`, `isMock: true`) and the renderer that shows only
  reviews in the site language as an endless scrolling strip on a navy band,
  right to left for Arabic.
- ds (no contract; stylesheets and images only) — copy of the AFASSI Design
  System: `ds/styles.css` imports `ds/tokens/*.css` (fonts, colours,
  typography, spacing, effects, base). `ds/assets/` holds the logo files.
- images (no contract; images only) — `hero/` (local slider photo
  `moto-chefchaouen.webp`), `blog/` (empty; for journal photos) and
  `partners/` (the eight motorcycle group logos shown in the partner
  slider), plus `logo.png` and `logo-light.png`, which no page references.

## Global Invariants

- Stylesheet and script links carry a shared cache tag (`?v=21`). Bump it on
  all three pages together after changing CSS or JS so browsers fetch the new
  files.
- Colours, fonts, spacing and radii come from the custom properties in
  `ds/tokens/*.css` (for example `--navy-800`, `--font-script`,
  `--radius-pill`). `styles.css` builds on those tokens; its few raw
  `rgba()` values are translucent versions of token colours (focus ring,
  shades, hairlines).
- Header, navigation and footer markup is repeated in each HTML file;
  changing one requires the same edit in all three. The menu's "Avis" link
  targets `#avis` (the reviews band; on the journal pages `index.html#avis`).
  The header row is `.site-nav`, then `.nav-social` (Instagram via the Lucide `icon-instagram`
  glyph, Tripadvisor as an inline SVG; both open the guesthouse's real pages
  in a new tab), then `.lang-switch`. The footer Instagram icon uses the same
  address; its Facebook link is still a `href="#"` placeholder.

## Global Side Effects

- Network: Google Fonts and the Lucide icon font are loaded through
  `@import` in `ds/tokens/fonts.css`; most photos load from
  `images.unsplash.com`, while the first hero slide and the partner logos
  are local files under `images/`.
- Outbound links: the header and footer Instagram icons, the photo-strip
  Instagram text and the header Tripadvisor icon open the guesthouse's
  external pages in a new tab (`target="_blank" rel="noopener"`).
- Placeholder links (`href="#"`) remain for the footer Facebook icon and the
  footer legal links ("Mentions légales", "Confidentialité").
- The booking form (`#booking-form`) sends nothing: `script.js:92-98`
  prevents submission, opens `#booking-dialog`, and resets the form.
- Storage: `site.js` keeps the chosen language in `localStorage`
  (`afassi-lang`); access is wrapped in `try`, so blocked storage falls back
  to French. No cookies or backend calls.
- The reviews section loads country flags from `flagcdn.com`, platform logos
  from Google's favicon service (`www.google.com/s2/favicons`), and the Noto
  Naskh Arabic font from Google Fonts (`index.html`).

## System Verification

- Run: `<test-command>` (no package manifest or test suite is configured).
- Manual check: `python -m http.server 5500` (the `site` entry in
  `.claude/launch.json`), then open `/`, `/blog.html` and `/article.html?p=le-rif-a-moto`.
