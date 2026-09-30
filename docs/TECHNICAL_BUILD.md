# Wonderlings — Technical Build Plan (Step 10)

**Purpose.** The stack, architecture, data schema, and phased roadmap from
this prototype to a shippable v1. Every earlier doc plugs into this one.

**The prototype is the playable spec.** `~/workspace/wonderlings/game.js`
already proves the mission loop, XP, streaks, world config, egg flow, and
age-adaptive content. Flutter doesn't re-derive the design — it ports
tested logic and the JSON content shape (`{prompt, spoken, answer,
choices[3], topic, roundType, visual?}`).

---

## 1. Stack (locked)

| Layer | Choice | Why |
|---|---|---|
| App | **Flutter + Dart** | One codebase → iOS, iPad, Android; matches the plan |
| Backend | **Firebase**: Auth, Firestore, Storage, Cloud Functions, Crashlytics | Managed, scales, offline story is good |
| Subscriptions | **RevenueCat** | Wraps App Store/Play billing; parent-dashboard receipts |
| State | **Riverpod** | Testable, scales past the MVP |
| Characters | **Rive** (state machines) | Milo + 5 creatures × 3 stages × 5 states — needs real rigs |
| Effects | **Lottie** | Beams, blooms, stamps, confetti — lightweight |
| Voice | `flutter_tts` (system voices) | Same strategy as the prototype: best available voice, pitch 1.7 / rate 1.05 for Milo |
| SFX | `audioplayers` | Chimes, thunks, giggles (bundled assets) |
| Local data | Firestore offline persistence + bundled content packs | Offline-first without a second database |
| CI/CD | GitHub Actions → **Codemagic** | Flavors: dev/staging/prod; TestFlight + Play Internal for beta |

**Not in v1:** custom backend, web app, teacher mode, multiplayer —
anything not in the MVP docs.

## 2. Project structure (feature-first)

```
lib/
  core/            # theme (3 age-band themes), router, audio, tts, config
  features/
    auth/          # parent account, parent gate
    onboarding/    # setup flow, child profile, avatar
    home/          # home hub, world map
    missions/      # mission scaffold: power meter, streaks, XP floats
      games/       # alien_boarding, power_grid, reactor_core,
                   # rhyme_grove, word_bridge, tale_detective
    worlds/        # restoration cinematics, world config (ports game.js WORLDS)
    creatures/     # collection, hatching, evolution, bond
    economy/       # coins, shop, badges (single config file per ECONOMY.md)
    parent/        # dashboard, controls, reports, promises (own nav stack)
  content/         # JSON packs: questions, dialogue lines, shop catalog
assets/
  rive/  lottie/  audio/  images/
```

## 3. Firestore schema (v1 — schema it now, per step 9)

```
/parents/{uid}
  email, createdAt, plusStatus, plusExpiry, settings{}
/parents/{uid}/children/{childId}
  name, ageBand, avatar, miloVoice{pitch,rate},
  xp, level, coins, explorerDays, weeklyActiveDays[],
  settings{ttsDefault, quietHours, dailyLimitMin, reducedMotion},
  stats{missionsCompleted, correctTotal, challengesTotal}
/parents/{uid}/children/{childId}/topics/{topicId}
  attempts, correct, rollingAccuracy, status  # powers dashboard + adaptivity
/parents/{uid}/children/{childId}/creatures/{creatureId}
  stage, bond, active, unlockedAt
/parents/{uid}/children/{childId}/badges/{badgeId}
  earnedAt
/contentPacks/{packId}   # versioned question/dialogue packs (or bundled + Remote Config version)
```

**Rules of the schema:** child gameplay data lives under the parent's
consent scope; analytics events carry `childId` hash only — never names;
Firestore Security Rules deny all child-PII reads except the owning parent.

## 4. Key systems

