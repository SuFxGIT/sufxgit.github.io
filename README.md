# sufxgit.github.io

Portfolio site for SUFX apps, served by GitHub Pages at
https://sufxgit.github.io/. Plain HTML and CSS, no JavaScript, no build step. The background is a CSS
dot grid with two slowly drifting blurred orbs. The EXPN icon in `assets/` is the same
`logo.png` used to generate the store app icons.

To add a new app: copy an `<article class="card">` block in `index.html` into
the grid of the right section (Mobile Apps or Web Apps), drop the app icon into
`assets/`, and if the app's data practices differ from the existing policy, add
an app-specific section to `privacy/index.html`. Use `class="btn btn-disabled"`
on a `<span>` for a store that is not live yet.

## EXPN marketing page

`/expn/` is a standalone landing page for EXPN with its own `expn/expn.css` and `expn/expn.js`
(vanilla, no dependencies). It loads Inter from Google Fonts; that is the only external resource.

Screenshots live in `assets/expn/` as `shot-1.png` to `shot-6.png`:

1. `shot-1` hero: Expenses tab
2. `shot-2` Stats, Trends, Savings rate
3. `shot-3` Stats, Trends, Cash flow
4. `shot-4` Stats, Overview
5. `shot-5` expense reminder settings
6. `shot-6` Budget tab

Phone frames show a styled placeholder until the file exists, so missing shots never break the page.
Drop new captures in `/mnt/user/projects/expn-screenshots/` on Tower, copy them in with those names and commit.
