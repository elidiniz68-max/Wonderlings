// ============================================================
// WONDERLINGS prototype v1 — "The First Playable Experience"
// A story-driven adventure: pick an age band, meet Milo, restart
// the Number Nebula reactor, earn a mystery egg, hatch Pyro!
// ============================================================

// ---------- tiny helpers ----------
function $(id) { return document.getElementById(id); }
function rnd(n) { return Math.floor(Math.random() * n); } // 0..n-1
function pick(arr) { return arr[rnd(arr.length)]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// Screens: hide them all, then show one. The .active class + CSS
// animation does the slide-in — no animation libraries needed!
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

// ---------- save data (lives in the browser between visits) ----------
const SAVE_KEY = "wonderlings-save-v1";
function freshSave() {
  return { name: "", band: "explorer", avatar: "🦊", xp: 0, coins: 0,
           pets: [], reactorOn: false, storyOn: false };
}
function loadSave() {
  try {
    const s = localStorage.getItem(SAVE_KEY);
    return s ? JSON.parse(s) : null;
  } catch (e) { return null; }
}
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {}
}
let save = loadSave() || freshSave();

// ---------- the three age bands ----------
// Same universe, different maturity: the band changes difficulty,
// Milo's dialogue tone, AND the whole visual theme (see selectBand).
const BANDS = {
  explorer:   { icon: "🌱", label: "Explorer",   ages: "5–7" },
  adventurer: { icon: "⚡", label: "Adventurer", ages: "8–11" },
  legend:     { icon: "🔥", label: "Legend",     ages: "12–15" },
};

// ---------- the worlds of the Wonderverse ----------
// Each world brings its Knowledge Core, its rescue flag in the save,
// its cinematic moment, its Milo quips and praise, its question
// generator, and the Wonderling egg waiting at the end.
// (gen functions are defined further down — they're only CALLED
// at mission time, long after everything exists.)
const WORLDS = {
  nebula: {
    key: "nebula", name: "Number Nebula", icon: "🔢", core: "Logic",
    flag: "reactorOn",
    statusOnline: "⚡ reactor online!", statusNeeds: "🚨 needs help!",
    cinematicIcon: "⚡", cinematicText: "⚡ REACTOR ONLINE! ⚡",
    speakDone: "Reactor online! Amazing work!",
    alreadyDone: "The reactor is humming along nicely!",
    pet: "pyro",
    powerLabel: "⚡ REACTOR POWER",
    gen: (band) => genQuestion(band),
    quips: {
      explorer: ["Count them! 👽", "You can do it! ⭐", "Board the ship! 🚀"],
      adventurer: ["Reroute the power! ⚡", "The reactor is waiting…", "Nice and steady."],
      legend: ["Solve it.", "Reactor efficiency dropping.", "Focus."],
    },
    praise: {
      explorer: ["You got it! ⭐", "Amazing! 🎉"],
      adventurer: ["Correct. Power rerouted! ⚡", "Nice work!"],
      legend: ["Correct.", "Efficiency rising."],
    },
    combo: {
      explorer: ["Two in a row! 🔥", "Three! You're on fire! 🚀"],
      adventurer: ["Combo ×2! ⚡", "Combo ×3 — reactor surging!"],
      legend: ["Streak: 2.", "Streak: 3. Optimal."],
    },
  },
  storywood: {
    key: "storywood", name: "Storywood", icon: "📚", core: "Language",
    flag: "storyOn",
    statusOnline: "🌳 tree blooming!", statusNeeds: "🍂 leaves fading!",
    cinematicIcon: "🌳", cinematicText: "🌳 THE STORY TREE BLOOMS! 🌳",
    speakDone: "The Story Tree blooms again! Wonderful!",
    alreadyDone: "The Story Tree's leaves are shining bright!",
    pet: "sylva",
    powerLabel: "🌳 STORY ENERGY",
    gen: (band) => genReadingQuestion(band),
    quips: {
      explorer: ["Read it! 📖", "You can do it! ⭐", "Turn the page! 📚"],
      adventurer: ["The story awaits…", "Words have power.", "Keep reading."],
      legend: ["Decipher it.", "The text holds answers.", "Focus."],
    },
    praise: {
      explorer: ["You got it! ⭐", "Wonderful! 📖"],
      adventurer: ["Correct. The story grows! 📚", "Well read!"],
      legend: ["Correct.", "Insight logged."],
    },
    combo: {
      explorer: ["Two in a row! 📖✨", "Three! The tree is glowing! 🌳"],
      adventurer: ["Combo ×2! 📚", "Combo ×3 — the tale unfolds!"],
      legend: ["Streak: 2.", "Streak: 3. Optimal."],
    },
  },
};

