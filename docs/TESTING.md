# Wonderlings — Testing Plan (Step 12)

**Purpose.** How we test Wonderlings with real kids and parents *before*
expanding the app. The 5–7, 8–11, and 12–15 experiences are tested
**separately** — a 6-year-old and a 14-year-old are not the same user, and a
test that mixes them proves nothing.

**Golden rule.** We are testing the *design*, never the child. If a kid can't
complete a task, the screen failed, not the kid. No-fail design (SCREEN_FLOW.md
global rule 6) applies to testing too: sessions end on a win, every time.

---

## 1. Principles

1. **Safety first.** A parent/guardian is present or has given written consent
   for every session with a minor. Sessions are never recorded without explicit
   parental consent; notes are anonymized (child → "E-3", "L-1").
2. **Separate the bands.** Every finding is tagged Explorer / Adventurer /
   Legend. A "confusing" result from a mixed group is discarded and re-run
   per band.
3. **Test the promise.** The product promises "knowledge is the player's
   superpower" and "levels track journey, not ability." Tests check whether
   kids *feel* that — not just whether buttons work.
4. **Prototype → Flutter → beta.** Each phase has entry criteria (what must be
   true before we start) and exit criteria (what must be true before we move
   on). No phase is skipped because the previous one "felt fine."
5. **Parents are users too.** The parent dashboard gets its own test track —
   trust is the product for them.

---

## 2. Cohorts

| Cohort | Ages | N per round | Session length | Format |
|---|---|---|---|---|
| Explorers | 5–7 | 5 kids | 20 min max | Moderated play, parent present |
| Adventurers | 8–11 | 5 kids | 30 min | Moderated play, parent nearby |
| Legends | 12–15 | 5 teens | 30 min | Moderated play, parent consent, teen interviewed directly |
| Parents | grown-ups | 5 parents | 30 min | Dashboard walkthrough + interview |

