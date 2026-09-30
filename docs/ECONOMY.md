# Wonderlings — Progression & Economy (MVP Spec)

**Purpose.** The complete XP/level/coin/badge/loop design, the Plus/free
split, and session-health rules. Resolves the two talent flags from
WONDERLINGS.md.

**Economy principles (locked).**
1. **Learning is never paywalled.** Every world, game, creature, and
   curriculum objective is free. Money buys cosmetics and convenience —
   never knowledge, never creatures, never advantage.
2. **No dark patterns.** No loot boxes, no paid random eggs, no
   "energy" that gates learning, no ads, no manipulative countdowns.
3. **Missed days are never punished.** No streak resets, no decay, no
   shaming. (See Engagement loops.)
4. **Academic ability ≠ game level.** Levels measure *adventure*, not
   intelligence. A level-20 child is not "smarter" — they've journeyed
   further. Parent dashboard copy reinforces this.
5. **Mild surplus.** The coin economy runs slightly generous — a child
   should afford something fun every few days of play, not grind for weeks.

---

## XP & levels

**Sources (locked from prototype).**

| Source | XP |
|---|---|
| Correct round | 10 |
| Mission completion bonus | 200 |
| Level-up | 25 × new level (in coins — see below; XP itself just levels) |

A mission = 5 rounds → **200–250 XP**, always ≥200 even with 0 correct
(the completion bonus honors showing up).

**Level curve.** `xpToNext(level) = 150 × (level + 1)`

| Level | XP to next | Cumulative | Milestone |
|---|---|---|---|
| 1 → 2 | 300 | 300 | — |
| 2 → 3 | 450 | 750 | — |
| 3 → 4 | 600 | 1,350 | — |
| 4 → 5 | 750 | 2,100 | ✨ **Sparkle egg** |
| 5 → 6 | 900 | 3,000 | — |
| 9 → 10 | 1,500 | 8,100 | 🌟 **Twinkle** (Sparkle evolves) |
| 14 → 15 | 2,250 | 18,900 | — |
| 19 → 20 | 3,000 | 31,350 | 💫 **NOVA PRIME** |

**Pacing check** (mission ≈ 225 XP, casual = 2 missions/day):
- Level 5 (Sparkle): ~9 missions ≈ **4–5 days**. First creature milestone
  lands in week one. ✓
- Level 10 (Twinkle): ~36 missions ≈ **2–3 weeks**. ✓
- Level 20 (Nova Prime): ~140 missions ≈ **2–3 months**. A true long-term
  chase for the Epic final form. ✓