// ---------- Milo's voice: playful cartoon, easy on the ears ----------
// Honest tech note: a browser can't literally BE SpongeBob — his voice
// belongs to a voice actor, and cloning it needs a paid AI voice service.
// So Milo gets a playful pitch with a calm pace, the brightest voice on
// the device, plus a goofy giggle!
let miloVoice = null;
function pickMiloVoice() {
  try {
    const voices = speechSynthesis.getVoices();
    miloVoice =
      voices.find((v) => /child|kid|junior|boy|girl/i.test(v.name)) ||
      voices.find((v) => /female|samantha|zira|aria|jenny|victoria/i.test(v.name)) ||
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("en")) ||
      voices[0] || null;
  } catch (e) { miloVoice = null; }
}
pickMiloVoice();
try {
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = pickMiloVoice; // voices load late on Safari!
  }
} catch (e) {}
function speak(text) {
  if (!soundOn) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (miloVoice) u.voice = miloVoice;
    u.rate = 1.05; // a touch of cartoon pep, not a chipmunk chase
    u.pitch = 1.7;  // playful and bright, without the full squeak
    speechSynthesis.speak(u);
  } catch (e) {}
}

// ---------- sound: tiny synthesized effects, no audio files ----------
let soundOn = true;
try { soundOn = localStorage.getItem("wonder-sound") !== "off"; } catch (e) {}
function toggleSound() {
  soundOn = !soundOn;
  try { localStorage.setItem("wonder-sound", soundOn ? "on" : "off"); } catch (e) {}
  ["soundBtn", "soundBtn2"].forEach((id) => {
    const b = $(id);
    if (b) b.textContent = soundOn ? "🔊 Sound: on" : "🔇 Sound: off";
  });
  if (!soundOn) { try { speechSynthesis.cancel(); } catch (e) {} }
}
function tone(freq, delay, dur) {
  if (!soundOn) return;
  try {
    const ctx = tone.ctx || (tone.ctx = new (window.AudioContext || window.webkitAudioContext)());
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = freq;
    o.type = "sine";
    g.gain.setValueAtTime(0.001, ctx.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + delay + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(ctx.currentTime + delay);
    o.stop(ctx.currentTime + delay + dur + 0.05);
  } catch (e) {}
}
function playChime(level) {
  // the chime climbs in pitch as your streak grows — progress you can HEAR
  const lift = (level || 0) * 60;
  tone(660 + lift, 0, 0.15); tone(880 + lift, 0.12, 0.25);
}
function playTap() { tone(500, 0, 0.08); }
function playFanfare() { tone(523, 0, 0.15); tone(659, 0.15, 0.15); tone(784, 0.3, 0.3); }
// Milo's cartoon giggle — a quick ascending "he-he-he!" built from blips.
// Pure silliness, zero voice actors required.
function playGiggle() {
  const notes = [700, 900, 1150, 950, 1350];
  notes.forEach((f, i) => tone(f, i * 0.09, 0.08));
}

// ---------- confetti: the universal celebration ----------
function confetti(n) {
  for (let i = 0; i < n; i++) {
    const d = document.createElement("div");
    d.className = "confetti";
    d.textContent = pick(["⭐", "✨", "🎉", "💥", "🔥", "⚡"]);
    d.style.left = Math.random() * 100 + "vw";
    d.style.animationDuration = 2 + Math.random() * 2 + "s";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 4500);
  }
}

// ---------- XP, levels, coins ----------
function levelFor(xp) { return 1 + Math.floor(xp / 250); } // 250 XP per level
function addXP(n) { save.xp += n; persist(); renderHUD(); }
function addCoins(n) { save.coins += n; persist(); renderHUD(); }
function renderHUD() {
  const lvl = levelFor(save.xp);
  ["hudLevel", "hudLevel2"].forEach((id) => { const e = $(id); if (e) e.textContent = "LV " + lvl; });
  ["hudCoins", "hudCoins2"].forEach((id) => { const e = $(id); if (e) e.textContent = "🪙 " + save.coins; });
  const pct = ((save.xp % 250) / 250) * 100 + "%";
  ["xpfill", "xpfill2"].forEach((id) => { const e = $(id); if (e) e.style.width = pct; });
  const av = $("hudAvatar");
  if (av) av.textContent = save.avatar;
}

// ---------- profile: name + age band + avatar ----------
function selectBand(b) {
  save.band = b;
  ["explorer", "adventurer", "legend"].forEach((x) =>
    $("band-" + x).classList.toggle("selected", x === b));
  // One line re-skins the ENTIRE universe — CSS variables do the work!
  document.body.className = "band-" + b;
  playTap();
  speak(BANDS[b].label + " path chosen!");
}
function selectAvatar(a, el) {
  save.avatar = a;
  document.querySelectorAll(".avatar").forEach((x) => x.classList.remove("selected"));
  el.classList.add("selected");
  playTap();
}
function beginAdventure() {
  save.name = $("nameInput").value.trim() || "Explorer";
  persist();
  document.body.className = "band-" + save.band;
  buildStory();
  showScreen("scr-story");
}
function onTitle() {
  document.body.className = "band-" + save.band;
  if (save.name) { renderHome(); showScreen("scr-home"); } // returning explorer!
  else showScreen("scr-profile");
}

