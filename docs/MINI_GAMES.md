# Wonderlings — Mini-Game Design (MVP Spec)

**Purpose.** Real gameplay for all 6 MVP slots — rules, round loop, controls,
difficulty progression, scoring, animations, rewards, and replay value.
Step 10 (Flutter) builds directly from this doc. Prototype status notes show
what the HTML slice already proves.

**Shared design laws (all 6 games).**
1. **The fiction is the mechanic.** Counting aliens *is* the math; laying
   bridge planks *is* the vocabulary. Never "answer 5 questions to win" —
   the world changes because of what the child does.
2. **5 rounds per mission**, escalating: R1 warm-up (~70%), R2–R4 at band
   level, R5 stretch. (From CURRICULUM.md.)
3. **Scoring (MVP):** 10 XP per correct round, +200 mission bonus, +100
   WonderCoins per mission. Streaks earn praise + rising chimes only — no
   XP inflation before the economy is designed (step 8).
4. **No-fail.** Wrong answer → gentle feedback + Milo hint → next round.
   XP never decreases. No timers in MVP.
5. **Animation law:** the child's action causes the animation; celebrations
   <1.5s; correct = world visibly heals, wrong = world gently waits.
6. **TTS:** Explorer always on (tap speaker to rehear); Adventurer on;
   Legend off by default, tap-to-hear.
7. **Accessibility:** touch targets ≥64/56/52px by band; never color-only
   signaling (shape + label + icon); dyslexia-friendly spacing on text cards.

---

## M1 · ALIEN BOARDING — Number Nebula, ages 5–7
*Prototype status: counting sky implemented in v4.*

**Fantasy.** Alien families are stranded across the sky. Count them onto the
rescue ship before the Fade dims their lights.

**Round loop.**
1. N aliens float in the sky (staggered float animation).
2. Milo asks: "How many aliens board the ship? 🚀" (TTS).
3. Child taps one of 3 big number buttons.
4. Correct → aliens march one-by-one into the 🚀 (translate + pop), power
   surges. Wrong → aliens giggle, stay floating, Milo: "Count again slowly!"

**Round types (by curriculum).**
- **Count:** N aliens (3–10), tap the total.
- **Add:** group A waves, then group B arrives — count them all (sums ≤10).
- **Take away:** N aliens, M dim and "wave goodbye 👋" — how many stay?

**Controls.** 3 oversized number buttons (answers within ±2 of correct, no
negatives, no duplicates).

**Difficulty (5-round arc).** R1: count 3–5 · R2: count 6–10 · R3: add within
10 · R4: subtract within 10 · R5: stretch (e.g. 8+7 with the sky to count).

**Animations.** Idle: staggered float. Correct: aliens queue into the ship
(0.15s apart), ship does a happy wiggle, power meter surges. Wrong: soft
shake of the tapped button, aliens do a reassuring bob.

**Rewards tie-in.** Every 10th alien boarded = the ship's light gets brighter
(persistent visual across sessions — cheap, delightful).

**Replay value.** Alien colors/ships rotate; night-sky variant; "rescue
streak" counter; counts toward Pyro's evolution (50 math challenges).

**Content needed.** Order/compare items (curriculum 🔲) arrive as new round
types: "Which group has MORE?" (two skies, tap the bigger).

---

## M2 · POWER GRID — Number Nebula, ages 8–11
*Prototype status: equation format exists; grid gameplay is new.*

**Fantasy.** The reactor's power grid is dark. Solve equations to route power
node-by-node until the beam reaches the reactor core.

**Round loop.**
1. A 2×3 grid of nodes appears; 2–3 are dark, the rest show decoy numbers.
2. Milo shows the equation: "3 × 4 = ? ⚡ Reroute the power!"
3. Child taps the node labeled **12**.
4. Correct → a power beam zaps node-to-node into the reactor (animated path),
   node lights up, reactor hums louder. Wrong → node fizzles softly,
   Milo: "Check that fact — try again next round!"

**Round types.**
- **Fact:** a × b = ? / (a×b) ÷ a = ? (facts to 10×10).
- **Missing factor:** 3 × ? = 24 (tap the missing number).
- **Fraction ID:** "Which node shows ½?" — nodes show pie visuals, not just
  numerals.
- **Fraction compare:** "Which is bigger, ⅓ or ¼?" (visual pies).

**Controls.** Tap the labeled node (3–4 labeled nodes per round; labels are
large numerals or pie graphics).

**Difficulty arc.** R1: × facts · R2: ÷ facts · R3: missing factor ·
R4: fraction ID · R5: stretch (fraction compare or 12×8).

