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

Screenshots live in `assets/expn/` as `shot-1.png` to `shot-6.png`, cropped out of the store
marketing art in `/mnt/user/projects/expn-screenshots/` (ios/ and android/) with Pillow run in Docker. Current mapping:

1. `shot-1` hero: Expenses tab (ios/2)
2. `shot-2` Stats, Trends, Savings rate (android/6)
3. `shot-3` Stats, month view with Total Net, used for the cash flow step (android/1)
4. `shot-4` Stats, Overview (ios/1)
5. `shot-5` Calendar, stands in for the reminders step until a reminder screenshot exists (ios/5)
6. `shot-6` Budget tab (ios/4)

Phone frames show a styled placeholder if a file is missing, so a removed shot never breaks the page.
Replace a shot by overwriting the file and bumping `?v=` on `expn.css` is not needed; images have no
query string, so use a new filename if browsers must see the change immediately.
