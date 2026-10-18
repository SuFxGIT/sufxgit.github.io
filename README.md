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

Screenshots live in `assets/expn/` as `shot-1.png` to `shot-6.png`. They are all cropped from the
Android store art in `/mnt/user/projects/expn-screenshots/android/` (inner screen x 243 to 883,
1274px tall starting below the status bar, nav bar excluded) with Pillow in Docker, so every frame
has identical chrome. Mapping:

1. `shot-1` hero: Expenses (android/2)
2. `shot-2` Trends, savings rate and cash flow (android/6)
3. `shot-3` Stats overview (android/1)
4. `shot-4` Calendar, used for the reminders step (android/5, crop starts at y=518)
5. `shot-5` Budgets (android/4)
6. `shot-6` Income (android/3), currently unused

Phone frames show a styled placeholder if a file is missing, so a removed shot never breaks the page.
Images have no cache-bust query string, so when replacing a shot use a new filename (and update
`expn/index.html`) if browsers must see the change immediately.