5 per cohort per round is enough to find the big problems (Nielsen's curve);
we run 2–3 rounds per phase, fixing between rounds. Total per phase: ~20
sessions. Recruiting: friends & family first, then local parent groups and
schools (with permission). Mix of "math-confident" and "math-anxious" kids —
we especially want the anxious ones, because the no-fail design is for them.

---

## 3. Phase 1 — Prototype testing (v5 HTML, now)

**Entry criteria.** `wonderlings-v5.html` runs offline on iPad + laptop;
harness green (44/44). **We are here.**

The v5 prototype already implements: profile → story intro → world map →
Number Nebula + Storywood → all 6 mini-games (5 rounds each) → world restored
→ rewards → egg hatch → collection. Parent gate/setup/dashboard are spec-only
and are NOT tested in this phase.

### 3a. Per-band task scripts

**Explorers (5–7) — "Can they play without reading?"**
1. Milo's story plays. *Watch:* does the child watch/listen, or tap Next
   blindly? (If blindly → story beats are too long.)
2. "Pick a world and make the reactor work." *Watch:* can they reach the
   mini-game with zero help? Count the assists.
3. Play Alien Boarding + Rhyme Grove. *Watch:* do they use 🔊 "Hear it again"?
   Do wrong answers upset them? (Any tears or quitting = critical fail.)
4. Hatch the egg. *Watch:* do they discover the 3 taps on their own?
- **Success:** completes a 5-round mission with ≤1 assist, smiles at the
  hatch, wants to "do the other world."
- **Red flags:** can't find the answer buttons; ignores Milo's voice; upset
  by a wrong answer; session ends before the mission does.

**Adventurers (8–11) — "Is it a game or a quiz?"**
1. Restore Number Nebula (Power Grid). *Watch:* do they say anything like
   "this is actually fun"? Do they notice the node ignite animation?
2. Restore Storywood (Word Bridge). *Watch:* does the 5-plank bridge make
   them want to finish?
3. Open the collection. *Watch:* do they read the evolution teasers? ("50
   math challenges → Pyron" should spark a reaction.)
- **Success:** finishes both worlds unprompted, checks collection, asks
  "when do the other worlds open?"
- **Red flags:** "this is just school"; skips Milo's quips; bored by round 3
  (→ rounds need variety, not just difficulty).

**Legends (12–15) — "Is it cringe?"**
1. Restore Number Nebula (Reactor Core). *Watch:* is the two-step (pick the
   operation, then solve) satisfying or tedious? Time it.
2. Restore Storywood (Tale Detective). *Watch:* does the evidence-tap feel
   like detective work or busywork?
3. Ask directly: "Would you show this to a friend? What would you change?"
   (Teens will tell you the truth. Listen.)
- **Success:** completes both missions, feedback is about *difficulty tuning*
  ("make the algebra harder") not *tone* ("the fox is for babies").
- **Red flags:** eye-rolls at Milo; "this is for little kids"; finishes as
  fast as possible to end the session. Any of these = the Legend UI system
  needs a rework before Flutter.

### 3b. What we measure (prototype phase)

| Metric | How | Target |
|---|---|---|
| Task completion (reach World Restored) | Observed | ≥ 80% per band |
| Assists needed (adult help) | Counted | Explorers ≤ 1, others 0 |
| Wrong-answer distress | Observed (quit/tears/frustration) | 0 sessions |
| "Do the other world?" (unprompted continue) | Observed | ≥ 60% |
| Time per 5-round mission | Timed | 3–8 min (shorter = too easy, longer = drag) |
| Milo TTS usefulness | Observed + asked | Explorers use replay ≥ once |

### 3c. Session protocol (all kid bands)

1. 2 min warm-up: "Show me a game you like." (Calibrates the kid's baseline.)
2. Hand them the iPad, say: "Milo the fox needs your help saving two worlds."
   Then **shut up** — no hints unless they're stuck >60 seconds.
3. Think-aloud is prompted lightly: "Tell me what you're thinking."
4. End on a win: if they're struggling, guide them to the hatch moment and
   stop there. They leave happy.
5. 3 min debrief: "What was the best part? What was confusing? What would
   you tell a friend about it?"

---

## 4. Phase 2 — Flutter prototype testing (core loop)

**Entry criteria.** TECHNICAL_BUILD.md phases 1–2 done: parent gate, parent
setup, child profile, age path, avatar, home, world map, one full mission
loop (Number Nebula), rewards, hatch, collection, parent dashboard v1.

### New things tested (not in prototype phase)
- **Parent gate kid-proofing:** the "red team" test. Bring 3 kids (one per
  band) and *challenge* them: "Can you get into the grown-ups' area?" If any
  child gets through the hold-2s + math question, the gate fails. (Also test:
  can a tired parent get through in <15 seconds?)
- **Parent setup:** can a parent create an account + child profile in <2 min
  with zero help? Time it. Watch the consent checkbox (is it read or skipped?).
- **Age Path "whoa" moment:** does the live re-skin land? Ask the child to
  describe the difference between the cards.
- **Avatar ownership:** do they care which avatar they picked? (If no one
  cares, avatars need more personality.)
- **Parent dashboard:** separate parent track (section 6).

### Regression
Re-run the full Phase 1 task scripts on the Flutter build. Anything that got
*worse* moving from HTML to Flutter is a launch-blocker.

---

## 5. Phase 3 — Beta (50 families)

**Entry criteria.** TECHNICAL_BUILD.md v1 definition: 99.5% crash-free,
compliance checklist complete, zero trust-promise violations.

- 50 families, 2 weeks, real homes, no moderator. Privacy-safe analytics only
  (hashed child IDs, no names/free text — per TECHNICAL_BUILD.md).
- **Metrics:** D1/D7 retention per band; missions completed per week;
  per-topic accuracy (feeds the parent dashboard); support tickets; parent
  trust survey (5 questions, start/mid/end).
- **Kill criteria (fix before launch):** any trust-promise violation; any
  crash loop; D7 retention <20% in any band; a parent reports their child was
  upset by the app.
- **Diary subset:** 10 families (mixed bands) do a 5-minute voice-note diary
  twice a week: "What did your kid do in Wonderlings today?"

---

## 6. Parent dashboard test track

Separate from kid sessions. 5 parents, 30 min each:

1. **Comprehension:** show the Learning tab with sample data. "What is this
   telling you about your child?" If they can't explain strengths + "practice
   more" in their own words, the plain-language design failed.
2. **Trust:** "What data does Wonderlings keep about your child?" Then show
   the Privacy tab. The gap between their answer and reality must be zero.
3. **Controls:** "Set a 30-minute daily limit and turn off Milo's voice."
   Must take <60 seconds.
4. **The disclaimer:** point at "Levels track journey, not ability." Ask what
   it means to them. If it doesn't land, reword it.
5. **Delete flow:** "Delete all your data." Must be findable and confirmed —
   and must actually work (verify in the backend).

**Pass bar:** 5/5 parents complete all tasks; 5/5 say they'd trust it with
their kid's data; 0 "I didn't know it stored that."

---

## 7. Accessibility & safety testing (every phase)

- **TTS:** every band — does Milo read *everything* that matters when TTS is
  on? (Explorer: mandatory pass.)
- **Reduced motion:** with OS reduced-motion on, confetti/fanfare degrade to
  a gentle fade. No flashing >3/sec anywhere, ever (photosensitivity).
- **Contrast & text:** WCAG AA on all text; no instruction carried by color
  alone (wrong answers shake AND show Milo's hint, not just red).
- **Touch targets:** Explorer 64pt / Adventurer 48pt minimums, verified on
  real iPads, not just the simulator.
- **Parent gate:** red-teamed every phase (section 4).
- **Content:** all generated questions reviewed for age-appropriateness per
  band (CURRICULUM.md). No user-generated content exists, so no moderation
  queue — verify it stays that way.

---

## 8. Issue triage

Every finding gets: band tag, screen, severity, session ID.

- **P0 (launch-blocker):** trust/safety violation, crash, kid distress,
  parent-gate bypass, data-loss.
- **P1:** task completion <80% in a band, "this is just school" / "cringe"
  verdicts, dashboard incomprehension.
- **P2:** polish — animation timing, copy tweaks, Milo line rewrites.
- Rule: P0s stop the line. P1s must clear before the next phase. P2s go to
  the backlog.

Findings live with the build: `tests/` for harness regressions, and a
`docs/TEST_LOG.md` (created at first session) with one row per finding:
date · band · screen · finding · severity · status.

---

## 9. Timeline (how testing interleaves with the build)

| When | What |
|---|---|
| Now | Phase 1, round 1 (v5 prototype, 20 sessions) → fix → round 2 |
| Flutter phases 1–2 | Phase 2 testing on the core loop + parent gate red-team |
| Flutter phases 3–4 | Content & creature testing (do kids understand evolutions?) |
| Pre-launch | Phase 3 beta (50 families, 2 weeks) |
| Post-launch | Continuous: per-topic accuracy review monthly; full re-test per band every major version |

Testing is not a phase at the end — it's the heartbeat between every build
phase. The prototype exists *so that* Phase 1 can run before a line of
Flutter is written.
