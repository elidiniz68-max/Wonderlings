# Wonderlings — Screen-by-Screen Flow (MVP Spec)

**Purpose.** This document locks the structure of the Wonderlings MVP: every major
screen, what it contains, every major button, and exactly what happens when the
player taps it. Visual mockups and Flutter development build on top of this —
nothing structural should be invented later without updating this doc.

**MVP scope (locked).** Parent account · Child profile · Age paths 5–7 / 8–11 / 12–15 ·
Milo · Home · Number Nebula · Storywood · 3 math mini-games · 3 reading mini-games ·
XP / WonderCoins / rewards · 5 Wonderlings · Basic parent dashboard.

**Status note.** The HTML prototype (`wonderlings-v5.html`, 44/44 harness checks)
proves the playable slice: profile → Milo story → World Map → Number Nebula /
Storywood → 5 challenge rounds in the band's real mini-game → world restored →
XP/coins → mystery egg → hatch → Collection. Parent Gate, Parent Setup, and the
Parent Dashboard are spec-only (Flutter scope). Part B below is the button-level
blueprint: every element → its action, the three age-band UI systems, edge
states, and prototype coverage per screen.

---

## Global rules (apply on every screen)

1. **Parent gate.** Anything for grown-ups (Parent Dashboard, settings, purchases,
   profile edits) hides behind a gate: press-and-hold "Grown-ups" for 2 seconds,
   then answer a grown-up question (e.g. "What is 14 + 27?"). Kids never see
   what's behind it.
2. **Sound toggle.** 🔊/🔇 on every main screen, persisted between visits.
3. **Milo's voice (TTS).**
   - Explorer (5–7): ON by default. Milo reads everything aloud — many in this
     band can't read fluently yet.
   - Adventurer (8–11): ON by default, shorter lines.
   - Legend (12–15): OFF by default; tap Milo any time to hear the line.
4. **Milo's tone.**
   - Explorer: warm, cute companion. "You can do it! ⭐"
   - Adventurer: adventure buddy. "Nice and steady."
   - Legend: concise mission assistant. "Focus."
5. **Animation philosophy.** Short, responsive, colorful, meaningful. The child's
   action causes the animation (tap → squish → result). Celebrations < 1.5s.
   Never a fireworks factory. For teens: "MISSION COMPLETE — +750 XP", not
   "AMAZING JOB!!!".
6. **No-fail design.** Wrong answers never subtract XP, never lock the child
   out, never make a scary sound. XP only goes up. Milo encourages; the next
   challenge always arrives.
7. **Persistence.** Profile, age band, XP, coins, Wonderlings, and per-world
   restored-state all survive restarts (local first; Firebase when the real
   backend lands).

## Navigation map

```
Splash
 └─▶ Parent Gate ─▶ Parent Setup (first run only)
                        └─▶ Child Profile ─▶ Age Path ─▶ Avatar ─▶ Home ◀──┐
                                                                   │      │
                                              ┌────────────────────┘      │
                                              ▼                           │
                                           World Map ─▶ Mission Brief ─▶ Mini-game (×5 rounds)
                                              │                               │
                                              │                               ▼
                                              │                         World Restored
                                              │                               │
                                              │                               ▼
                                              │                            Rewards ─▶ Egg Hatch ─▶ Collection
                                              │                               │
                                              └───────────────────────────────┘
                                                              (Home, always one tap away)

Parent Dashboard ←── parent gate ←── Home ("Grown-ups" corner) or World Map corner
```

---

## Screens

### 1. Splash
- **Goal:** brand moment + loading. Max 2.5 seconds.
- **Contains:** Wonderlings logo, tagline "Play. Discover. Grow.", subtle
  starfield shimmer, loading bar.
- **Buttons:**
  - (auto) → First run: Parent Gate. Returning: Home (profile exists).
  - Tap anywhere → skips the wait, same destination.
- **Milo:** asleep in the corner (💤). No dialogue.
- **Animation:** logo fades/scales in once. No loop longer than the load.

