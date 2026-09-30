# Wonderlings — UI Mockup Spec (per-band screen designs)

**Purpose.** The visual designs for all 3 age groups, screen by screen. This
is the direct input to pixel mockups (Figma) and then Flutter. It builds on
two docs — read them first:

- `SCREEN_FLOW.md` — *what* is on each screen and what every button does.
- `VISUAL_IDENTITY.md` — the design *language* (tokens, fonts, buttons,
  cards, motion). No new tokens are invented here.

**How to read.** Each screen: **Layout** (top→bottom regions), **Components**
(named from VISUAL_IDENTITY §5–7), then the **three band treatments**.
Anything not called out as band-specific is identical across bands. Milo's
character art never changes — only his size, placement, and dialogue.

**Global composition rules**
- Safe area respected; primary action always in the bottom third (thumb zone).
- HUD pattern (Home, Map, Game): left = avatar + level · center = XP bar ·
  right = 🪙 coins + 🔊 toggle. Order never changes between screens.
- Milo anchor: Explorer — large, bottom-left, overlapping content edge;
  Adventurer — medium, bottom-right of the Milo bubble; Legend — 40px circular
  avatar, top-right corner, tap for TTS.
- One primary action per screen. Secondary actions are quiet (text buttons).
- Parent Dashboard ignores all of this — calm, clean, no game chrome
  (see S15).

---

## S5 · Age Path — the "whoa" moment

**Layout:** Full-screen. Top: Milo + "Pick your path!" bubble. Middle: three
large cards stacked (portrait) — each card is a *live preview* of its band's
whole visual system (bg gradient, button style, font). Bottom: "Let's Go!"
appears after selection.

**Components:** band cards (Explorer card §7), toy/game/neon buttons.

**Band treatments:** this screen *is* the three treatments, side by side:
- 🌱 card: Sunny Meadow gradient, Baloo 2 "Explorer", chunky pink toy
  button labeled "Ages 5–7", floating soft shapes behind.
- ⚡ card: Quest Blue gradient, Nunito "Adventurer", glowing blue game
  button "Ages 8–11", faint map grid.
- 🔥 card: Neon Night gradient, Orbitron "LEGEND", neon-outline button
  "AGES 12–15", vignette + grid lines.
- Selecting a card re-skins the *entire screen* live (CSS variables /
  ThemeExtension swap) — background, fonts, and Milo's bubble all change.
  This is the single most important animation in onboarding.

**Motion:** card select → 300ms theme crossfade + card lifts (scale 1.03).

## S7 · Home

**Layout:** Top: HUD bar. Upper-middle: Milo + speech bubble (context
greeting). Middle: companion card (latest Wonderling or silhouette teaser).
Bottom: primary buttons.

**Components:** HUD icons (gold), Milo bubble (§7), band buttons.

**Band treatments:**
- 🌱 Explorer: Sunny Meadow bg with drifting clouds. Two GIANT toy buttons:
  "🗺️ WORLD MAP" and "🐾 MY WONDERLINGS". Milo large bottom-left, TTS
  auto-plays the greeting. Companion card is huge with a bouncing arrow if
  empty ("Restore a world to hatch a friend!").
- ⚡ Adventurer: Quest Blue bg, subtle parallax stars. Buttons: "World Map",
  "Wonderlings", plus a "Daily Mission" teaser card (locked in MVP — shows
  "coming soon" shimmer, never a dead button). Streak flame appears in HUD
  once streaks exist. Milo medium, TTS on.
- 🔥 Legend: Neon Night bg, vignette. Compact HUD with stats row (accuracy %,
  missions done). Buttons are neon-outline: "WORLD MAP", "COLLECTION".
  Milo is a 40px corner avatar; greeting is text-only ("Mission logged.").
  No exclamation marks.

## S8 · World Map

**Layout:** Top: compact HUD + "🏠 Home". Grid of 8 world cards (2 cols
portrait). Each card: world icon art, name, status line.

**Components:** world cards (§7 per band).

**Band treatments:**
- 🌱 Explorer: cards are enormous (2 per row, tall), status is pictorial —
  pulsing 🚨 vs glowing ⚡, plus Milo voice label on tap. Locked worlds show
  a cute sleeping cloud, never anything scary.
