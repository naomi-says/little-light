# Little Light

A small web page that shows you one positive thought at a time, and lets you jot down what you're grateful for each day. No account, no server — everything lives in your browser.

## What it does
- **Affirmation card** — a rotating positive thought, with a "another thought" button when you want a different one.
- **Gratitude journal** — a one-line input for what you're grateful for today. It tracks your **current streak** (consecutive days you've logged something).
- **Gentle reminders (optional)** — turn on the toggle and, if you allow browser notifications, it'll nudge you with a thought roughly every 2 hours *while the tab stays open*. Real background notifications (even with the tab closed) need a small server component — a natural next step if you want to take this further.

## Run it locally
Double-click `little-light.html` — it opens straight in your browser.

## Put it on GitHub Pages
Same steps as your ledger app:
1. Create a new repo at [github.com/new](https://github.com/new).
2. Upload `little-light.html` (and this README).
3. Settings → Pages → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Wait ~a minute, then your link appears, e.g. `https://your-username.github.io/little-light/`.

## Make it yours
- **Add your own thoughts**: edit the `THOUGHTS` array near the top of the `<script>` tag — write ones that actually land for you.
- **Change the reminder interval**: find `2 * 60 * 60 * 1000` (2 hours in milliseconds) and adjust it.
- **Change the colors**: the CSS variables at the top (`--blush`, `--peach`, `--gold`, `--sage`) control the whole palette.