// ---------- the story: Milo introduces the Fade ----------
let story = [];
let storyIdx = 0;
function miloLine(key) {
  const n = save.name || "Explorer";
  const lines = {
    intro: {
      explorer: `There you are! I've been looking EVERYWHERE for you, ${n}! ⭐`,
      adventurer: `There you are, ${n}. I've been looking everywhere for you — we don't have much time.`,
      legend: `${n}. There you are. I've been tracking your signal.`,
    },
    cores: {
      explorer: "Long ago, SIX Knowledge Cores powered our universe! Numbers, words, science, art, computers, and life! 🌈",
      adventurer: "Long ago, six Knowledge Cores powered the Wonderverse: Logic, Language, Discovery, Imagination, Technology, and Life.",
      legend: "The Wonderverse ran on six Knowledge Cores: Logic. Language. Discovery. Imagination. Technology. Life.",
    },
    fade: {
      explorer: "But something spooky called the FADE is draining them! Worlds are losing their colors… 😟",
      adventurer: "Something called the Fade is draining them. Worlds are losing color, machines are shutting down — and Wonderlings are losing their abilities.",
      legend: "An entity designated the Fade is draining them. Color loss, system failures, Wonderling ability decay. Cause: unknown.",
    },
    alarm: {
      explorer: "🚨 OH NO! Number Nebula is losing power — AND the Story Tree's leaves are fading! Two worlds need our help! 😟",
      adventurer: "🚨 Two alerts: Number Nebula's reactor is failing, and Storywood's Story Tree is losing its leaves.",
      legend: "🚨 Two anomalies detected: Number Nebula reactor failure. Storywood narrative cohesion decaying.",
    },
    brief: {
      explorer: "Pick a world on the map! Solve 5 challenges to bring it back to life! 🚀",
      adventurer: "Choose a world on the map. Complete its 5 challenges to restore it.",
      legend: "Select a world. Complete 5 challenges. Restore it.",
    },
  };
  return lines[key][save.band];
}
function buildStory() {
  story = ["intro", "cores", "fade", "alarm", "brief"].map(miloLine);
  storyIdx = 0;
  renderStory();
}
function renderStory() {
  $("storySpeech").textContent = story[storyIdx];
  speak(story[storyIdx]);
}
function nextStory() {
  playTap();
  storyIdx++;
  if (storyIdx >= story.length) { renderMap(); showScreen("scr-map"); return; }
  renderStory();
}

// ---------- world map ----------
function renderMap() {
  renderHUD();
  $("nebulaStatus").textContent = save.reactorOn ? WORLDS.nebula.statusOnline : WORLDS.nebula.statusNeeds;
  $("storyStatus").textContent = save.storyOn ? WORLDS.storywood.statusOnline : WORLDS.storywood.statusNeeds;
}
function enterWorld(w) {
  const W = WORLDS[w];
  if (!W) return; // locked worlds — the Fade still holds them!
  if (save[W.flag]) { speak(W.alreadyDone); return; }
  startMission(w);
}