- ⚡ Adventurer: 2-col grid, cards show a progress ring (0–100%) and a
  "teaser" line for locked worlds ("A frozen world… the Fade is strong
  there."). Restored worlds get a soft glow + banner "SAVED".
- 🔥 Legend: denser 3-col grid, cards are dark glass with neon edge on the
  active world; status as concise tags: "DISTRESS" / "STABLE" / "LOCKED".
  Completion % under each name.

**Motion:** playable-but-unrestored cards pulse gently (opacity 1→0.85,
2s loop). Locked card tap → wiggle (rotate ±3°, 200ms) + Milo line.

## S10 · Mini-game (exemplar per band)

**Layout:** Top: "Challenge N of 5" pill + compact HUD. Middle: Milo quip
bubble (small). Center: challenge card (the question). Bottom: answer
controls. Controls lock after answering.

**M1 · Alien Boarding (Explorer):** Sunny Meadow. Challenge card is a big
rounded panel showing the alien crew (👽👽👽, min 72px each). Below: 3 toy
buttons with huge numerals. Milo bubble auto-reads: "How many aliens do you
see?" Correct → button squishes green, "+10 XP" floats up in Baloo 2,
confetti burst, giggle. Wrong → gentle shake, Milo: "Almost! Try the next
one!" — the aliens wave encouragingly (never laugh *at* the child).

**M2 · Power Grid (Adventurer):** Quest Blue. Four node cards in a 2×2 grid,
each a dark panel with a glowing number. Correct tap → node ignites:
expanding ring + beam animation, "REROUTED!" label. Streak flame in the HUD
grows at x2/x3. Milo quips are short: "Grid holding…"

**M3 · Reactor Core (Legend):** Neon Night. Equation rendered in Orbitron on
a dark console panel. Step 1: three operation chips ("+ 4", "− 4", "× 4") —
picking wrong → chip shakes, Milo: "Undo that. Isolate x first." (free retry).
Step 2: answer field with a sleek keypad. Feedback is terse: "Correct. +10
XP." Letterbox bars slide in during the solve for cinematic focus, out on
completion.

**Motion (all):** the child's tap causes every animation; celebrations
<1.5s; wrong answers never red-flash.

## S11 · World Restored

**Layout:** Full-screen cinematic. Center: huge icon (⚡/🌳) with glow.
Headline. Confetti + fanfare. Bottom: "Continue ▶".

**Band treatments:**
- 🌱: icon is 160px, bouncing; headline Baloo 2 "REACTOR ONLINE!" with star
  sparkles; Milo mid-hop celebration, cheering TTS.
- ⚡: icon 128px with glow pulse; headline Nunito 900 "REACTOR ONLINE!";
  banner ribbon "WORLD SAVED".
- 🔥: letterbox bars, icon 96px with neon glow; Orbitron headline "REACTOR
  ONLINE"; sub-line "World stability: 100%". Fanfare is a single deep
  chime, not a fanfare.

## S12 → S13 · Rewards → Egg Hatch (one flow)

**Rewards layout:** three cards stagger-pop in sequence: ✨ +XP (real number,
big), 🪙 +WonderCoins, 🥚 mystery egg (wiggling). Single button: "Open the
egg 🥚". No back button.
**Hatch layout:** egg centered, large; hint "👆 Tap the egg! (3 taps left)".
Tap 1 → wiggle + crack overlay + "It's cracking!"; tap 2 → bigger crack;
tap 3 → burst → creature pops with scale-bounce, name + trait card rises
below, confetti. Button becomes "Say hi! 🔥".

**Band treatments:**
- 🌱: cards are toy-like with thick shadows; egg is huge; Milo narrates
  every tap ("One more!").
- ⚡: cards slide in like loot reveal; egg has rarity shimmer; "NEW
  WONDERLING DISCOVERED" banner.
- 🔥: minimal — XP line "＋250 XP", coin line, egg on dark pedestal with
  spotlight; hatch is a clean flash + creature card. "Say hi" is neon-outline.

## S14 · Collection

**Layout:** Top: HUD-lite + "🏠 Home". Title "Your Wonderlings". Grid of
creature cards (2–3 cols). Tap → detail sheet (bottom sheet on mobile):
bigger art, trait, evolution progress bar.

**Band treatments:**
- 🌱: 2-col, huge cards, silhouettes are cute rounded "?" blobs;
  evolution bar is a growing vine with a leaf at the target.
- ⚡: 3-col, cards show stage pips (●●○) and evolution teaser text;
  progress bar is an XP-style fill.
- 🔥: 3-col dense, dark glass cards; rarity tags (COMMON/RARE/EPIC);
  evolution shown as a stat line ("23/50 → PYRON"). Silhouettes are sleek
  dark shapes with "???".

## S15 · Parent Dashboard (band-independent)

**Layout:** Calm light surface (Cloud `#FFF9F0`) in ALL cases — never game
chrome. Left/top: tab bar (Overview · Learning · Controls · Profiles ·
Privacy · Subscription). Content is cards with generous whitespace.

**Visual rules:** Nunito throughout (no display fonts); one accent
(Brand Purple); charts are soft rounded bars, no neon; numbers are large and
plain ("92%"); the disclaimer "Levels track journey, not ability." sits
pinned under the Learning tab. Destructive actions (delete data) are red
text buttons with type-to-confirm. This screen should feel like a good
school report, not a game.

---

## Mockup production order (Figma)

1. S5 Age Path (all 3 cards) — locks the three systems.
2. S10 Mini-game, one per band (M1/M2/M3) — locks gameplay chrome.
3. S7 Home (all 3 bands) — locks HUD + Milo placement.
4. S8 World Map (all 3 bands).
5. S12→S13 Rewards/Hatch (all 3 bands).
6. S14 Collection + S15 Parent Dashboard.
7. S1/S2/S3/S6/S9/S11 as needed — smaller screens, mostly reuse.

## Annotation legend (for the mockup files)

- 🔴 primary action · 🟡 secondary · 🔵 info only
- 💬 Milo dialogue (band-tagged: E/A/L)
- 🔊 TTS behavior note · 📳 haptic note · ⏱️ motion duration
- Every mockup frame is labeled `S{nn}-{band}-{state}` (e.g. `S10-A-playing`).