**Animations.** Beam travel along the grid (0.6s), node ignite glow, reactor
core spins faster per round completed. Persistent: the map's reactor art gets
one more lit window per mission completed.

**Rewards tie-in.** Streaks trigger "OVERLOAD!" — the whole grid flashes
(verbal + visual only, no XP change).

**Replay value.** Grid layouts and decoy positions randomize; post-MVP "surge
mode" (optional timer for thrill-seekers, never required).

**Content needed.** All fraction items + missing-factor bank (curriculum 🔲).

---

## M3 · REACTOR CORE — Number Nebula, ages 12–15
*Prototype status: solve-for-x exists; two-step "first move" gameplay is new.*

**Fantasy.** The reactor core is unbalanced — equations spinning out of
control. Isolate x to stabilize it. This is algebra as *doing*, not guessing.

**Round loop (two steps — the gameplay).**
1. Core shows e.g. `3x + 4 = 19`, wobbling.
2. **Step 1 — the move:** "What's the FIRST move?" Buttons: "−4 both sides"
   / "÷3 both sides" / "+4 both sides". Tap the right first move.
   - Wrong move → Milo hints ("To free x, undo the +4 first.") and the child
     retries Step 1 — a learning moment, not a fail.
3. **Step 2 — solve:** simplified `3x = 15` → "x = ?" with 3 choices.
4. Correct → core snaps into balance, glows blue, spins smooth.

**Round types.** One-step (x + 5 = 12) → two-step (3x + 4 = 19) → integers
(−2x + 3 = 11) → stretch (fractional coefficients, post-MVP).

**Controls.** Move buttons (text, large) then answer buttons. Legend density
is fine — smaller text OK.

**Difficulty arc.** R1: one-step · R2–R3: two-step · R4: integers ·
R5: stretch (e.g. 5x − 8 = 37).

**Animations.** Unbalanced: core wobbles + red flicker. Right first move:
half the wobble stops. Solved: balance snap + blue glow + "STABILIZED" tag.
Wrong move: core shudders, Milo's hint slides in.

**Rewards tie-in.** "Clean solves" (no wrong move) count toward a
"Precision Engineer" badge (step 8 economy).

**Replay value.** Infinite equation generator; post-MVP "meltdown mode"
(chain 5 equations against a rising instability meter).

**Content needed.** Integer-operation items; generator already covers the rest.

---

## R1 · RHYME GROVE — Storywood, ages 5–7
*Prototype status: word-choice format exists; grove fiction + TTS-first is new.*

**Fantasy.** The Story Tree's grove is quiet — the rhymes have scattered.
Wake the flowers and trees by matching sounds.

**Round loop.**
1. Milo **says** the prompt aloud (TTS-first; text is secondary at this age):
   "Which flower rhymes with CAT? 🌸"
2. Three big flowers show word + picture (HAT 🎩 / DOG 🐶 / BUS 🚌). Tap the
   speaker icon to rehear any time.
3. Correct → flower blooms (petals open), butterfly lands. Wrong → flower
   sways gently, Milo: "Listen to the END of the words…"

**Round types.**
- **Rhyme match:** hear CAT → tap HAT (picture-supported).
- **Beginning sound:** "Which starts with sss?" → SUN ☀️ / MOON 🌙 / CAT 🐱.
- **Letter stones:** "Which letter comes AFTER B?" — letters on stones.
- **Word match:** picture 🐶 → tap DOG (CVC + sight words as content grows).

**Controls.** 3 large cards (word + emoji, 64px+ targets). Speaker button
replays TTS.

**Difficulty arc.** R1: rhymes (picture-heavy) · R2: beginning sounds ·
R3: letters · R4: CVC word match · R5: stretch (sight word or rime blend).

**Animations.** Bloom (scale + petal rotate, 0.8s), butterfly path on
correct; sway on wrong. Persistent: grove gains one bloomed flower per
mission — the Storywood map visibly fills in.

**Rewards tie-in.** "Grove Keeper" progress: flowers collected per mission.

**Replay value.** Flower/word art rotates; seasonal grove skins; counts
toward Sylva's evolution (50 reading challenges).

**Content needed.** CVC bank + 20 sight words (curriculum 🔲).

---

## R2 · WORD BRIDGE — Storywood, ages 8–11
*Prototype status: vocab format exists; bridge-building fiction is new.*

**Fantasy.** The ravine bridge lost its planks. Every word you master lays a
plank — finish the bridge and cross to the Story Tree.