// ---------- mission: 5 adaptive math challenges ----------
// The SAME mission, three difficulties — this is the "secret sauce":
// a 6-year-old and a 14-year-old visit the same universe, but the
// challenges change dramatically.
// unique numeric decoys near the answer (never equal to it, always in range)
function pickDecoys(ans, lo, hi, n) {
  const pool = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10, ans + 3, ans - 3]
    .filter((v) => v >= lo && v <= hi && v !== ans);
  const picks = [];
  for (const v of pool) {
    if (picks.length >= n) break;
    if (!picks.includes(v)) picks.push(v);
  }
  let f = lo;
  while (picks.length < n && f <= hi) {
    if (f !== ans && !picks.includes(f)) picks.push(f);
    f++;
  }
  return picks;
}
function makeChoices(ans, lo, hi) {
  return shuffle([ans, ...pickDecoys(ans, lo, hi, 2)]);
}
// wipe a container in real AND fake DOMs (fake innerHTML doesn't clear kids)
function clearEl(e) {
  e.innerHTML = "";
  if (e._kids) e._kids.length = 0;
}
function genQuestion(band) {
  if (band === "explorer") {
    // ALIEN BOARDING (M1): real counting gameplay, not a written equation.
    // The aliens float in the sky — count them, tap the total.
    const a = 1 + rnd(5), b = 1 + rnd(5);
    if (Math.random() < 0.5) {
      const ans = a + b;
      return {
        game: "alien",
        prompt: "How many aliens board the ship? 🚀",
        spoken: "Count the aliens. How many board the ship?",
        answer: ans, choices: makeChoices(ans, 0, 12),
        visual: { emoji: "👽", count: ans },
      };
    }
    const x = Math.max(a, b), y = Math.min(a, b), ans = x - y;
    return {
      game: "alien",
      prompt: "Some wave goodbye… 👋<br><small>How many aliens are left?</small>",
      spoken: x + " aliens. " + y + " wave goodbye. How many are left?",
      answer: ans, choices: makeChoices(ans, 0, 10),
      visual: { emoji: "👽", count: x, leaving: y },
    };
  }
  if (band === "adventurer") {
    // POWER GRID (M2): the grid is dark — tap the node that routes the power.
    const r = Math.random();
    if (r < 0.45) {
      const a = 2 + rnd(8), b = 2 + rnd(8), ans = a * b;
      return {
        game: "grid",
        prompt: a + " × " + b + " = ?<br><small>Tap the node to route power! ⚡</small>",
        spoken: a + " times " + b + ". Tap the node with the answer.",
        answer: ans, choices: shuffle([ans, ...pickDecoys(ans, 4, 81, 3)]),
      };
    }
    if (r < 0.75) {
      const a = 2 + rnd(8), b = 2 + rnd(9), ans = b;
      return {
        game: "grid",
        prompt: a + " × ? = " + a * b + "<br><small>Which number is missing? ⚡</small>",
        spoken: a + " times what equals " + a * b + "? Tap the missing number.",
        answer: ans, choices: shuffle([ans, ...pickDecoys(ans, 2, 12, 3)]),
      };
    }
    const FRACS = ["½", "⅓", "¼", "¾", "⅕", "⅔"];
    const f = pick(FRACS);
    const decoys = shuffle(FRACS.filter((v) => v !== f)).slice(0, 3);
    return {
      game: "grid",
      prompt: "Which node shows <b>" + f + "</b>? 🥧<br><small>Route the power!</small>",
      spoken: "Which node shows " + f + "?",
      answer: f, choices: shuffle([f, ...decoys]),
    };
  }
  // REACTOR CORE (M3): algebra as DOING — pick the first move, then solve.
  const t = Math.random();
  let m, c, x, undo;
  if (t < 0.4) {            // one-step: x + c = y
    m = 1; x = 2 + rnd(10); c = 1 + rnd(15); undo = c;
  } else if (t < 0.75) {    // two-step: mx + c = y
    m = 2 + rnd(7); x = 2 + rnd(8); c = 1 + rnd(20); undo = c;
  } else {                  // integers: -mx + c = y
    m = -(2 + rnd(3)); x = 2 + rnd(6); c = 1 + rnd(15); undo = c;
  }
  const y = m * x + c;
  const mStr = m === 1 ? "x" : m + "x";
  const move = "−" + undo + " both sides";
  const moves = shuffle([move, "+" + undo + " both sides", "÷" + Math.abs(m === 1 ? 2 : m) + " both sides"]);
  return {
    game: "reactor",
    prompt: mStr + " + " + c + " = " + y + "<br><small>Stabilize the core!</small>",
    spoken: "Solve: " + (m === 1 ? "x" : m + " x") + " plus " + c + " equals " + y + ". What is x?",
    move: move, moves: moves,
    hint: "To free x, undo the +" + undo + " first.",
    simplified: (m === 1 ? "x" : m + "x") + " = " + (y - c),
    answer: x, choices: makeChoices(x, 1, 25),
  };
}

