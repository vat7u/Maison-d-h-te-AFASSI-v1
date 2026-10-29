# Journal (blog)

## Overview

Client-side data and rendering helpers for the site's journal. Posts are
plain JavaScript objects in `posts.js`; `blog.js` sorts them and turns them
into HTML strings. There is no build step or server: `index.html`,
`blog.html` and `article.html` load both files as classic scripts and inject
the returned markup themselves.

## Interface

- `posts.js:window.AFASSI_POSTS` — array of post objects with the fields
  `slug`, `title`, `date`, `category`, `image`, `alt`, `excerpt`, `body`.
  `body` is an array of blocks shaped `{ p }`, `{ h }`, `{ quote }` or
  `{ list: [] }` (documented in the header comment of `posts.js`).
- `blog.js:escapeHtml(s)` — escapes `& < > " '` for safe interpolation.
- `blog.js:formatDate(iso)` — formats a `YYYY-MM-DD` string as a French
  long date (`fr-FR`, e.g. "2 mai 2025").
- `blog.js:readingTime(post)` — word count of `body` ÷ 200, minimum 1,
  returned as `"<n> min de lecture"`.
- `blog.js:postUrl(post)` — returns `article.html?p=<encoded slug>`.
- `blog.js:postCard(post)` — returns the HTML of one journal card
  (`article.post-card.fade`).
- `blog.js:renderBody(blocks)` — returns the HTML of an article body.

## Invariants

- `blog.js` must load after `posts.js`: `blog.js` reads `AFASSI_POSTS` at the
  top level (`blog.js:2`).
- `date` must be an ISO `YYYY-MM-DD` string. Ordering is a string comparison
  (`b.date.localeCompare(a.date)`, `blog.js:2`), `formatDate` appends
  `T12:00:00` to it, and `postCard` writes it unescaped into
  `<time datetime>` (`blog.js:23`).
- `slug` must be unique; `article.html` opens the first post whose `slug`
  matches the `p` query parameter.
- In `renderBody`, a block is read as `h`, then `quote`, then `list`, and
  otherwise as `p` (`blog.js:33-36`); give each block exactly one key.
- Every other post field is passed through `escapeHtml` before insertion, so
  post text must be plain text, not HTML.
- Cards are emitted with the `fade` class. They stay invisible
  (`.js .fade` in [`../styles.css`](../styles.css), except under
  `prefers-reduced-motion`) until `site.js:observeFades` adds `in`, so callers
  must run `observeFades` after inserting cards.

## Side Effects

- `blog.js:2` sorts `window.AFASSI_POSTS` in place, newest first; every page
  then sees the sorted order.
- `blog.js` declares its helpers as top-level globals (`escapeHtml`,
  `formatDate`, `readingTime`, `postUrl`, `postCard`, `renderBody`).
- No network, storage or DOM access here; post `image` URLs are only fetched
  when a page inserts the returned markup.

## Verification

- Run: `<test-command>` (no automated test suite is configured).
- Manual check: serve the folder (`python -m http.server 5500`, the `site`
  entry in `.claude/launch.json`) and open `/blog.html` and
  `/article.html?p=le-rif-a-moto`.
