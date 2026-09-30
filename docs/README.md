# 🌌 WONDERLINGS — Play. Discover. Grow.

An educational adventure for ages 5–15 where **knowledge is the player's
superpower**. Kids explore fading worlds with Milo the fox, complete
story-driven mini-game missions to restore them, earn XP and WonderCoins,
and hatch creature companions.

> "Don't build a collection of quizzes. Build an adventure where knowledge
> is the player's superpower."

## Play it now

Open **`wonderlings-v5.html`** in any browser (iPad-friendly, works
offline). No build step, no server.

## What's in v5

- **Number Nebula** (Logic) and **Storywood** (Language) — fully playable
- All **6 mini-games**, one per age band per subject:
  - 🔢 Alien Boarding · ⚡ Power Grid · 🔧 Reactor Core (math)
  - 🌸 Rhyme Grove · 🌉 Word Bridge · 🔍 Tale Detective (reading)
- 5 Wonderlings to hatch, XP/levels, WonderCoins, mystery eggs
- Milo the fox with his cartoon voice (TTS, pitch 1.7)

## Develop

Source lives in `index.html` + `style.css` + `game.js`.

```bash
node tests/test-game.js   # regression harness (44 checks)
./build.sh 5              # rebuild the standalone file (version must match the footer in index.html)
```

## The plan

The full 10-step product blueprint — curriculum, mini-game designs,
creature system, economy, parent experience, technical build — lives in
[`docs/`](docs/README.md).