// ---------- Storywood: 5 adaptive READING challenges ----------
// Same mission shape as Number Nebula, but the Knowledge Core is
// Language: letters and rhymes for explorers, word power for
// adventurers, real literary skills for legends.
const READING_POOLS = {
  explorer: [
    { prompt: "Which letter comes <b>after B</b>?<br><small>Sing the ABC song in your head! 🎵</small>",
      spoken: "Which letter comes after B?", answer: "C", choices: ["C", "A", "D"], icons: ["✏️", "✏️", "✏️"] },
    { prompt: "Which flower <b>rhymes</b> with CAT? 🐱<br><small>Rhymes sound the same at the end!</small>",
      spoken: "Which word rhymes with cat?", answer: "HAT", choices: ["HAT", "DOG", "BUS"], icons: ["🎩", "🐶", "🚌"] },
    { prompt: "Which word names this animal? 🐶",
      spoken: "Which word names this animal?", answer: "DOG", choices: ["DOG", "CAT", "PIG"], icons: ["🐶", "🐱", "🐷"] },
    { prompt: "Which word starts with the 'ssss' sound? 🐍",
      spoken: "Which word starts with the sss sound?", answer: "SUN", choices: ["SUN", "MOON", "CAT"], icons: ["☀️", "🌙", "🐱"] },
    { prompt: "Which word means you feel like this? 😊",
      spoken: "Which word means happy?", answer: "HAPPY", choices: ["HAPPY", "SAD", "ANGRY"], icons: ["😊", "😢", "😠"] },
    { prompt: "Which flower <b>rhymes</b> with DOG? 🐶",
      spoken: "Which word rhymes with dog?", answer: "FROG", choices: ["FROG", "CAT", "PIG"], icons: ["🐸", "🐱", "🐷"] },
    { prompt: "Which letter comes <b>before D</b>?",
      spoken: "Which letter comes before D?", answer: "C", choices: ["C", "E", "A"], icons: ["✏️", "✏️", "✏️"] },
    { prompt: "Which word names this color? 🍎",
      spoken: "Which word names this color?", answer: "RED", choices: ["RED", "BLUE", "GREEN"], icons: ["🔴", "🔵", "🟢"] },
  ],
  adventurer: [
    { prompt: "Which word means the <b>SAME</b> as HAPPY?",
      spoken: "Which word means the same as happy?", answer: "JOYFUL", choices: ["JOYFUL", "ANGRY", "TIRED"] },
    { prompt: "Which word means the <b>OPPOSITE</b> of BRAVE?",
      spoken: "Which word means the opposite of brave?", answer: "TIMID", choices: ["TIMID", "BOLD", "STRONG"] },
    { prompt: "“The climber felt <b>EXHAUSTED</b>.”<br>Exhausted means…",
      spoken: "The climber felt exhausted. What does exhausted mean?", answer: "VERY TIRED", choices: ["VERY TIRED", "VERY HUNGRY", "VERY EXCITED"] },
    { prompt: "Milo packed an umbrella, though the sky was clear and blue. <b>Why?</b>",
      spoken: "Milo packed an umbrella though the sky was clear. Why?", answer: "Milo thought it might rain later", choices: ["Milo thought it might rain later", "Milo loves the color blue", "Umbrellas are fun to carry"] },
    { prompt: "Fill in the blank:<br>“I <b>___</b> a strange noise.”",
      spoken: "I blank a strange noise. Which word fits?", answer: "HEARD", choices: ["HEARD", "HERD", "HARD"] },
    { prompt: "Which word means the <b>SAME</b> as QUICK?",
      spoken: "Which word means the same as quick?", answer: "FAST", choices: ["FAST", "SLOW", "LOUD"] },
    { prompt: "Which two small words join to make <b>RAINBOW</b>? 🌈",
      spoken: "Which two small words make rainbow?", answer: "RAIN + BOW", choices: ["RAIN + BOW", "BOW + RAIN", "RAIN + CLOUD"] },
    { prompt: "Yesterday, Milo <b>___</b> to the Story Tree.",
      spoken: "Yesterday, Milo blank to the Story Tree.", answer: "WALKED", choices: ["WALKED", "WALK", "WALKS"] },
  ],
  legend: [
    { prompt: "“The classroom was a <b>ZOO</b>.”<br>This comparison is a…",
      spoken: "The classroom was a zoo. What literary device is this?", answer: "METAPHOR", choices: ["METAPHOR", "SIMILE", "HYPERBOLE"] },
    { prompt: "The new phone was <b>UBIQUITOUS</b> — everyone had one.<br>Ubiquitous means…",
      spoken: "What does ubiquitous mean?", answer: "FOUND EVERYWHERE", choices: ["FOUND EVERYWHERE", "VERY EXPENSIVE", "HARD TO USE"] },
    { prompt: "The lights flickered. The wind howled. Milo grabbed a flashlight.<br><b>What can you infer?</b> 🔍",
      spoken: "What can you infer from the passage?", answer: "A storm is coming", choices: ["A storm is coming", "It is a sunny morning", "Milo is cooking dinner"],
      lines: ["The lights flickered.", "The wind howled.", "Milo grabbed a flashlight."], evidence: 1 },
    { prompt: "Cake crumbs led to Milo's room. Milo was asleep — but his whiskers had frosting.<br><b>What can you infer?</b> 🔍",
      spoken: "What can you infer from the passage?", answer: "Milo ate the cake", choices: ["Milo ate the cake", "Milo baked the cake", "Milo hates cake"],
      lines: ["Cake crumbs led to Milo's room.", "Milo was asleep.", "His whiskers had frosting."], evidence: 2 },
    { prompt: "The streets were empty. The shops were shuttered. A single lantern swayed in the wind.<br><b>What can you infer?</b> 🔍",
      spoken: "What can you infer from the passage?", answer: "It is very late at night", choices: ["It is very late at night", "It is a busy morning", "It is lunch time"],
      lines: ["The streets were empty.", "The shops were shuttered.", "A single lantern swayed in the wind."], evidence: 0 },
    { prompt: "“The gray fog swallowed the empty street.”<br>The <b>MOOD</b> is…",
      spoken: "What is the mood of the sentence?", answer: "EERIE", choices: ["EERIE", "CHEERFUL", "SILLY"] },
    { prompt: "In <b>CHRONOLOGY</b>, the root “chron” refers to…",
      spoken: "In chronology, what does chron mean?", answer: "TIME", choices: ["TIME", "COLOR", "SOUND"] },
    { prompt: "“She ran <b>LIKE</b> the wind.”<br>The word LIKE makes this a…",
      spoken: "She ran like the wind. What device is this?", answer: "SIMILE", choices: ["SIMILE", "METAPHOR", "PERSONIFICATION"] },
    { prompt: "Milo felt <b>RELUCTANT</b> to leave the Story Tree.<br>Reluctant means…",
      spoken: "What does reluctant mean?", answer: "UNWILLING", choices: ["UNWILLING", "EAGER", "CURIOUS"] },
    { prompt: "A poster shouts: “Vote for Milo — the honest choice!”<br>Its purpose is to…",
      spoken: "What is the poster's purpose?", answer: "PERSUADE", choices: ["PERSUADE", "INFORM", "ENTERTAIN"] },
  ],
};
const BAND_GAMES = { explorer: "grove", adventurer: "bridge", legend: "detective" };
function genReadingQuestion(band) {
  const q = pick(READING_POOLS[band]);
  const order = shuffle([0, 1, 2]); // icons stay glued to their words
  const out = {
    game: BAND_GAMES[band],
    prompt: q.prompt, spoken: q.spoken, answer: q.answer,
    choices: order.map((i) => q.choices[i]),
  };
  if (q.icons) out.icons = order.map((i) => q.icons[i]);
  if (q.lines) { out.lines = q.lines; out.evidence = q.evidence; }
  return out;
}
let mission = null;
function startMission(world) {
  mission = { i: 0, correct: 0, streak: 0, locked: false, world: world || "nebula" };
  renderQuestion();
  showScreen("scr-mission");
}
function renderQuestion() {
  const W = WORLDS[mission.world];
  const q = W.gen(save.band);
  mission.q = q;
  $("qProgress").textContent = "Challenge " + (mission.i + 1) + " of 5";
  // the arc: every round visibly charges the world back to life
  $("powerLabel").textContent = W.powerLabel;
  $("powerFill").style.width = (mission.i * 20) + "%";
  $("missionSpeech").textContent = pick(W.quips[save.band]);
  clearEl($("alienSky"));
  clearEl($("choices"));
  $("choices").classList.remove("node-grid");
  $("hearBtn").style.display = "none";
  // v5: each mini-game renders its own playground
  if (q.game === "grid") return renderGrid(q);
  if (q.game === "reactor") return renderReactorMove(q);
  if (q.game === "grove") return renderGrove(q);
  if (q.game === "bridge") return renderBridge(q);
  if (q.game === "detective") return renderDetective(q);
  return renderAlien(q);
}
function renderAlien(q) {
  // Alien Boarding sky: floating aliens to COUNT (explorer gameplay)
  const sky = $("alienSky");
  if (q.visual) {
    for (let n = 0; n < q.visual.count; n++) {
      const s = document.createElement("span");
      s.textContent = q.visual.emoji;
      s.style.animationDelay = (n * 0.18) + "s";
      if (q.visual.leaving && n >= q.visual.count - q.visual.leaving) {
        s.classList.add("leaving"); // waving goodbye — dimmed
      }
      sky.appendChild(s);
    }
  }
  $("qPrompt").innerHTML = q.prompt;
  const box = $("choices");
  q.choices.forEach((c) => {
    const b = document.createElement("button");
    b.classList.add("choice");
    b.textContent = c;
    b._choice = c;
    b.onclick = () => answerMission(c, b);
    box.appendChild(b);
  });
  speak(q.spoken);
}
// ---------- M2 Power Grid: tap the node that routes the power ----------
function renderGrid(q) {
  $("qPrompt").innerHTML = q.prompt;
  const box = $("choices");
  box.classList.add("node-grid");
  q.choices.forEach((c) => {
    const b = document.createElement("button");
    b.classList.add("choice");
    b.classList.add("node");
    b.textContent = c;
    b._choice = c;
    b.onclick = () => answerMission(c, b); // correct node → beam fires (CSS ignite)
    box.appendChild(b);
  });
  speak(q.spoken);
}
// ---------- M3 Reactor Core: pick the FIRST move, then solve ----------
function renderReactorMove(q) {
  $("qPrompt").innerHTML = q.prompt + "<br><small>🔧 Step 1: what's the FIRST move?</small>";
  const box = $("choices");
  q.moves.forEach((mv) => {
    const b = document.createElement("button");
    b.classList.add("choice");
    b.classList.add("move-btn");
    b.textContent = mv;
    b._choice = mv;
    b.onclick = () => answerMove(mv, b);
    box.appendChild(b);
  });
  speak(q.spoken + " What's the first move?");
}
function answerMove(choice, btn) {
  const q = mission.q;
  if (choice === q.move) {
    btn.classList.add("correct");
    playChime(1);
    speak("Good move! Now solve it.");
    $("qPrompt").innerHTML = q.simplified + "<br><small>Step 2: x = ?</small>";
    const box = $("choices");
    clearEl(box);
    q.choices.forEach((c) => {
      const b = document.createElement("button");
      b.classList.add("choice");
      b.textContent = c;
      b._choice = c;
      b.onclick = () => answerMission(c, b);
      box.appendChild(b);
    });
  } else {
    btn.classList.add("wrong");
    playTap();
    speak(q.hint); // wrong move → hint + retry: a learning moment, not a fail
  }
}
// ---------- R1 Rhyme Grove: TTS-first, tap the flower ----------
function renderGrove(q) {
  $("qPrompt").innerHTML = q.prompt;
  $("hearBtn").style.display = "";
  const box = $("choices");
  q.choices.forEach((c, i) => {
    const b = document.createElement("button");
    b.classList.add("choice");
    b.classList.add("grove-card");
    b.innerHTML = '<span class="gicon">' + (q.icons ? q.icons[i] : "🌸") + "</span>" + c;
    b._choice = c;
    b.onclick = () => answerMission(c, b);
    box.appendChild(b);
  });
  speak(q.spoken);
}
function hearPrompt() {
  if (mission && mission.q) { playTap(); speak(mission.q.spoken); }
}
// ---------- R2 Word Bridge: every correct word lays a plank ----------
function renderBridge(q) {
  let planks = "";
  for (let n = 0; n < 5; n++) planks += n < mission.i ? "🟫" : "⬜";
  $("alienSky").innerHTML = '<div class="bridge">🌉<br>' + planks +
    '</div><small>Plank ' + (mission.i + 1) + " of 5</small>";
  $("qPrompt").innerHTML = q.prompt;
  const box = $("choices");
  q.choices.forEach((c) => {
    const b = document.createElement("button");
    b.classList.add("choice");
    b.textContent = c;
    b._choice = c;
    b.onclick = () => answerMission(c, b);
    box.appendChild(b);
  });
  speak(q.spoken);
}
// ---------- R3 Tale Detective: answer, then tap the proof ----------
function renderDetective(q) {
  $("qPrompt").innerHTML = q.prompt;
  const box = $("choices");
  q.choices.forEach((c) => {
    const b = document.createElement("button");
    b.classList.add("choice");
    b.textContent = c;
    b._choice = c;
    b.onclick = () => (q.evidence == null ? answerMission(c, b) : answerDetective(c, b));
    box.appendChild(b);
  });
  speak(q.spoken);
}
function answerDetective(choice, btn) {
  const q = mission.q;
  if (choice !== q.answer) {
    mission.locked = true;
    wrongAnswer(btn, "Almost! Re-read the case file…");
    advanceAfter(1400);
    return;
  }
  btn.classList.add("correct");
  playChime(1);
  speak("Good deduction! Now prove it — tap the line that shows it. 🔍");
  const pr = $("qPrompt");
  clearEl(pr);
  const dos = document.createElement("div");
  dos.classList.add("dossier");
  const title = document.createElement("div");
  title.innerHTML = "<b>🔍 CASE FILE</b><br><small>Tap the line that proves it!</small>";
  dos.appendChild(title);
  q.lines.forEach((ln, i) => {
    const d = document.createElement("div");
    d.classList.add("ev-line");
    d.textContent = "“" + ln + "”";
    d.onclick = () => tapEvidence(i, d);
    dos.appendChild(d);
  });
  pr.appendChild(dos);
}
function tapEvidence(i, lineEl) {
  if (mission.locked) return;
  const q = mission.q;
  if (i === q.evidence) {
    mission.locked = true;
    correctAnswer(lineEl, "CASE CLOSED! 🔍");
    advanceAfter(1400);
  } else {
    lineEl.classList.add("wrong");
    playTap();
    speak("Not that line — what is it really saying?"); // retry allowed
  }
}
function correctAnswer(btn, praiseOverride) {
  const W = WORLDS[mission.world];
  btn.classList.add("correct");
  mission.correct++;
  mission.streak++;
  addXP(10);
  confetti(12); // correct → particles → reaction (the animation language!)
  playChime(mission.streak); // the chime climbs as your streak grows
  if (Math.random() < 0.5) playGiggle(); // cartoon giggle, sometimes — a treat, not noise
  // combo praise for streaks, regular praise otherwise
  speak(praiseOverride || (mission.streak >= 2 ? pick(W.combo[save.band]) : pick(W.praise[save.band])));
  // power SURGE: the meter jumps NOW, with a pulse
  const pf = $("powerFill");
  pf.style.width = ((mission.i + 1) * 20) + "%";
  pf.classList.remove("surge");
  void pf.offsetWidth;
  pf.classList.add("surge");
}
function wrongAnswer(btn, line) {
  btn.classList.add("wrong"); // gentle shake — never a scary buzzer
  mission.streak = 0; // streaks reset, XP never goes down
  playTap();
  speak(line || "Almost! Try the next one!");
}
function advanceAfter(ms) {
  setTimeout(() => {
    mission.i++;
    mission.locked = false;
    if (mission.i >= 5) return finishMission();
    renderQuestion();
  }, ms || 1400);
}
function answerMission(choice, btn) {
  if (mission.locked) return; // one tap per question — no double answers!
  mission.locked = true;
  if (choice === mission.q.answer) correctAnswer(btn);
  else wrongAnswer(btn);
  advanceAfter(1400);
}
function finishMission() {
  const W = WORLDS[mission.world];
  addXP(200); // mission bonus: 10 per correct answer + 200 here
  addCoins(100);
  save[W.flag] = true;
  lastPet = W.pet; // the egg waiting on the rewards screen
  persist();
  $("cinematicIcon").textContent = W.cinematicIcon;
  $("reactorText").textContent = W.cinematicText;
  showScreen("scr-reactor");
  confetti(60);
  playFanfare();
  speak(W.speakDone);
}
function showRewards() {
  renderHUD();
  // honest numbers: the XP card shows what was ACTUALLY earned
  // (10 per correct answer + 200 mission bonus), never a hardcoded promise
  const xp = mission ? mission.correct * 10 + 200 : 250;
  $("rewardXP").textContent = "+" + xp + " XP";
  $("rewardCoins").textContent = "+100 WonderCoins";
  showScreen("scr-rewards");
}

