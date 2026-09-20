# sufxgit.github.io

Portfolio site for SUFX apps, served by GitHub Pages at
https://sufxgit.github.io/. Plain HTML and CSS plus one small script (`particles.js`) for the
animated background, no build step. The EXPN icon in `assets/` is the same
`logo.png` used to generate the store app icons.

To add a new app: copy an `<article class="card">` block in `index.html` into
the grid of the right section (Mobile Apps or Web Apps), drop the app icon into
`assets/`, and if the app's data practices differ from the existing policy, add
an app-specific section to `privacy/index.html`. Use `class="btn btn-disabled"`
on a `<span>` for a store that is not live yet.
