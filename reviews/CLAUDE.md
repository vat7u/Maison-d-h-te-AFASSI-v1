# Reviews section

Before reading or changing anything in this folder, read [README.md](README.md).
It is this folder's contract: the rating and review data formats, how reviews
are filtered by their original language, and the invariants you must keep
(platform keys matching `ratings.js`, `isMock` stays `true` while the reviews
are fictional, plain-text review fields, right-to-left support for Arabic,
copies in the scrolling strip are generated, never edited).

@README.md

The reviews in `mock-reviews.js` are fictional. Never present them as real
guest reviews, and never add invented reviews without marking them as mock.

If a change alters what README.md describes (a new field, rule or side
effect), update README.md in the same change.