// ---------- the mystery egg — a Wonderling hatches! ----------
// Same reward-reveal pattern as the treasure chest: the child's taps
// cause every crack. Tap → wiggle → CRACK → 💥 → a NEW FRIEND!
// Which pet waits inside depends on the world just rescued.
let tapsLeft = 3;
let eggPet = "pyro";
let lastPet = "pyro"; // set by finishMission; the rewards screen passes it on
function resetEgg(pet) {
  eggPet = pet || "pyro";
  tapsLeft = 3;
  $("tapsLeft").textContent = "3";
  $("egg").style.display = "";
  $("eggHint").style.display = "";
  $("hatchResult").style.display = "none";
  $("meetBtn").style.display = "none";
  $("hatchText").textContent = "";
}
function tapEgg() {
  if (tapsLeft <= 0) return;
  tapsLeft--;
  $("tapsLeft").textContent = tapsLeft;
  const egg = $("egg");
  egg.classList.remove("wiggle");
  void egg.offsetWidth; // restart the wiggle animation
  egg.classList.add("wiggle");
  playTap();
  if (tapsLeft > 0) { speak("It's cracking!"); return; }
  // HATCH!
  const p = PETS[eggPet];
  egg.style.display = "none";
  $("eggHint").style.display = "none";
  const r = $("hatchResult");
  r.textContent = p.icon;
  r.style.display = "";
  $("hatchText").innerHTML =
    "<b>" + p.name.toUpperCase() + "</b><br>NEW WONDERLING DISCOVERED!<br>" +
    "<span class='evo-note'>" + p.trait + "</span>";
  $("meetBtn").textContent = "Say hi! " + p.icon;
  $("meetBtn").style.display = "";
  if (!save.pets.includes(eggPet)) { save.pets.push(eggPet); persist(); }
  confetti(80);
  playFanfare();
  speak("Wow! You discovered " + p.name + "!");
}
function meetPet() {
  renderHome();
  showScreen("scr-home");
}