### 2. Parent Gate
- **Goal:** keep grown-up areas kid-proof without a login wall for the child.
- **Contains:** "Grown-ups only" card, press-and-hold button (2s, fills as you
  hold), then a grown-up question ("What is 14 + 27?") with a number pad.
- **Buttons:**
  - Hold-to-unlock → reveals the question.
  - Correct answer → Parent Setup (first run) or Parent Dashboard (later).
  - Wrong answer → gentle shake, new question, never locks out.
  - ✕ / Back → Splash (first run) or Home.
- **Note:** the child never needs this screen to play after setup — Home is
  the returning entry point.

### 3. Parent Setup (first run only)
- **Goal:** create the parent account + COPPA consent. Plain language, < 2 min.
- **Contains:** email field, password field (with show/hide), checkbox "I am
  the parent/legal guardian and agree to the Privacy Policy & Terms" (required,
  unchecked by default), link to Privacy Policy.
- **Buttons:**
  - "Create account" → validates → Child Profile. (Validation errors appear
    under the field, no popups.)
  - "I already have an account" → simple sign-in form → Child Profile (or
    straight to Home if a child profile exists).
- **Milo:** not present — this is grown-up space.
- **Later (Flutter):** add Apple/Google sign-in here.

### 4. Child Profile
- **Goal:** who is playing? One profile per child; switchable later.
- **Contains:** name field ("Your explorer name", max 16 chars), avatar preview
  (updates live in the next step — show placeholder here or merge preview).
- **Buttons:**
  - "Continue" (disabled until name entered) → Age Path.
  - Back → Parent Setup.
- **Milo (all bands):** "Who's going exploring today?"

### 5. Age Path
- **Goal:** the single most important fork — it re-skins difficulty, Milo's
  tone, and the entire visual theme.
- **Contains:** three large cards:
  - 🌱 **Explorer** · ages 5–7 — "Big buttons, read-aloud, playful quests"
  - ⚡ **Adventurer** · ages 8–11 — "Game-like missions, trickier challenges"
  - 🔥 **Legend** · ages 12–15 — "Real stakes, cinematic style"
- **Buttons:**
  - Tap a card → selects it (visual selected state), Milo reacts.
  - "Let's Go!" (appears after selection) → Avatar.
  - Back → Child Profile.
- **Milo:**
  - Explorer: "Pick your path, superstar! ⭐"
  - Adventurer: "Choose wisely — each path is a different adventure."
  - Legend: "Select your difficulty tier."
- **Animation:** selecting a card re-skins the whole screen live (CSS theme
  variables) — the child SEES the universe change. This is the "whoa" moment.

### 6. Avatar Pick
- **Goal:** identity + ownership.
- **Contains:** row of hero avatars (MVP: 6 emoji heroes 🦊🦁🐼🐸🦄🐲; later:
  illustrated avatars + WonderCoin cosmetics).
- **Buttons:**
  - Tap avatar → selected state + squish + tap sound.
  - "🚀 Start Adventure!" → Home (first run: plays the Milo story intro first —
    see Screen 6b).
  - Back → Age Path.
- **Milo:** "Looking good! This is YOU, explorer!"

### 6b. Story Intro (first run only, part of Home entry)
- **Goal:** the 60-second story that gives everything meaning: the six
  Knowledge Cores, the Fade, two worlds calling for help.
