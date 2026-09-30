# Wonderlings — Visual Identity (MVP Spec)

**Purpose.** The complete visual system: logo, Milo, palette, fonts, buttons,
icons, cards, age-specific UI styles, and the Wonderling creature style guide.
Mockups and the Flutter build implement this doc — no new visual language
without updating it.

**Key art (v1, approved direction):**
- `identity/wonderlings-logo.webp` — master logo
- `identity/milo-character.webp` — Milo design sheet (2 poses)
- `identity/wonderlings-lineup.webp` — the 5 MVP Wonderlings

**Art direction (one line).** Soft 3D cartoon, Pixar-like: rounded forms, big
expressive eyes, vibrant color, gentle rim light. Nothing sharp, nothing scary.
The *characters* stay constant across age bands — the *UI around them* changes.

---

## 1. Logo

- **Wordmark:** chunky 3D rounded letterforms, gradient **Brand Purple → Brand
  Pink**, on Deep Space navy with faint stars.
- **Signature details:** the "O" is a ringed planet; the "i" is dotted with a
  sparkling star. These two marks are the brand shorthand.
- **App icon:** the ringed-planet "O" alone, on Deep Space navy, starfield.
- **Variants:** full-color (default, on dark), mono white (on busy art),
  mono navy (print/merch).
- **Clear space:** height of the "W" on all sides. Minimum width: 120px
  digital / 30mm print.
- **Don'ts:** no gradients other than purple→pink, no drop shadows beyond the
  built-in one, no rotating/tilting, never on low-contrast backgrounds.

## 2. Milo — character bible

- **Species:** fox kit. **Fur:** bright orange `#F5821F`. **Belly/inner ear:**
  cream `#FFF3E0`. **Eyes:** large amber `#E8960C` with white highlight.
- **Signature features (never remove):** fluffy tail with a **glowing
  star-shaped tip**; tiny explorer's **satchel** across the chest.
- **Personality in pose:** curious, encouraging, mid-adventure. Default pose:
  waving hello. Celebration: mid-hop, arms up.
- **Expression set needed (Rive states):** hello, happy, celebrating,
  thinking, encouraging (wrong answer — soft, never sad), sleeping (splash).
- **Per-band rule:** Milo's *design* does not change between bands — his
  *dialogue and TTS* do (see SCREEN_FLOW.md). A 14-year-old gets the same
  fox, framed by a cinematic UI. Consistency builds attachment.
- **Voice pairing:** cartoon-style TTS, pitch 1.7 / rate 1.05, brightest
  childlike system voice, occasional giggle on correct answers (approved
  2026-09-30).

## 3. Color palette

### Core brand (all bands)
| Token | Hex | Use |
|---|---|---|
| Brand Purple | `#7C5CFF` | primary brand, Legend UI |
| Brand Pink | `#F45BD8` | gradients, Explorer accents |
| Starlight Gold | `#FFC93C` | XP, coins, stars, rewards |
| Deep Space | `#141433` | dark surfaces, logo bg |
| Cloud | `#FFF9F0` | light surfaces |

### Band themes
**🌱 Explorer (5–7) — "Sunny Meadow"**
- bg gradient `#FFF6DE → #FFE9F2`; surface `#FFFFFF`
- primary `#FF6B9D` (darker edge `#E14E82`); accent gold; success `#5BCB6A`
- text `#4A2C5A`, text-soft `#8A6D9B`

**⚡ Adventurer (8–11) — "Quest Blue"**
- bg gradient `#16294D → #2B5CB8`; surface `#FFFFFF` / dark card `#1E3A6E`
- primary `#38BDF8`; accent gold; success `#4ADE80`
- text on dark `#F0F7FF`; text on light `#1E2A52`

**🔥 Legend (12–15) — "Neon Night"**
- bg gradient `#0B0B1E → #191938`; surface `#1E1E3C`
- primary neon purple `#8B7CFF`; accent neon cyan `#00E5FF`; gold `#FFC93C`
- text `#EDEDF7`; text-dim `#9A9AC0`

Contrast: body text must hit WCAG AA (4.5:1) in every band — light text on
dark bands, dark plum on Sunny Meadow.

## 4. Fonts (all Google Fonts — Flutter `google_fonts` ready)

| Band | Display (headings, buttons) | Body/UI |
|---|---|---|
| Explorer | **Baloo 2** 700/800 — chunky, rounded | **Nunito** 400/700 |
| Adventurer | **Nunito** 800/900 — friendly, geometric | **Nunito** 400/700 |
| Legend | **Orbitron** 700 — cinematic, techy (titles ONLY) | **Rajdhani** 500/600/700 |

Rules: Orbitron never for paragraphs (readability). Minimum body size 16sp
Explorer / 15sp Adventurer / 14sp Legend. Milo speech bubbles always use the
band's body font.

## 5. Buttons