// ---------- home + wonderlings collection ----------
function renderHome() {
  renderHUD();
  const n = save.name || "Explorer";
  const last = save.pets.length ? PETS[save.pets[save.pets.length - 1]] : null;
  $("homeSpeech").textContent = {
    explorer: last ? `That was AMAZING, ${n}! ${last.name} really likes you! ⭐ What should we do next?`
                   : `Welcome home, ${n}! ⭐ Adventure awaits — pick a world!`,
    adventurer: last ? `Mission complete, ${n}. ${last.name}'s joined the team. The Wonderverse still needs us.`
                     : `Welcome back, ${n}. The Wonderverse still needs us.`,
    legend: last ? `Mission logged, ${n}. ${last.name} acquired. Awaiting next directive.`
                 : `Ready, ${n}. Awaiting directive.`,
  }[save.band];
  $("companionCard").innerHTML = last
    ? "🐾 <b>" + last.name + "</b> " + last.icon +
      " <span class='evo-note'>" + last.stage + " — " + last.evo + "</span>"
    : "🐾 No Wonderling yet… adventure to discover one!";
}
const PETS = {
  pyro: { icon: "🔥", name: "Pyro", stage: "Baby Pyro",
          trait: "Fire · Strong, impulsive, courageous",
          evo: "Solve 50 math challenges → evolves into 🐉 Pyron → 🔥🐲 INFERION" },
  sylva: { icon: "🌿", name: "Sylva", stage: "Baby Sylva",
          trait: "Leaf · Curious, gentle, wise",
          evo: "Solve 50 reading challenges → evolves into 🌿 Sylvana → 🌳✨ ELDERWOOD" },
};
function renderPets() {
  $("petList").innerHTML = save.pets.length
    ? save.pets.map((p) => {
        const d = PETS[p];
        return "<div class='card'><div style='font-size:54px'>" + d.icon + "</div>" +
          "<b>" + d.name + "</b> — " + d.stage + "<br>" + d.trait +
          "<br><span class='evo-note'>🔒 " + d.evo + "</span></div>";
      }).join("")
    : "<div class='card'>No Wonderlings yet. Adventure to discover them!</div>";
}

// ---------- boot ----------
(function boot() {
  document.body.className = "band-" + (save.band || "explorer");
  try {
    if (soundOn) ["soundBtn", "soundBtn2"].forEach((id) => {
      const b = $(id); if (b) b.textContent = "🔊 Sound: on";
    });
  } catch (e) {}
  if (save.name) $("titleBtn").textContent = "✨ Continue Adventure";
  showScreen("scr-title");
})();