- **Contains:** Milo face + speech bubble, "Next ▶" button. 5 beats:
  1. greeting (uses child's name), 2. the six Cores, 3. the Fade,
  4. alarm — Number Nebula AND Storywood need help, 5. the mission ("Pick a
  world on the map! Solve 5 challenges to bring it back to life!").
- **Buttons:** "Next ▶" advances; after beat 5 → World Map.
- **Milo:** full TTS in every band (story matters).
- **Animation:** each beat slides in; Milo "talks" (gentle bob while speaking).

### 7. Home
- **Goal:** the safe base. Everything is one tap away; Milo greets you by name.
- **Contains:** HUD (level, WonderCoins, XP bar, avatar), Milo + speech bubble
  (context-aware greeting), companion card (latest Wonderling or "No Wonderling
  yet…"), buttons below.
- **Buttons:**
  - "🗺️ World Map" → World Map.
  - "🐾 Wonderlings" → Collection.
  - "👤 Switch profile" → Child Profile list (add/switch child).
  - "Grown-ups" (small corner) → Parent Gate → Parent Dashboard.
  - 🔊 sound toggle.
- **Milo (examples):**
  - Explorer: "That was AMAZING, {name}! Pyro really likes you! ⭐"
  - Adventurer: "Reactor's stable. The Wonderverse still needs us."
  - Legend: "Mission logged. Awaiting next directive."
- **Returning player:** Home is the entry point. Milo: "Welcome back, Explorer.
  Your next adventure is ready." (Never punishes missed days.)

### 8. World Map
- **Goal:** show the universe, what's saved, what's next.
- **Contains:** HUD (compact), 8 world cards in a grid. MVP: Number Nebula and
  Storywood playable; 6 locked ("🔒 the Fade still holds it…" with a teaser
  silhouette).
- **Per world card:** icon, name, status line:
  - Number Nebula 🔢 — "🚨 needs help!" → "⚡ reactor online!"
  - Storywood 📚 — "🍂 leaves fading!" → "🌳 tree blooming!"
- **Buttons:**
  - Playable world → Mission Brief for that world.
  - Restored world → Milo one-liner ("The reactor is humming along nicely!"),
    no replay in MVP (replay missions = post-MVP).
  - Locked world → card wiggles, Milo: "The Fade still holds that world…"
  - "🏠 Home" → Home.
- **Animation:** restored worlds glow softly; playable-but-unrestored pulse
  gently. Nothing moves unless the child taps.

### 9. Mission Brief (per world)
- **Goal:** stakes + goal in 10 seconds. (Currently folded into the story
  intro in the prototype; becomes its own screen per world.)
- **Contains:** world art banner, Milo + speech, goal card ("Solve 5
  challenges → restore the {reactor / Story Tree}"), "Begin!" button.
- **Buttons:**
  - "Begin! 🚀" → Mini-game, round 1 of 5.
  - Back → World Map.
- **Milo (Number Nebula / Storywood):**
  - Explorer: "Count the aliens and help them board the ship! 🚀" /
    "Help the Story Tree remember its tales! 📖"
  - Adventurer: "Solve 5 power equations to reroute energy." /
    "Rebuild the tales, one word at a time."
  - Legend: "Solve 5 reactor equations. Precision matters." /
    "Restore narrative cohesion. 5 trials."

### 10. Mini-game (the Game screen)
- **Goal:** the learning itself — real gameplay, not a quiz sheet.
- **Contains:** round progress ("Challenge 2 of 5"), Milo quip bubble, challenge
  card (the question/puzzle), answer controls (vary per game — see slots
  below), timer: none in MVP (no time pressure; speed bonuses are post-MVP).
- **Buttons:** answer controls depend on the game (tap-to-answer, drag,
  type-in). One "action" per round; buttons lock after answering.
- **Feedback (the cause-and-effect chain):**
  - Correct → button turns green + squish, +10 XP floats up, confetti burst,
    chime (+ occasional Milo giggle), Milo praise, 1.4s → next round.
  - Wrong → button shakes gently (never red-flash scary), soft "boop", Milo:
    "Almost! Try the next one!", 1.4s → next round. No XP lost.
- **After round 5** → World Restored cinematic.
- **Milo quips/praise:** per world per band (already in prototype config).

#### MVP mini-game slots (full rules designed in step 6 of the plan)
| # | World | Band | Game | One-line |
|---|-------|------|------|----------|
| M1 | Number Nebula | 5–7 | **Alien Boarding** | Count the visible aliens, tap the total; then add/subtract crews. |
| M2 | Number Nebula | 8–11 | **Power Grid** | Four power nodes; tap the node showing the right answer (×, missing factors, fractions). Correct node ignites. |
| M3 | Number Nebula | 12–15 | **Reactor Core** | Two-step: pick the correct first operation (wrong pick → undo + Milo hint, retry free), then solve for x. |
| R1 | Storywood | 5–7 | **Rhyme Grove** | Big rhyme cards (icon stays glued to its word); 🔊 "Hear it again" replays Milo. |
| R2 | Storywood | 8–11 | **Word Bridge** | Fill the missing word; every win lays one of 5 bridge planks. |
| R3 | Storywood | 12–15 | **Tale Detective** | Pick the inference, then tap the passage line that proves it (wrong line → hint, retry). |

Each mission = 5 rounds of the band's game for that world. (Prototype already
implements this shape with generated questions; step 6 turns each slot into
real gameplay with rules, progression, and replay value.)

### 11. World Restored (cinematic)
- **Goal:** the payoff — 3 seconds of "YOU did this."
- **Contains:** big icon (⚡ / 🌳), headline ("⚡ REACTOR ONLINE! ⚡" /
  "🌳 THE STORY TREE BLOOMS! 🌳"), confetti + fanfare.
- **Buttons:** "Continue ▶" → Rewards. (Auto-advance after 4s is post-MVP;
  MVP lets the child savor it.)
- **Milo:** "Reactor online! Amazing work!" / "The Story Tree blooms again!"

### 12. Rewards
- **Goal:** make earnings legible: XP, coins, egg.
- **Contains:** three reward cards revealed one after another (staggered
  pop-in): ✨ +250 XP (matches actual: 5×10 + 200 mission bonus — displayed
  number must ALWAYS equal real XP granted), 🪙 +100 WonderCoins,
  🥚 "A MYSTERY EGG!".
- **Buttons:** "Open the egg 🥚" → Egg Hatch (resets the egg for this world's
  pet). Back is hidden here — forward momentum only.
- **Note (bug to fix):** prototype's rewards screen hardcodes "+250 XP" —
  wire it to actual XP earned.

### 13. Egg Hatch
- **Goal:** the reward reveal — the child's taps cause everything.
- **Contains:** egg (🥚), hint "👆 Tap the egg! (3 taps left)".
- **Interaction:** tap 1 → wiggle + "It's cracking!", tap 2 → bigger crack,
  tap 3 → 💥 hatch: creature emoji pops with scale-bounce, name + trait card,
  confetti + fanfare, Milo: "Wow! You discovered {name}!"
- **Buttons:** "Say hi! {icon}" → Home (companion card now shows the new
  friend). Extra taps after hatching do nothing.
- **Which egg:** determined by the world just restored (Nebula → Pyro,
  Storywood → Sylva, etc.).

### 14. Collection ("Your Wonderlings")
- **Goal:** pride + evolution goals.
- **Contains:** grid of discovered Wonderlings (icon, name, stage, trait,
  evolution teaser with 🔒). Undiscovered slots show "???" silhouettes —
  teasers, not spoilers.
- **MVP roster (5):**
  1. 🔥 **Pyro** (Fire) — Number Nebula egg. Strong, impulsive, courageous.
     → 🐉 Pyron → 🔥🐲 INFERION (50 math challenges).
  2. 🌿 **Sylva** (Leaf) — Storywood egg. Curious, gentle, wise.
     → 🌿 Sylvana → 🌳✨ ELDERWOOD (50 reading challenges).
  3. 🫧 **Bubbles** (Water) — "Twin Worlds" egg: restore BOTH worlds.
     Playful, loyal. → 🌊 Bubblo → 💧🐋 TIDALORE.
  4. 🪨 **Pebbles** (Stone) — Scholar egg: 50 correct challenges (any subject).
     Steady, patient. → 🗿 Boulder → ⛰️ MOUNTAINHEART.
  5. ✨ **Sparkle** (Star) — Explorer egg: reach Level 5. Bright, encouraging.
     → 🌟 Twinkle → 💫 NOVA PRIME.
- **Buttons:** tap a Wonderling → detail card (bigger art, trait, evolution
  progress bar, e.g. "23/50 math challenges to Pyron"). "🏠 Home" back.
- **Full creature system (personalities, abilities, rarity, animations) is
  step 7 of the plan — this roster is the seed.**

### 15. Parent Dashboard (behind parent gate)
- **Goal:** trust + insight in under a minute. Clean, calm, no game chrome.
- **Sections:**
  - **Overview:** child switcher, this week's time played, level, total XP.
  - **Learning:** per-subject accuracy bars (Math, Reading), strengths ("🔥
    Rhyming — 92%"), "practice more" suggestions ("Fractions — 58%, try a
    Number Nebula mission together"). Data from real answers, plain language.
  - **Controls:** daily time limit slider, TTS default per child, sound
    default.
  - **Profiles:** add / edit / delete child profiles.
  - **Privacy:** what's stored (minimal), COPPA note, "Delete our data" button
    (with confirm), no ads / no chat / no location statement.
  - **Subscription:** MVP shows "Wonderlings Plus — coming soon" with
    "Notify me" (no paywall in MVP; pricing decided in step 9/10 of plan).
- **Buttons:** section tabs, sliders, toggles, "Save" where needed, "Sign out",
  "← Back to Home".
- **Note:** dashboard is READ-mostly in MVP; enforcement features (hard time
  locks) are post-MVP.

---

## First-run vs returning (state machine)

- **First run:** Splash → Parent Gate → Parent Setup → Child Profile → Age
  Path → Avatar → Story Intro → World Map → …
- **Returning (profile exists):** Splash → Home. (Milo: "Welcome back,
  Explorer. Your next adventure is ready.")
- **Returning, no child profile yet:** Splash → Parent Gate → Parent Setup.

---

## PART B — Complete blueprint (button-level spec)

How to read each screen: **Elements** = every visible/tappable thing → exactly
what it does. **Age bands** = how Explorer (5–7) / Adventurer (8–11) / Legend
(12–15) change that screen. **Edge** = empty/error/offline behavior.
**v5** = what the HTML prototype already proves vs what's Flutter-only.

### The three age-band UI systems (plan Step 3 — specified once, applied per screen)

- **🌱 Explorer (5–7) — playful & simple.** Min touch target 64pt; chunky
  rounded buttons; saturated palette; Milo TTS reads *everything* aloud by
  default; one primary action per screen; every instruction pairs icon + voice
  (never text-only); praise is warm and frequent; no timers, no failure states,
  no small text.
- **⚡ Adventurer (8–11) — adventurous & game-like.** Min target 48pt; HUD with
  XP bar, coins, streak flame; mission-briefing cards; Milo TTS on but lines
  are shorter; personal bests and unlock teasers; gentle challenge framing
  ("Can you keep the streak?").
- **🔥 Legend (12–15) — sleek & mature.** Compact type; dark-mode-ready theme;
  Milo is a concise mission assistant (TTS off by default, tap Milo to hear);
  stats-forward (accuracy %, mastery bars); restrained praise ("Mission
  complete — +750 XP"); subtle fast animations; zero baby talk.

### S1 · Splash
| Element | Action |
|---|---|
| Logo + tagline "Play. Discover. Grow." | Brand moment, no action |
| Starfield shimmer + loading bar | Plays ≤ 2.5s |
| Tap anywhere | Skip wait → first run: Parent Gate · returning: Home |
| Milo (💤 asleep, corner) | Decorative |
**Age bands:** identical for all (brand moment).
**Edge:** slow load → shimmer continues, never an error screen.
**v5:** not implemented (prototype starts at profile).

### S2 · Parent Gate
| Element | Action |
|---|---|
| "Grown-ups only" card | Explains the hold |
| Press-and-hold button (2s, fills as you hold) | Holding 2s reveals the grown-up question |
| Grown-up question + number pad (e.g. "What is 14 + 27?") | Correct → Parent Setup (first run) / Dashboard (later) |
| ✕ / Back | → Splash (first run) / Home |
**Age bands:** n/a — grown-up space, same for all.
**Edge:** wrong answer → gentle shake, new question, never locks out.
**v5:** spec-only (Flutter scope).

### S3 · Parent Setup (first run only)
| Element | Action |
|---|---|
| Email field | Validated inline |
| Password field + show/hide | Min length rule, inline error |
| Consent checkbox (required, UNCHECKED by default) | "I am the parent/legal guardian…" — Create stays disabled until checked |
| Privacy Policy link | Opens policy (in-app webview) |
| "Create account" | Valid → Child Profile |
| "I already have an account" | Sign-in form → Child Profile (or Home if a child exists) |
**Age bands:** n/a — grown-up space.
**Edge:** invalid email / short password → inline error under the field, no
popups; unchecked consent → disabled button + hint text.
**v5:** spec-only.

### S4 · Child Profile
| Element | Action |
|---|---|
| "Your explorer name" field (max 16) | Enables Continue when non-empty |
| Avatar placeholder preview | Live-updates after Avatar step |
| "Continue" (disabled until name entered) | → Age Path |
| Back | → Parent Setup |
| Milo | "Who's going exploring today?" |
**Age bands:** Explorer — Milo reads the prompt aloud, extra-large field;
Legend — compact, placeholder examples ("Nova_7").
**Edge:** >16 chars → truncates with a "16 max" counter; emoji allowed.
**v5:** implemented (name entry).

### S5 · Age Path
| Element | Action |
|---|---|
| 🌱 Explorer card (5–7) — "Big buttons, read-aloud, playful quests" | Selects band; whole screen re-skins LIVE (the "whoa" moment); Milo reacts |
| ⚡ Adventurer card (8–11) — "Game-like missions, trickier challenges" | Same |
| 🔥 Legend card (12–15) — "Real stakes, cinematic style" | Same |
| "Let's Go!" (appears after selection) | → Avatar |
| Back | → Child Profile |
**Age bands:** this screen IS the fork — each card previews its own visual
system so the child sees what they're choosing.
**Edge:** no selection → "Let's Go!" hidden; can't proceed without a band.
**v5:** band config present; full screen spec-only.

### S6 · Avatar Pick
| Element | Action |
|---|---|
| 6 hero avatars (MVP: 🦊🦁🐼🐸🦄🐲) | Tap → selected state + squish + tap sound |
| "🚀 Start Adventure!" | → Home (first run: Story Intro plays first) |
| Back | → Age Path |
| Milo | "Looking good! This is YOU, explorer!" |
**Age bands:** Explorer — avatars 1.5× size, names spoken aloud; Legend —
smaller grid, "randomize" option.
**Edge:** none (a default avatar is pre-selected).
**v5:** spec-only (prototype uses a fixed Milo companion).

### S6b · Story Intro (first run only)
| Element | Action |
|---|---|
| Milo face + speech bubble | 5 beats: 1) greeting (child's name) 2) the six Knowledge Cores 3) the Fade 4) alarm — Nebula + Storywood need help 5) the mission |
| "Next ▶" | Advances one beat; after beat 5 → World Map |
**Age bands:** full TTS in every band (story matters); Legend beats are
shorter sentences, same 5 beats.
**Edge:** rapid tapping Next → beats queue safely, never skips to map early.
**v5:** implemented.

### S7 · Home (returning entry point)
| Element | Action |
|---|---|
| HUD: level, WonderCoins, XP bar, avatar | Status glance; avatar → Child Profile list |
| Milo + speech bubble | Context greeting (see below) |
| Companion card | Latest Wonderling, or "No Wonderling yet…" |
| "🗺️ World Map" | → World Map |
| "🐾 Wonderlings" | → Collection |
| "👤 Switch profile" | → Child Profile list (add/switch) |
| "Grown-ups" (small corner) | → Parent Gate → Dashboard |
| 🔊 sound toggle | Persisted |
**Milo greetings:** Explorer — "That was AMAZING, {name}! ⭐"; Adventurer —
"Reactor's stable. The Wonderverse still needs us."; Legend — "Mission logged.
Awaiting next directive." Returning: "Welcome back — your next adventure is
ready." (Never punishes missed days.)
**Age bands:** Explorer — two giant buttons, Milo voice greeting; Adventurer —
adds streak flame + "daily mission" teaser; Legend — compact HUD, stats row.
**Edge:** no Wonderling yet → card shows silhouette + "Restore a world to
hatch your first friend!"
**v5:** partially implemented (HUD, Milo, world entry).

### S8 · World Map
| Element | Action |
|---|---|
| 8 world cards (grid) | Playable → Mission Brief · Restored → Milo one-liner (no replay in MVP) · Locked → wiggle + "The Fade still holds that world…" |
| Status line per card | "🚨 needs help!" → "⚡ reactor online!" / "🍂 leaves fading!" → "🌳 tree blooming!" |
| "🏠 Home" | → Home |
**Age bands:** Explorer — cards are huge with voice labels; Legend — adds
completion % per world.
**Edge:** all MVP worlds restored → Milo: "Every world is glowing — new
worlds coming soon!" (no dead end).
**v5:** implemented (Nebula + Storywood playable, 6 locked).

### S9 · Mission Brief (per world)
| Element | Action |
|---|---|
| World art banner | Sets the scene |
| Milo + speech | Stakes in ≤10 seconds (per-band lines in Part A §9) |
| Goal card | "Solve 5 challenges → restore the {reactor / Story Tree}" |
| "Begin! 🚀" | → Mini-game, round 1 of 5 |
| Back | → World Map |
**Age bands:** Explorer — goal card is pictorial (5 stars); Legend — shows
expected duration + difficulty tag.
**Edge:** none.
**v5:** folded into Story Intro (dedicated screen is Flutter scope).

### S10 · Mini-game (the Game screen)
| Element | Action |
|---|---|
| "Challenge N of 5" progress | Status |
| Milo quip bubble | Per-world, per-band flavor |
| Challenge card | The question/puzzle |
| Answer controls (per game) | Alien: tap total · Grid: tap 1 of 4 nodes · Reactor: pick first operation → solve x · Grove: tap rhyme card (+🔊 replay) · Bridge: fill the word (5 planks) · Detective: pick inference → tap evidence line |
| (controls lock after answering) | Prevents double-taps |
**Feedback chain (every game, every band):** Correct → green + squish, +10 XP
floats up, confetti burst, chime (+ occasional Milo giggle), Milo praise,
1.4s → next round. Wrong → gentle shake (never scary red flash), soft "boop",
Milo: "Almost! Try the next one!", 1.4s → next round. XP never decreases.
**Age bands:** Explorer — TTS reads every challenge, biggest targets;
Adventurer — shorter quips, streak flame appears; Legend — minimal chrome,
concise feedback ("Correct. +10 XP").
**Edge:** TTS fails → silent fallback, game continues; rapid taps → locked
controls; no timers anywhere in MVP.
**v5:** fully implemented — all 6 games, 44/44 harness checks.

### S11 · World Restored (cinematic)
| Element | Action |
|---|---|
| Big icon (⚡ / 🌳) + headline | "⚡ REACTOR ONLINE! ⚡" / "🌳 THE STORY TREE BLOOMS! 🌳" |
| Confetti + fanfare (< 1.5s) | The payoff — "YOU did this" |
| "Continue ▶" | → Rewards |
**Age bands:** Explorer — longer confetti, Milo cheers; Legend — quick flash,
headline only.
**Edge:** none (no auto-advance in MVP — let the child savor it).
**v5:** implemented.

### S12 · Rewards
| Element | Action |
|---|---|
| Card 1: ✨ +XP (staggered pop-in) | Displayed number MUST equal actual XP granted (5×10 + 200 mission bonus) |
| Card 2: 🪙 +WonderCoins | Same rule — real number |
| Card 3: 🥚 "A MYSTERY EGG!" | Teaser |
| "Open the egg 🥚" | → Egg Hatch (this world's pet) |
| (Back hidden) | Forward momentum only |
**Age bands:** identical structure; Legend shows an XP breakdown line.
**Edge:** none.
**v5:** implemented (displayed XP must always equal granted XP — regression
rule, not just a bug).

### S13 · Egg Hatch
| Element | Action |
|---|---|
| Egg (🥚) + "👆 Tap the egg! (3 taps left)" | Tap 1 → wiggle + "It's cracking!" · Tap 2 → bigger crack · Tap 3 → 💥 hatch: creature pops (scale-bounce), name + trait card, confetti + fanfare, Milo: "Wow! You discovered {name}!" |
| "Say hi! {icon}" | → Home (companion card now shows the new friend) |
**Age bands:** Explorer — taps are huge, extra wiggle; Legend — "skip" link
after first hatch ever.
**Edge:** taps after hatching → no-op; which egg = the world just restored
(Nebula → Pyro, Storywood → Sylva).
**v5:** implemented.

### S14 · Collection ("Your Wonderlings")
| Element | Action |
|---|---|
| Grid of Wonderlings | Discovered: icon, name, stage, trait, evolution teaser · Undiscovered: "???" silhouette (teaser, not spoiler) |
| Tap a Wonderling | Detail card: bigger art, trait, evolution progress bar ("23/50 math challenges → Pyron") |
| "🏠 Home" | → Home |
**MVP roster (5):** Pyro 🔥 (Nebula egg) → Pyron → INFERION · Sylva 🌿
(Storywood egg) → Sylvana → ELDERWOOD · Bubbles 🫧 (both worlds) → Bubblo →
TIDALORE · Pebbles 🪨 (50 correct, any subject) → Boulder → MOUNTAINHEART ·
Sparkle ✨ (reach Level 5) → Twinkle → NOVA PRIME.
**Age bands:** Explorer — silhouettes are cute, not spooky; Legend — shows
rarity tags + stats.
**Edge:** empty collection → Milo: "Restore a world to hatch your first
friend!" + arrow to World Map.
**v5:** implemented (roster + hatch wiring).

### S15 · Parent Dashboard (behind Parent Gate)
| Element | Action |
|---|---|
| Tabs: Overview · Learning · Controls · Profiles · Privacy · Subscription | Switch sections |
| Overview | Child switcher, week's time played, level, total XP |
| Learning | Per-subject accuracy bars (Math, Reading); strengths ("🔥 Rhyming — 92%"); practice suggestions ("Fractions — 58%, try a Nebula mission together"). Real answer data, plain language. Disclaimer: "Levels track journey, not ability." |
| Controls | Daily time-limit slider, TTS default per child, sound default |
| Profiles | Add / edit / delete child profiles |
| Privacy | What's stored (minimal), COPPA note, "Delete our data" (with confirm), no-ads / no-chat / no-location statement |
| Subscription | MVP: "Wonderlings Plus — coming soon" + "Notify me" (no paywall in MVP) |
| "Sign out" / "← Back to Home" | Exits grown-up space |
**Age bands:** n/a — grown-up space, calm and clean, no game chrome.
**Edge:** "Delete our data" → type-to-confirm; no children yet → empty state
with "Add your first explorer".
**v5:** spec-only (see PARENT_EXPERIENCE.md for the full design).

---

## Open questions (for mockup / Flutter phase)

1. Parent auth: email+password only for MVP, or Apple/Google sign-in from day one?
2. Exact parent-gate pattern (hold-2s + math question is the proposal).
3. Subscription: price, trial, what's behind Plus vs free.
4. Replay missions: post-MVP — but decide now whether restored worlds stay
   locked or replayable (affects map states).
5. WonderCoin shop: post-MVP (cosmetics). MVP coins accumulate; don't promise
   a shop on the Rewards screen.
6. Offline: prototype is fully offline; Flutter MVP target is offline-first
   with Firebase sync when online.

## What's next (per the 12-step plan)

1. ✅ Step 1 (MVP lock) — locked in this doc's header + MVP scope.
2. ✅ Step 2 (screen blueprint) — this doc, Parts A + B.
3. ✅ Steps 3–11 drafts — age-band UI systems specified above; curriculum,
   mini-game designs, creature system, economy, parent experience, visual
   identity, and the Flutter technical plan all drafted in docs/ (see the
   README index).
4. ⬜ Step 12 (testing plan) — not yet written; the natural next doc: how we
   test the 5–7, 8–11, and 12–15 experiences separately (kids + parents).
5. UI mockups for the 3 age-band systems → built directly on this blueprint.
6. Flutter core-loop prototype (TECHNICAL_BUILD.md phases 1–2) — the v5 HTML
   prototype already proves the loop, so Flutter starts from a validated
   design, not a blank page.