**Explorer — "toy buttons"**
- min-height 64px, font 20px Baloo 2 800, radius 28px
- gradient `#FF7EB3 → #FF5C8A`, 4px darker bottom edge (`#E14E82`) = chunky 3D
- press: translateY(2px), bottom edge shrinks — feels like a real toy

**Adventurer — "game buttons"**
- min-height 56px, font 18px Nunito 800, radius 16px
- gradient `#38BDF8 → #2563EB`, soft outer glow
- press: scale 0.97 + glow pulse

**Legend — "neon console"**
- min-height 52px, font 15px Orbitron 700, UPPERCASE, letter-spacing 2px
- transparent fill, 2px neon border `#8B7CFF`, outer glow
- press: fills with `#8B7CFF`, text goes dark

All bands: disabled = 40% opacity, no interaction. Destructive (delete data)
= red `#E5484D` in every band.

## 6. Icons

- Style: rounded line icons (Lucide/outline family), never filled glyphs for
  actions.
- Stroke weight: **3px** Explorer (chunky), **2.5px** Adventurer, **2px** Legend
  (precise).
- Corner radius of icon containers matches band card radius.
- HUD icons (level, coins, XP): Starlight Gold, consistent across bands.

## 7. Cards

- **Explorer:** radius 24px, white, thick soft shadow, 3px colored top-edge
  per world (Nebula blue, Storywood green).
- **Adventurer:** radius 16px, white or dark `#1E3A6E`, 1px border
  `rgba(255,255,255,.15)` on dark, clean shadow.
- **Legend:** radius 12px, surface `#1E1E3C`, 1px border `#8B7CFF55`; featured
  cards get full neon edge + glow.
- **Milo speech bubble:** tail points to Milo; band body font; TTS
  tap-target on the bubble for Legend (speaker icon).

## 8. Age-specific UI styles (the re-skin moment)

This is the Age Path screen's "whoa" — selecting a card re-themes live.

| | 🌱 Explorer 5–7 | ⚡ Adventurer 8–11 | 🔥 Legend 12–15 |
|---|---|---|---|
| Feel | playful, chunky toy | game-like adventure | cinematic mission console |
| Touch targets | ≥64px, big gaps | ≥56px | ≥52px, denser layout OK |
| Motion | squash & stretch, bouncy (spring curves) | snappy slides, card flips | quick fades, glow pulses, letterbox bars on cinematics |
| Praise style | "AMAZING! ⭐" + giggle | "Nice!" / "Combo x3" | "MISSION COMPLETE — +250 XP" |
| Milo presence | large, always visible, TTS on | medium, TTS on | compact corner avatar, TTS off (tap to hear) |
| Backgrounds | sunny gradients, floating soft shapes | world art, parallax map | dark gradients, neon grid, vignette |

## 9. Wonderling creature style guide

- **Base recipe:** soft 3D, rounded volumes, **big expressive eyes with white
  highlight**, elemental motif integrated into the body (flame crest, leaf
  ears, water sheen…), no sharp teeth/claws/spikes.
- **Baby proportions (stage 1):** head ≈ 45% of height — maximum cute.
- **Evolution language:** stage 2 = sleeker, more elemental features;
  stage 3 = majestic, glowing accents, name in ALL CAPS. Same silhouette
  family — always recognizable as the same creature.
- **Color scripts (locked):** Pyro orange-red `#E8590C/#FF6B35`; Sylva leaf
  green `#51CF66/#2F9E44`; Bubbles water blue `#339AF0/#1971C2`; Pebbles warm
  gray `#ADB5BD` + moss `#69DB7C`; Sparkle gold `#FFD43B` with glow.
- **Animation (Rive):** idle bob + blink loop; happy bounce; celebrate spin;
  sleep for unhatched egg (wiggle on tap). Evolutions get a 2s glow-up
  cinematic.
- **Egg:** speckled, band-tinted (Nebula blue speckle, Storywood green),
  3-tap hatch: wiggle → crack → burst.

## 10. Motion quick-ref

- UI transitions 150–300ms; **the child's tap causes the animation.**
- Correct answer: button squish → green → +10 XP floats up → confetti burst
  (<1.5s) → next round.
- Wrong answer: gentle shake, soft "boop" — never red flash, never scary.
- World restored: 3s cinematic (icon glow, confetti, fanfare) → Continue.
- Egg hatch: tap → wiggle → crack → 💥 + creature pop (scale bounce).

## 11. Build handoff notes (Flutter)

- **Rive:** Milo + all Wonderlings (state machines: idle/happy/celebrate/
  encourage/sleep). Interactive characters per the plan's stack.
- **Lottie:** confetti, XP floats, glow pulses, screen transitions — light
  effects only.
- **Fonts:** `google_fonts` package (Baloo 2, Nunito, Orbitron, Rajdhani).
- **Theming:** one `ThemeExtension` per band; Age Path switches at runtime.
- **Assets:** SVG icons (stroke widths per band), WebP character art,
  logo variants.
- Prototype CSS variables (`style.css`) already mirror the three band themes
  — port, don't reinvent.