**Content pipeline.** Authors (that's us + future us) write JSON packs in
the prototype's shape; a validation script checks every item has
`prompt/spoken/answer/3 unique choices/topic`. Packs are versioned;
the app bundles a fallback and updates from Storage. **Eli's lane:** this
is the perfect learn-by-doing contribution — writing question packs is
real, shippable work with zero Flutter needed.

**Adaptive engine.** Client computes rolling accuracy per topic from the
`topics` subcollection; mission generator picks 60% at-level, 25% practice
(lowest topics), 15% stretch. No server ML in v1 — arithmetic beats magic.

**Mission scaffold.** One `MissionScreen` (power meter, streak chimes, XP
floats, companion corner, Milo dialogue) + 6 `GameWidget`s implementing
MINI_GAMES.md round loops. New games later = new widget, zero scaffold
changes.

**TTS/audio services.** Central `MiloVoice` service: band-aware defaults,
tap-to-hear everywhere, ducking under SFX, silent mode respected. The
approved voice recipe (pitch 1.7, rate 1.05, brightest childlike system
voice, occasional giggle) is a config constant, not scattered code.

**Parent gate.** Hold-2s + grown-up question widget, reusable guard around
the entire `parent/` stack.

## 5. Rive/Lottie pipeline

- **Rive:** one `.riv` per creature per stage is overkill — one rig per
  creature with stage as a skin swap where possible; state machines:
  `idle, happy, celebrate, comfort, sleep` + evolution timeline. Milo gets
  the richest rig (talk, explain, cheer, comfort, giggle).
- **Lottie:** beam travel, bloom, stamp slam, confetti, XP floats, star-shower.
- Naming: `creatures/pyro/stage2.riv`, `fx/power_beam.json`. Versioned
  with the content packs.

## 6. Analytics (from day one — per ECONOMY.md)

Events: `mission_started/completed` (world, game, band), `round_answered`
(topic, correct, responseMs), `level_up`, `egg_hatched`, `evolution`,
`badge_earned`, `shop_purchase` (item, price), `parent_dashboard_view`,
`report_sent`. **Privacy:** hashed childId only; no names, no free text;
separate consent-gated analytics for marketing (default off).

## 7. Roadmap

| Phase | Scope | Exit criteria |
|---|---|---|
| **0 — Foundation** | Project, flavors, CI, design system (3 themes), nav, Firebase | App boots to a themed Home on iOS+Android |
| **1 — Core loop** | Auth → parent setup → child profile → Home → 1 mission (Alien Boarding, ported) → rewards → egg hatch | A child can play a full loop end-to-end |
| **2 — Content** | All 6 games, both worlds, full MVP question packs (25+/topic), restoration cinematics | Curriculum coverage: every ✅ row playable |
| **3 — Creatures & economy** | Collection, hatching, evolutions, bond, XP/levels, coins, shop, badges | ECONOMY.md + WONDERLINGS.md fully live |
| **4 — Parents** | Gate, dashboard, controls, reports, promises, Plus via RevenueCat | PARENT_EXPERIENCE.md fully live; compliance checklist green |
| **5 — Beta** | Polish pass, 30-min nudge, quiet hours, TestFlight/Play Internal, compliance audit | 50-family beta, crash-free 99.5% |

**Honest estimate:** phases 0–2 are the bulk. Solo dev: ~4–6 months to
beta. Small team (2 devs + 1 designer): ~3 months. Content authoring
(question packs) runs parallel from phase 1 — it needs humans, not coders.

## 8. Risks & mitigations

- **TTS quality varies by device** → band defaults + parent override; never
  gate learning on voice alone (text always shown for 8+).
- **Rive authoring is a skill** → start with Milo + Pyro stage 1; creatures
  can ship with simpler rigs and upgrade post-launch.
- **Scope creep (8 worlds)** → the world-config system from the prototype
  makes adding worlds cheap *later*; v1 ships 2. The plan says so; the
  code enforces it.
- **COPPA in Firebase** → US-region Firestore, 13-month data retention
  default, deletion API wired to the dashboard's one-tap delete.
- **The "second system" trap** → port, don't rewrite. `game.js` logic is
  the reference implementation; Flutter mirrors its state machine.

## 9. Definition of v1 done

All 10 docs true in the shipped app · 50-family beta green · compliance
checklist signed · crash-free 99.5% · median time-to-Level-5 ≤ 7 days ·
zero "our promises" violations. Then — and only then — world 3.