**Level-up rewards:** coins = 25 × new level (L5 → 125 coins) + the standard
level-up celebration (Sparkle's Spotlight at 5/10/20).

---

## WonderCoins 🪙

**Sources.**

| Source | Coins | Notes |
|---|---|---|
| Mission complete | 100 | Fixed, every mission |
| Bubbles' Treasure Dive | +5 | "Bubbles found this for you!" — tiny, transparent |
| Level-up | 25 × level | — |
| Badge earned | 25 | First time per badge |
| Weekly rhythm bonus | 150 | 3+ active days in a week (see Loops) |

**Sinks — the cosmetic shop (MVP catalog).** Everything cosmetic. Nothing
affects gameplay, learning, or creatures' abilities.

| Item | Price | Notes |
|---|---|---|
| Creature hats (party hat, leaf crown…) | 150 | Per creature, pure flair |
| Nameplate styles | 100 | Collection/Home display |
| Avatar outfits | 200–400 | Seasonal sets rotate |
| Home decorations | 300–500 | Themes: Meadow, Nebula, Cozy |
| Map decorations | 300 | Flags, sparkles on the world map |

**Balance target.** A casual player (2 missions/day) earns ~1,700 coins/week
and can buy a hat every day or save ~4 days for a Home theme. Generous on
purpose — coins are joy, not grind.

**Talent review (resolving WONDERLINGS.md flags):**
- ✅ **Bubbles' Treasure Dive (+5)** — approved. Negligible economy impact
  (~2.5% of mission income), high delight.
- ✅ **Pebbles' Second Chance** — approved. Same XP either way; it's a
  kindness mechanic, not an advantage. Once per mission.

---

## Badges 🏅

Badges live on a shelf in the Collection + child profile. Each pays 25
coins once. Categories:

**Mastery** (auto, one per curriculum topic at ≥80%/20 attempts):
🔢 Counter · ➕ Adder · 🔤 Letter Scout · 🌸 Rhyme Ranger · ✖️ Times Hero ·
📖 Word Wizard · 🧮 Equation Solver · 🔍 Inference Ace · …(full set =
CURRICULUM.md topics)

**Milestones:** 👣 First Steps (1 mission) · 🗺️ Adventurer (10) ·
⚔️ Veteran (50) · 💯 Centurion (100)

**Levels:** ⭐ Rising Star (L5) · 🌟 Superstar (L10) · 💫 Nova (L20)

**Creatures:** 🔥 Friend of Fire (hatch Pyro) · 🌿 Friend of Leaves ·
🌀 Evolution! (first evolution) · 💛 Bonded (Bond 3 with any companion)

**Worlds:** 🌌 Nebula Restored · 🌳 Storywood Restored · 👯 Twin Hero
(both restored)

**Heart:** 🔙 Comeback Kid (return after 7+ days — *rewards* returning,
never punishes absence) · 📅 Steady Explorer (3+ active days in a week)

---

## Engagement loops (punishment-free by design)

**Daily — "Daily Discovery."** One featured mission per day (rotates
world/subject) with a small coin bonus (+25). Framed as "Milo found
something interesting today!" — never "don't break your streak."

**Weekly — rhythm, not streaks.** 3+ active days in a calendar week →
150-coin "Weekly Rhythm" bonus + Milo's warm note. A missed day simply
doesn't count toward the 3 — nothing resets, nothing is lost.

**Streaks, redefined.** There is NO consecutive-day streak counter and NO
reset mechanic anywhere in the product. The only time language: total
"Explorer Days" (lifetime active days — a number that only grows) and the
weekly rhythm above. Copy rule: every return greeting is warm —
*"Welcome back, Explorer. Your next adventure is ready."*

**Session health.** After ~30 minutes of continuous play, Milo gently
suggests a stretch/break (dismissible; parent can set a hard limit in the
dashboard). Never a hard lock by default — trust + tools, not control.

---

## Plus vs Free (recommended split)

**Free — the whole adventure.** All worlds, all mini-games, all curriculum,
all 5+ creatures, badges, parent dashboard core. Learning is complete
without paying — this is the promise parents tell other parents.

**Wonderlings Plus** (pricing TBD — recommend market research against
competitors; placeholder: $7.99/mo or $59.99/yr):
- Exclusive cosmetic sets (avatar outfits, home themes, creature accessories)
- 6 child profiles (free: 2)
- Advanced parent insights (per-topic trend graphs, printable progress reports)
- Offline adventure packs (download worlds for travel)
- Early access to new worlds/cosmetics

**Never in Plus:** learning content, creatures, XP/coin boosts, loot boxes,
ads, or anything that makes a free child feel second-class. If a design
can't pass the sentence *"a free player never feels punished,"* it doesn't
ship.

---

## Tuning appendix

- Mission XP range: 200 (0 correct) – 250 (all correct). The 200-point
  completion bonus dominates → **showing up is the skill being rewarded**,
  which is exactly right for ages 5–15.
- Level formula `150 × (level+1)` keeps early levels snappy (hook) and
  late levels aspirational (retention) with zero tuning cliffs.
- Coin surplus check: weekly income ~1,700 vs. cheapest desirable item
  (hat, 150) → ~11% of weekly income. Feels generous; shop stays exciting.
- Revisit quarterly post-launch: median days to Level 10, coin balances at
  30 days, % of kids buying vs. saving. Tune prices, never payouts.

## Forward refs

- **Step 9 (parent experience):** dashboard shows XP/levels as "adventure
  progress" with the ability≠level disclaimer; playtime controls; Plus
  upsell is parent-only, never shown to children.
- **Step 10 (build):** economy constants in one config file; analytics
  events for every source/sink from day one.
