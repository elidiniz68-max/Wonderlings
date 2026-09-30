# Wonderlings — Parent Experience (MVP Spec)

**Purpose.** Everything a parent sees, controls, and is promised. The
dashboard, reports, controls, settings, trust copy, and compliance
checklist. If parents don't trust it, nothing else in this plan matters.

**Parent experience principles.**
1. **Translate play into parent language.** "Fractions: practicing (72%)"
   beats "1,240 XP." Parents think in skills and school; the dashboard
   speaks that language using CURRICULUM.md topics.
2. **Levels measure adventure, not intelligence.** Every progress surface
   carries the disclaimer: *"Levels track journey, not ability."*
3. **Control without surveillance.** Parents get insight and tools — never
   spyware framing. Copy is warm: "Here's what they're exploring," not
   "Here's what they're doing wrong."
4. **Kids never see money.** No prices, no upsells, no Plus mentions in any
   child-facing surface. All monetization lives behind the parent gate.
5. **The child is never the product.** No ads, no data sale, no behavioral
   tracking, minimal collection. This is the brand.

---

## 1. Parent gate (locked)

Entry to ALL parent surfaces (dashboard, settings, Plus, shop oversight):
1. **Press and hold** the parent button for 2 seconds (defeats toddlers and
   accidental taps).
2. **Answer a grown-up question** — randomized arithmetic an adult finds
   trivial and a young child won't (e.g. "What is 14 × 6?"). Three options.

Why both: hold alone is learnable by a determined 7-year-old; a question
alone is tappable-through. Together they're fast for parents (~5 seconds)
and effective. Failed attempts simply re-ask — no lockouts (a locked-out
parent is a support ticket).

## 2. Dashboard — "Explorer Report"

Per child (profile switcher at top). Sections:

**At a glance.** Avatar + name, level ("Level 7 Explorer" — adventure
framing), total Explorer Days, this week's active days (rhythm dots, never
a broken streak), creatures collected (3/5).

**Learning progress.** Per subject (Math, Reading — more as worlds launch),
per curriculum topic with plain-language status:
- 🌱 *Starting* (<40% rolling) · 🌿 *Practicing* (40–79%) · 🌳 *Strong*
  (≥80%, badge earned)
- "Areas to practice" — the 2 lowest topics, with a one-tap "suggest
  missions" that queues them into the child's Home next session. (Needs the
  adaptive per-topic tracker from CURRICULUM.md.)
- Trend sparkline (Plus: full graphs + printable PDF report).

**Time.** Minutes played this week, missions completed, average session
length. No judgment copy — "2h 15m of adventure this week" with a smile,
not a warning.

**Collection & badges.** Creatures, evolutions, badge shelf — the fun stuff
parents love to ask about at dinner.

**Milestones feed.** "Sylvana evolved! 🌿" · "Fractions: Strong!" ·
"First Twin Worlds egg!" — shareable (parent's device share sheet), never
auto-posted anywhere.

## 3. Weekly report (opt-in)

A short email/push every Sunday evening: minutes played, missions, one
highlight ("Maya mastered rhyming!"), one gentle suggestion ("Fractions
could use practice — 2 missions queued"). **Opt-in at setup**, one-tap
unsubscribe, no marketing mixed in. Ever.

## 4. Controls

**Playtime.**
- Default: gentle Milo nudge at 30 continuous minutes (dismissible).
- Optional parent-set daily limit (15/30/45/60/90 min) — when reached, the
  game wraps up gracefully: finish the round, celebrate, "See you tomorrow,
  Explorer!" Never a mid-question hard cut.
- **Quiet hours** (e.g. 8pm–7am): app opens to a sleepy Sparkle nightlight
  screen — "The worlds are dreaming. See you in the morning!" (A hard gate,
  parent-set.)

**Content.**
- Age band lock: switching bands requires the parent gate (a 6-year-old
  shouldn't self-promote to Legend difficulty).
- TTS default per band (override anytime), music/sound toggles, reduced
  motion toggle (accessibility — replaces squash-and-stretch with fades).

**Spending & safety.**
- Plus subscription management (upgrade/cancel — cancel must be as easy as
  signup; that's the law in more places every year).
- Purchase gate: the parent gate guards everything, but this toggle can
  additionally require re-authentication per purchase.
- The promises, restated in-settings: no ads, no loot boxes, no purchasable
  creatures, no child-visible prices.

## 5. Profiles & data

- **Child profiles:** 2 free, 6 on Plus. Add/edit name, age band, avatar.
  Deleting a profile deletes its data (with a "are you sure" + 30-day
  grace via support).
- **Your data, your rights:** download all data (one tap, JSON), delete
  everything (one tap, confirmed). COPPA/GDPR-K compliant by design.
- **What we collect (minimal):** account email, child display name + age
  band, gameplay events (answers per topic — needed for adaptivity),
  device type (for bug fixing). That's the list. Published verbatim
  in-app.

## 6. Trust copy — "Our Promises" (in-app screen, linked at signup)

> 1. **No ads.** Not now, not ever. Not even "kid-safe" ones.
> 2. **No loot boxes or random paid rewards.** Eggs are earned, never bought.
> 3. **No chat, no friends, no strangers.** Your child plays solo in a safe
>    world.
> 4. **Learning is never paywalled.** Paying buys costumes, not knowledge.
> 5. **Missed days are never punished.** No streak resets, no guilt.
> 6. **Your data stays yours.** Minimal collection, never sold, deletable
>    anytime.
> 7. **You control the money.** Every purchase and setting sits behind the
>    parent gate.

This screen is also the App Store "privacy story" — screenshot-ready.

## 7. Notifications (parent only)

- Milestone celebrations (opt-in): "🔥 Pyro evolved into Pyron!"
- Weekly report (opt-in, §3).
- Practical: subscription receipts, security notices.
- **Never:** marketing to the child, "we miss you" guilt pushes to kids,
  or any notification a child could confuse for gameplay.

## 8. Compliance checklist (pre-launch gate)

- [ ] COPPA: verifiable parental consent at signup; minimal child data;
      no behavioral advertising; parent right to review/delete.
- [ ] Apple App Store Kids Category + Google Play Families Policy review.
- [ ] Age gate: no under-5 mode confusion (product is 5–15; under-5s get
      the "come back soon" screen, not a game).
- [ ] Accessibility: WCAG-minded contrast, touch targets (specced in
      MINI_GAMES.md), reduced motion.
- [ ] Security: Firebase rules audited; child data never in logs/analytics
      plaintext; breach plan written.
- [ ] The "Our Promises" screen is true on day one — every claim verified
      before it ships.

## 9. Support

- In-dashboard help: FAQ ("Why is fractions 'practicing'?", "How do eggs
  work?", "Cancel Plus"), contact support, and a "What is my child seeing
  right now?" explainer linking each game to its curriculum objectives.
- Tone rule for all parent copy: **competent, warm, zero condescension.**
  Parents are the heroes of this story — we're their sidekick.

## Forward refs

- **Step 10 (build):** parent surfaces are a separate app section behind
  the gate (own navigation stack, own analytics events); dashboard data
  comes from the per-topic attempt store — schema it now, not later.
- **Post-MVP:** teacher/classroom mode (same dashboard, educator lens) —
  do not build for v1, but keep the data model multi-role capable.