**Round loop.**
1. Bridge shows 5 empty slots (one fills per round — the mission IS the bridge).
2. Milo poses the word challenge with a sentence where it helps.
3. Child taps one of 3 word buttons.
4. Correct → plank slams in with a thunk, bridge extends. Wrong → plank
   wobbles and slides back, Milo: "Think about what the sentence tells you…"
5. After R5: Milo walks across the finished bridge 🎉.

**Round types.**
- **Synonym:** "Same as HAPPY" → JOYFUL.
- **Antonym:** "Opposite of BRAVE" → TIMID.
- **Homophone:** "I ___ a letter yesterday." → WROTE (not RIGHT).
- **Context clue:** "The climber felt EXHAUSTED…" → VERY TIRED.
- **Compound:** "SUN + FLOWER =" → SUNFLOWER.

**Controls.** 3 word buttons; sentence card above for context types.

**Difficulty arc.** R1: synonyms · R2: antonyms · R3: homophones ·
R4: context clues · R5: stretch (compound or affix: "UN + HAPPY = ?").

**Animations.** Plank drop + dust puff (0.5s), bridge completion walk,
ravine mist. Persistent: completed bridges stay built on the Storywood map.

**Rewards tie-in.** "Bridge Builder" badge at 5 bridges; planks get fancier
wood as streaks grow (visual only).

**Replay value.** Bridge designs rotate (rope, stone, rainbow); post-MVP
7-plank "long bridges".

**Content needed.** Main-idea items + affix bank (curriculum 🔲).

---

## R3 · TALE DETECTIVE — Storywood, ages 12–15
*Prototype status: passage format exists; evidence-tap gameplay is new.*

**Fantasy.** Stories across Storywood have gone cold — endings missing, motives
unclear. You're the detective. Read the scene, crack the case.

**Round loop.**
1. Case file: a 2–4 line micro-passage in a dossier card. 🔍
2. The question: e.g. "What can you infer about Mara?"
3. **Two-tap for inference:** tap the answer (3 choices), then "Prove it —
   tap the line." Tapping the correct line = "CASE CLOSED" stamp.
   (Single-tap for vocab/device questions.)
4. Correct → stamp slam + case file glows. Wrong → Milo: "Re-read the last
   line… what is it *really* saying?"

**Round types.**
- **Inference + evidence** (two-tap — the signature mechanic).
- **Figurative language:** "She ran LIKE the wind" → SIMILE.
- **Roots:** "In CHRONOLOGY, 'chron' means…" → TIME.
- **Author's purpose:** "Vote for Milo!" poster → PERSUADE.
- **Mood:** "Which mood does this scene create?"

**Controls.** Dossier card (scrollable if long), 3 answer buttons, tappable
passage lines for evidence.

**Difficulty arc.** R1: vocab in context · R2: figurative language ·
R3: inference + evidence · R4: roots/purpose · R5: stretch (mood + double
inference).

**Animations.** Magnifier sweep on open, stamp slam (0.4s, screen shake tiny),
file glow. Tone stays noir-lite — cool, not childish.

**Rewards tie-in.** "Cases closed" counter; 25 cases = "Master Sleuth" badge
(step 8).

**Replay value.** Endless passage bank; post-MVP "cold cases" (multi-
paragraph, multi-evidence).

**Content needed.** Mood items + deeper passage bank (curriculum 🔲).

---

## Cross-game systems

| System | Rule |
|---|---|
| XP | 10/round correct, +200 mission, +100 coins. Fixed until step 8. |
| Streaks | Praise + rising chime pitch. No XP change (pre-economy). |
| Hints | Wrong answer → Milo hint tied to the *skill* ("undo the +4 first", "listen to the END"), never just "try again". |
| Mastery | ≥80% over last 20 attempts per topic → badge (CURRICULUM.md). |
| Evolutions | Math challenges → Pyro line; reading → Sylva line (50 each). |
| Session length | 5–10 min target; Home always one tap away. |

## Build notes (Flutter, step 10)

- **Rive:** Milo (per-game reactions: count-along, plank-thunk, stamp-slam),
  aliens, bridge planks, reactor core states (wobble/balanced).
- **Lottie:** beam travel, bloom, stamp, confetti, XP floats.
- One `MissionScreen` scaffold per the SCREEN_FLOW; games plug in as
  `GameWidget`s sharing the power-meter/XP/streak scaffold.
- Content arrives as JSON: `{prompt, spoken, answer, choices[3], topic,
  roundType, visual?}` — the prototype's question shape already matches.
