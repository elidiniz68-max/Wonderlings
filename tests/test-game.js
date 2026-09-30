const fs = require("fs");
const vm = require("vm");
const path = require("path");

const GAME = path.join(process.env.HOME, "workspace/wonderlings/game.js");

// --- Fake browser ---
const elements = {};
function mkEl(id) {
  const cls = new Set();
  return {
    id: id,
    innerHTML: "",
    textContent: "",
    value: "",
    style: {},
    _kids: [],
    classList: {
      add: (c) => cls.add(c),
      remove: (c) => cls.delete(c),
      toggle: (c, force) => {
        const want = force === undefined ? !cls.has(c) : !!force;
        if (want) cls.add(c); else cls.delete(c);
        return want;
      },
      contains: (c) => cls.has(c),
    },
    appendChild(ch) { this._kids.push(ch); },
    remove() { this._removed = true; },
    focus() {},
  };
}
const store = {};
const sandbox = {
  document: {
    getElementById: (id) => elements[id] || (elements[id] = mkEl(id)),
    createElement: (tag) => mkEl(""),
    querySelectorAll: (sel) => {
      if (sel === ".screen")
        return Object.values(elements).filter((e) => e.id.indexOf("scr-") === 0);
      if (sel === ".avatar")
        return Object.values(elements).filter((e) => e.id.indexOf("av-") === 0);
      return [];
    },
    body: { className: "", _kids: [], appendChild(ch) { this._kids.push(ch); } },
  },
  localStorage: {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  },
  speechSynthesis: {
    cancel() { sandbox.__cancelled = (sandbox.__cancelled || 0) + 1; },
    speak(u) { sandbox.__spoken.push(u.text); sandbox.__lastUtterance = u; },
    getVoices() { return sandbox.__fakeVoices || []; },
  },
  SpeechSynthesisUtterance: function (text) {
    this.text = text;
    this.pitch = 1;
    this.rate = 1;
    this.voice = null;
  },
  AudioContext: function () {
    return {
      currentTime: 0,
      createOscillator: () => ({ frequency: { value: 0 }, connect() {}, start() {}, stop() {} }),
      createGain: () => ({
        gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {},
      }),
      destination: {},
    };
  },
  window: {},
};
sandbox.window.AudioContext = sandbox.AudioContext;
sandbox.__spoken = [];

// --- Fake timers ---
let timerSeq = 0;
const timers = new Map();
sandbox.setTimeout = (fn, ms) => { const id = ++timerSeq; timers.set(id, { fn, ms }); return id; };
sandbox.clearTimeout = (id) => { timers.delete(id); };

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(GAME, "utf8"), sandbox, { filename: "game.js" });

let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    console.log("  FAIL " + name + " -> " + e.message);
  }
}
const run = (name, ...args) =>
  vm.runInContext(name + "(" + args.map((a) => JSON.stringify(a)).join(",") + ")", sandbox);
const get = (name) => vm.runInContext(name, sandbox);
const set = (stmt) => vm.runInContext(stmt, sandbox);
const el = (id) => vm.runInContext('document.getElementById("' + id + '")', sandbox);
const active = (id) => el(id).classList.contains("active");
function fireNewTimers(afterId) {
  const fresh = [...timers.entries()].filter(([id]) => id > afterId);
  fresh.forEach(([id, t]) => { timers.delete(id); t.fn(); });
}
const maxTimerId = () => (timers.size ? Math.max(...timers.keys()) : 0);

console.log("Boot + profile:");
check("title screen shows on boot", () => {
  if (!active("scr-title")) throw new Error("title not active");
});
check("fresh save has sane defaults", () => {
  const s = get("save");
  if (s.band !== "explorer" || s.xp !== 0 || s.coins !== 0) throw new Error("bad defaults");
  if (s.pets.length !== 0 || s.reactorOn !== false || s.storyOn !== false) throw new Error("bad defaults");
});
check("selectBand re-skins the universe", () => {
  run("selectBand", "legend");
  if (get("save").band !== "legend") throw new Error("band not saved");
  if (sandbox.document.body.className !== "band-legend") throw new Error("theme not applied");
  if (!el("band-legend").classList.contains("selected")) throw new Error("card not highlighted");
  if (el("band-explorer").classList.contains("selected")) throw new Error("old card still highlighted");
  run("selectBand", "explorer"); // reset
});
check("selectAvatar picks a hero", () => {
  const fake = mkEl("av-x");
  sandbox.__av = fake;
  vm.runInContext("selectAvatar('🐲', __av)", sandbox);
  if (get("save").avatar !== "🐲") throw new Error("avatar not saved");
  if (!fake.classList.contains("selected")) throw new Error("avatar not highlighted");
});
check("beginAdventure builds a 5-beat story with your name", () => {
  el("nameInput").value = "Zoe";
  run("selectBand", "adventurer");
  run("beginAdventure");
  if (get("save").name !== "Zoe") throw new Error("name not saved");
  const story = get("story");
  if (story.length !== 5) throw new Error("story should have 5 beats, got " + story.length);
  if (!story[0].includes("Zoe")) throw new Error("intro doesn't say your name");
  if (!active("scr-story")) throw new Error("story screen not shown");
});
check("story walks through beats, then reaches the map", () => {
  for (let i = 0; i < 4; i++) run("nextStory");
  if (get("storyIdx") !== 4) throw new Error("story didn't advance");
  run("nextStory");
  if (!active("scr-map")) throw new Error("map not shown after story");
  if (!el("nebulaStatus").textContent.includes("needs help")) throw new Error("nebula status wrong");
});

console.log("Question generators (all three bands):");
function checkBand(band, validate) {
  for (let i = 0; i < 25; i++) {
    const q = vm.runInContext('genQuestion("' + band + '")', sandbox);
    if (!q.prompt || typeof q.answer !== "number") throw new Error(band + ": bad question shape");
    if (q.choices.length !== 3) throw new Error(band + ": need 3 choices");
    if (new Set(q.choices).size !== 3) throw new Error(band + ": choices not unique: " + q.choices);
    if (!q.choices.includes(q.answer)) throw new Error(band + ": answer missing from choices");
    validate(q);
  }
}
check("explorer: Alien Boarding sky matches the answer", () => {
  checkBand("explorer", (q) => {
    if (q.answer < 0 || q.answer > 12) throw new Error("explorer answer out of range: " + q.answer);
    if (!q.visual || q.visual.emoji !== "👽") throw new Error("explorer question needs an alien sky");
    const staying = q.visual.leaving ? q.visual.count - q.visual.leaving : q.visual.count;
    if (staying !== q.answer) throw new Error("sky count doesn't match answer");
  });
});
check("adventurer: Power Grid nodes are valid", () => {
  for (let i = 0; i < 25; i++) {
    const q = vm.runInContext('genQuestion("adventurer")', sandbox);
    if (q.game !== "grid") throw new Error("adventurer should play Power Grid, got " + q.game);
    if (!q.prompt || !q.spoken || q.answer === undefined) throw new Error("grid question missing text");
    if (q.choices.length !== 4) throw new Error("grid needs 4 nodes, got " + q.choices.length);
    if (new Set(q.choices).size !== 4) throw new Error("nodes not unique: " + q.choices);
    if (!q.choices.includes(q.answer)) throw new Error("answer missing from nodes");
  }
});
check("legend: Reactor Core two-step is valid", () => {
  for (let i = 0; i < 25; i++) {
    const q = vm.runInContext('genQuestion("legend")', sandbox);
    if (q.game !== "reactor") throw new Error("legend should play Reactor Core, got " + q.game);
    if (!q.move || q.moves.length !== 3) throw new Error("need 3 first-move options");
    if (new Set(q.moves).size !== 3) throw new Error("moves not unique");
    if (!q.moves.includes(q.move)) throw new Error("correct move missing");
    if (!q.hint || !q.simplified) throw new Error("reactor question needs hint + simplified step");
    const m = q.prompt.match(/(-?\d*)x \+ (-?\d+) = (-?\d+)/);
    if (!m) throw new Error("reactor prompt not algebra: " + q.prompt);
    const mm = m[1] === "" ? 1 : m[1] === "-" ? -1 : Number(m[1]);
    if (mm * q.answer + Number(m[2]) !== Number(m[3]))
      throw new Error("equation doesn't solve: " + q.prompt + " x=" + q.answer);
    if (q.choices.length !== 3 || !q.choices.includes(q.answer)) throw new Error("bad solve choices");
  }
});

console.log("Mission flow:");
// fresh buttons for the CURRENT question (fake innerHTML doesn't clear kids)
function currentButtons() {
  el("choices")._kids = [];
  vm.runInContext("renderQuestion()", sandbox);
  return el("choices")._kids;
}
// grove cards render icon+word via innerHTML, so match on the stored choice
function btnFor(btns, answer) {
  return btns.find((b) => (b._choice !== undefined ? b._choice === answer : b.textContent === answer));
}
function tapChoice(choice, btn) {
  sandbox.__ans = get("answerMission");
  sandbox.__c = choice;
  sandbox.__b = btn;
  vm.runInContext("__ans(__c, __b)", sandbox);
}
check("startMission opens challenge 1 with 3 buttons", () => {
  set("save.band = 'explorer';"); // Alien Boarding: 3 big buttons
  el("choices")._kids = [];
  run("startMission");
  if (!active("scr-mission")) throw new Error("mission screen not shown");
  if (el("qProgress").textContent !== "Challenge 1 of 5") throw new Error("bad progress text");
  if (el("choices")._kids.length !== 3) throw new Error("need 3 choice buttons");
});
check("correct answer earns XP and advances", () => {
  const before = maxTimerId();
  const xp0 = get("save").xp;
  const btns = currentButtons();
  const q = get("mission").q;
  const btn = btnFor(btns, q.answer);
  tapChoice(q.answer, btn);
  if (get("save").xp !== xp0 + 10) throw new Error("no +10 XP");
  if (!btn.classList.contains("correct")) throw new Error("button not marked correct");
  fireNewTimers(before);
  if (el("qProgress").textContent !== "Challenge 2 of 5") throw new Error("didn't advance");
});
check("wrong answer earns no XP but lets you continue", () => {
  const before = maxTimerId();
  const xp0 = get("save").xp;
  const btns = currentButtons();
  const q = get("mission").q;
  const wrong = q.choices.find((c) => c !== q.answer);
  const btn = btnFor(btns, wrong);
  tapChoice(wrong, btn);
  if (get("save").xp !== xp0) throw new Error("XP given for wrong answer!");
  if (!btn.classList.contains("wrong")) throw new Error("button not marked wrong");
  fireNewTimers(before); // still advances to next challenge
  if (el("qProgress").textContent !== "Challenge 3 of 5") throw new Error("stuck after wrong answer");
});
check("double-tap on one question can't double-answer", () => {
  const before = maxTimerId();
  const btns = currentButtons();
  const q = get("mission").q;
  const btn = btnFor(btns, q.answer);
  const xp0 = get("save").xp;
  tapChoice(q.answer, btn);
  tapChoice(q.answer, btn); // second tap: locked!
  if (get("save").xp !== xp0 + 10) throw new Error("double answer gave double XP");
  fireNewTimers(before);
});
check("finishing all 5 restarts the reactor with full rewards", () => {
  // answer remaining challenges correctly (we're on challenge 4)
  for (let n = 0; n < 2; n++) {
    const before = maxTimerId();
    const btns = currentButtons();
    const q = get("mission").q;
    const btn = btnFor(btns, q.answer);
    tapChoice(q.answer, btn);
    fireNewTimers(before);
  }
  if (!active("scr-reactor")) throw new Error("reactor screen not shown");
  if (!el("reactorText").textContent.includes("ONLINE")) throw new Error("reactor not online");
  if (get("save").reactorOn !== true) throw new Error("reactorOn not saved");
  const correct = get("mission").correct; // one was wrong on purpose: 4×10 + 200
  if (get("save").xp !== correct * 10 + 200) throw new Error("mission XP wrong: " + get("save").xp);
  if (get("save").coins !== 100) throw new Error("coins wrong: " + get("save").coins);
  run("showRewards");
  if (!active("scr-rewards")) throw new Error("rewards screen not shown");
});

console.log("Mission polish (step 4):");
check("power meter charges as rounds complete", () => {
  set("save.band = 'explorer';");
  run("startMission", "nebula");
  if (el("powerFill").style.width !== "0%") throw new Error("power should start at 0%");
  if (!el("powerLabel").textContent.includes("REACTOR")) throw new Error("wrong power label");
  const before = maxTimerId();
  el("choices")._kids = [];
  const btns = currentButtons();
  const q = get("mission").q;
  tapChoice(q.answer, btnFor(btns, q.answer));
  if (el("powerFill").style.width !== "20%") throw new Error("power didn't surge to 20%");
  if (!el("powerFill").classList.contains("surge")) throw new Error("no surge pulse");
  fireNewTimers(before);
  timers.clear();
});
check("alien sky renders countable aliens", () => {
  set("save.band = 'explorer';");
  run("startMission", "nebula");
  for (let n = 0; n < 10; n++) {
    el("alienSky")._kids = []; // fake innerHTML doesn't clear kids
    el("choices")._kids = [];
    vm.runInContext("renderQuestion()", sandbox);
    const q = get("mission").q;
    const sky = el("alienSky")._kids;
    if (sky.length !== q.visual.count) throw new Error("sky count wrong: " + sky.length);
    const leaving = sky.filter((s) => s.classList.contains("leaving")).length;
    if (leaving !== (q.visual.leaving || 0)) throw new Error("leaving count wrong");
    if (!sky.every((s) => s.textContent === "👽")) throw new Error("sky emoji wrong");
  }
  timers.clear();
});
check("combo streak builds on consecutive correct answers", () => {
  set("save.band = 'explorer';");
  run("startMission", "nebula");
  const comboLines = get("WORLDS").nebula.combo.explorer;
  for (let n = 0; n < 2; n++) {
    const before = maxTimerId();
    el("choices")._kids = [];
    const btns = currentButtons();
    const q = get("mission").q;
    tapChoice(q.answer, btnFor(btns, q.answer));
    if (n === 1) {
      // streak hits 2 → the praise spoken must come from the combo list
      const praise = sandbox.__spoken[sandbox.__spoken.length - 1];
      if (!comboLines.includes(praise)) throw new Error("no combo praise spoken, got: " + praise);
    }
    fireNewTimers(before);
  }
  if (get("mission").streak !== 2) throw new Error("streak should be 2");
  // a wrong answer resets the streak but keeps the mission going
  const before = maxTimerId();
  el("choices")._kids = [];
  const btns = currentButtons();
  const q = get("mission").q;
  const wrong = q.choices.find((c) => c !== q.answer);
  tapChoice(wrong, btnFor(btns, wrong));
  if (get("mission").streak !== 0) throw new Error("streak didn't reset");
  fireNewTimers(before);
  timers.clear();
});
check("rewards screen shows actual XP earned", () => {
  // the earlier full mission had 4 correct → 4×10 + 200 = 240 (not a hardcoded 250)
  if (el("rewardXP").textContent !== "+240 XP")
    throw new Error("XP display wrong: " + el("rewardXP").textContent);
  if (el("rewardCoins").textContent !== "+100 WonderCoins")
    throw new Error("coins display wrong: " + el("rewardCoins").textContent);
});

console.log("Egg hatch:");
check("three taps hatch Pyro", () => {
  run("resetEgg", "pyro");
  if (String(el("tapsLeft").textContent) !== "3") throw new Error("egg not reset");
  run("tapEgg");
  run("tapEgg");
  if (String(el("tapsLeft").textContent) !== "1") throw new Error("taps not counting down");
  if (el("hatchResult").style.display !== "none") throw new Error("hatched too early!");
  run("tapEgg"); // CRACK 💥
  if (el("hatchResult").textContent !== "🔥") throw new Error("no pyro!");
  if (!get("save").pets.includes("pyro")) throw new Error("pyro not in collection");
  if (el("meetBtn").style.display === "none") throw new Error("no meet button");
  if (!el("hatchText").innerHTML.includes("NEW WONDERLING DISCOVERED"))
    throw new Error("no discovery message");
});
check("extra taps after hatching do nothing", () => {
  const petsBefore = get("save").pets.length;
  run("tapEgg");
  if (get("save").pets.length !== petsBefore) throw new Error("duplicate pyro!");
});
check("meetPet brings you home with your companion", () => {
  run("meetPet");
  if (!active("scr-home")) throw new Error("home not shown");
  if (!el("companionCard").innerHTML.includes("Pyro")) throw new Error("companion card missing pyro");
  if (!el("homeSpeech").textContent.includes("Zoe")) throw new Error("home speech forgot name");
});

console.log("HUD, levels, persistence:");
check("levelFor: 250 XP per level", () => {
  if (get("levelFor")(0) !== 1) throw new Error("0 xp should be LV1");
  if (get("levelFor")(249) !== 1) throw new Error("249 xp should be LV1");
  if (get("levelFor")(250) !== 2) throw new Error("250 xp should be LV2");
});
check("renderHUD shows level, coins, avatar", () => {
  set("save.xp = 260; save.coins = 100; save.avatar = '🐲';");
  run("renderHUD");
  if (el("hudLevel").textContent !== "LV 2") throw new Error("level display wrong");
  if (el("hudCoins").textContent !== "🪙 100") throw new Error("coins display wrong");
  if (el("hudAvatar").textContent !== "🐲") throw new Error("avatar display wrong");
});
check("progress survives a reload", () => {
  run("persist");
  const raw = store["wonderlings-save-v1"];
  if (!raw) throw new Error("nothing saved");
  const back = JSON.parse(raw);
  if (back.name !== "Zoe" || !back.pets.includes("pyro") || back.reactorOn !== true)
    throw new Error("save data incomplete: " + raw);
});
check("returning explorer skips straight to home", () => {
  run("onTitle");
  if (!active("scr-home")) throw new Error("returning explorer not sent home");
});
check("nebula won't restart an online reactor", () => {
  timers.clear(); // confetti schedules legit cleanup timers; ignore those
  run("enterWorld", "nebula");
  if (active("scr-mission")) throw new Error("mission restarted on online reactor!");
  if (timers.size !== 0) throw new Error("stray timers scheduled");
});
check("map shows reactor status", () => {
  run("renderMap");
  if (!el("nebulaStatus").textContent.includes("online")) throw new Error("status not updated");
});

console.log("Storywood:");
check("WORLDS config covers both worlds", () => {
  const W = get("WORLDS");
  ["nebula", "storywood"].forEach((k) => {
    const w = W[k];
    if (!w.flag || !w.pet || !w.cinematicText || !w.gen) throw new Error(k + " config incomplete");
    ["explorer", "adventurer", "legend"].forEach((b) => {
      if (!w.quips[b] || !w.quips[b].length) throw new Error(k + " missing quips for " + b);
      if (!w.praise[b] || !w.praise[b].length) throw new Error(k + " missing praise for " + b);
    });
  });
  const pets = get("PETS");
  if (!pets.pyro || !pets.sylva) throw new Error("pets incomplete");
});
check("reading questions are valid (all bands, 40 rounds each)", () => {
  const gen = get("genReadingQuestion");
  ["explorer", "adventurer", "legend"].forEach((band) => {
    for (let i = 0; i < 40; i++) {
      const q = gen(band);
      if (!q.prompt || !q.spoken || !q.answer) throw new Error(band + " question missing text");
      if (!Array.isArray(q.choices) || q.choices.length !== 3) throw new Error(band + " needs 3 choices");
      if (!q.choices.includes(q.answer)) throw new Error(band + " answer not in choices");
      if (new Set(q.choices).size !== 3) throw new Error(band + " duplicate choices");
    }
  });
});
check("storywood opens from the map with reading challenges", () => {
  set("save.storyOn = false;");
  run("enterWorld", "storywood");
  const m = get("mission");
  if (!m || m.world !== "storywood") throw new Error("storywood mission not started");
  if (!active("scr-mission")) throw new Error("mission screen not shown");
  if (currentButtons().length !== 3) throw new Error("need 3 choice buttons");
  timers.clear();
});
check("storywood mission blooms the Story Tree", () => {
  set("save.band = 'adventurer'; save.storyOn = false; save.xp = 0; save.coins = 0;");
  run("startMission", "storywood");
  for (let n = 0; n < 5; n++) {
    const before = maxTimerId();
    const btns = currentButtons(); // render FIRST, then read the new question
    const q = get("mission").q;
    const btn = btnFor(btns, q.answer);
    tapChoice(q.answer, btn);
    fireNewTimers(before);
  }
  if (!active("scr-reactor")) throw new Error("cinematic not shown");
  if (!el("reactorText").textContent.includes("BLOOMS")) throw new Error("tree didn't bloom: " + el("reactorText").textContent);
  if (el("cinematicIcon").textContent !== "🌳") throw new Error("wrong cinematic icon");
  if (get("save").storyOn !== true) throw new Error("storyOn not saved");
  if (get("lastPet") !== "sylva") throw new Error("lastPet not sylva");
  run("showRewards");
});
check("three taps hatch Sylva", () => {
  run("resetEgg", "sylva");
  run("tapEgg");
  run("tapEgg");
  run("tapEgg"); // CRACK 💥
  if (el("hatchResult").textContent !== "🌿") throw new Error("no sylva!");
  if (!get("save").pets.includes("sylva")) throw new Error("sylva not in collection");
  if (!el("hatchText").innerHTML.includes("SYLVA")) throw new Error("no sylva discovery message");
  if (!el("meetBtn").textContent.includes("🌿")) throw new Error("meet button not per-pet");
});
check("storywood won't regrow a blooming tree", () => {
  timers.clear();
  run("enterWorld", "storywood");
  if (active("scr-mission")) throw new Error("mission restarted on blooming tree!");
  if (timers.size !== 0) throw new Error("stray timers scheduled");
});
check("map shows storywood status", () => {
  run("renderMap");
  if (!el("storyStatus").textContent.includes("blooming")) throw new Error("status not updated");
});
check("meetPet brings you home with sylva", () => {
  run("meetPet");
  if (!active("scr-home")) throw new Error("home not shown");
  if (!el("companionCard").innerHTML.includes("Sylva")) throw new Error("companion card missing sylva");
});

console.log("Wonderlings collection:");
check("renderPets shows pyro with evolution teaser", () => {
  run("renderPets");
  const html = el("petList").innerHTML;
  if (!html.includes("Pyro")) throw new Error("pyro missing");
  if (!html.includes("Pyron")) throw new Error("evolution teaser missing");
});

console.log("Milo's cartoon voice:");
check("speak uses a playful but calm cartoon voice", () => {
  sandbox.__spoken = [];
  run("speak", "I'm ready!");
  const u = sandbox.__lastUtterance;
  if (u.pitch !== 1.7) throw new Error("pitch wrong: " + u.pitch);
  if (u.rate !== 1.05) throw new Error("rate wrong: " + u.rate);
  if (u.text !== "I'm ready!") throw new Error("wrong words spoken");
});
check("giggle plays without crashing", () => {
  run("playGiggle");
});

console.log("v5 mini-games:");
check("M2 Power Grid: tapping the right node routes power", () => {
  set("save.band = 'adventurer';");
  run("startMission", "nebula");
  const btns = currentButtons();
  const q = get("mission").q;
  if (q.game !== "grid") throw new Error("expected Power Grid, got " + q.game);
  if (btns.length !== 4) throw new Error("grid should render 4 nodes, got " + btns.length);
  if (!el("choices").classList.contains("node-grid")) throw new Error("no node-grid layout");
  const xp0 = get("save").xp;
  const before = maxTimerId();
  tapChoice(q.answer, btnFor(btns, q.answer));
  if (get("save").xp !== xp0 + 10) throw new Error("no +10 XP for node tap");
  if (!btnFor(btns, q.answer).classList.contains("correct")) throw new Error("node didn't ignite");
  fireNewTimers(before);
  if (el("qProgress").textContent !== "Challenge 2 of 5") throw new Error("didn't advance");
  timers.clear();
});
check("M3 Reactor Core: wrong first move hints, right move opens solving", () => {
  set("save.band = 'legend';");
  run("startMission", "nebula");
  const moveBtns = currentButtons();
  const q = get("mission").q;
  if (q.game !== "reactor") throw new Error("expected Reactor Core, got " + q.game);
  if (moveBtns.length !== 3) throw new Error("need 3 first-move buttons");
  sandbox.__mv = get("answerMove");
  // wrong move → skill hint, no lock, retry allowed
  const wrongMv = q.moves.find((mv) => mv !== q.move);
  sandbox.__a1 = wrongMv; sandbox.__b1 = btnFor(moveBtns, wrongMv);
  vm.runInContext("__mv(__a1, __b1)", sandbox);
  if (!btnFor(moveBtns, wrongMv).classList.contains("wrong")) throw new Error("wrong move not marked");
  if (get("mission").locked) throw new Error("wrong move should NOT lock (retry allowed)");
  const hint = sandbox.__spoken[sandbox.__spoken.length - 1];
  if (!/undo/i.test(hint)) throw new Error("no skill hint spoken: " + hint);
  // right move → phase 2 solve step
  const rightBtn = btnFor(moveBtns, q.move); // capture BEFORE phase 2 re-renders
  sandbox.__a1 = q.move; sandbox.__b1 = rightBtn;
  vm.runInContext("__mv(__a1, __b1)", sandbox);
  if (!rightBtn.classList.contains("correct")) throw new Error("right move not marked");
  if (!el("qPrompt").innerHTML.includes(q.simplified)) throw new Error("solve step not shown");
  const solveBtns = el("choices")._kids;
  if (solveBtns.length !== 3) throw new Error("need 3 solve buttons, got " + solveBtns.length);
  const xp0 = get("save").xp;
  const before = maxTimerId();
  tapChoice(q.answer, btnFor(solveBtns, q.answer));
  if (get("save").xp !== xp0 + 10) throw new Error("no +10 XP for solve");
  fireNewTimers(before);
  if (el("qProgress").textContent !== "Challenge 2 of 5") throw new Error("didn't advance");
  timers.clear();
});
check("R1 Rhyme Grove: hear-it button and flower cards", () => {
  set("save.band = 'explorer';");
  run("startMission", "storywood");
  const btns = currentButtons();
  const q = get("mission").q;
  if (q.game !== "grove") throw new Error("expected Rhyme Grove, got " + q.game);
  if (el("hearBtn").style.display === "none") throw new Error("hear-it button hidden");
  if (btns.length !== 3) throw new Error("need 3 flower cards");
  if (!btns.every((b) => b.classList.contains("grove-card"))) throw new Error("not grove cards");
  const s0 = sandbox.__spoken.length;
  run("hearPrompt");
  if (sandbox.__spoken.length !== s0 + 1) throw new Error("hearPrompt didn't speak");
  if (sandbox.__spoken[sandbox.__spoken.length - 1] !== q.spoken)
    throw new Error("hearPrompt spoke the wrong line");
  const xp0 = get("save").xp;
  const before = maxTimerId();
  tapChoice(q.answer, btnFor(btns, q.answer));
  if (get("save").xp !== xp0 + 10) throw new Error("no +10 XP");
  fireNewTimers(before);
  timers.clear();
});
check("grove icons stay glued to their words", () => {
  const gen = get("genReadingQuestion");
  for (let i = 0; i < 40; i++) {
    const q = gen("explorer");
    if (q.icons.length !== 3) throw new Error("grove question needs 3 icons");
    if (/rhymes with CAT/.test(q.prompt)) {
      const idx = q.choices.indexOf("HAT");
      if (q.icons[idx] !== "🎩") throw new Error("HAT lost its hat after shuffling!");
    }
  }
});
check("R2 Word Bridge: planks fill as you answer", () => {
  set("save.band = 'adventurer';");
  run("startMission", "storywood");
  const btns = currentButtons();
  const q = get("mission").q;
  if (q.game !== "bridge") throw new Error("expected Word Bridge, got " + q.game);
  const bare = (s) => s.replace(/<[^>]+>/g, "");
  if (!/⬜⬜⬜⬜⬜/.test(bare(el("alienSky").innerHTML)))
    throw new Error("bridge should start empty: " + bare(el("alienSky").innerHTML));
  const before = maxTimerId();
  tapChoice(q.answer, btnFor(btns, q.answer));
  fireNewTimers(before); // → challenge 2, bridge re-renders with 1 plank
  if (!/🟫/.test(bare(el("alienSky").innerHTML))) throw new Error("plank not laid after correct answer");
  if (el("qProgress").textContent !== "Challenge 2 of 5") throw new Error("didn't advance");
  timers.clear();
});
check("R3 Tale Detective: answer, then tap the proof", () => {
  set("save.band = 'legend';");
  run("startMission", "storywood");
  let btns, q, guard = 0;
  do { // deal until we get an inference case (evidence tap), not a vocab case
    btns = currentButtons();
    q = get("mission").q;
    guard++;
  } while (q.evidence == null && guard < 50);
  if (q.evidence == null) throw new Error("never dealt an inference case");
  sandbox.__det = get("answerDetective");
  sandbox.__a1 = q.answer; sandbox.__b1 = btnFor(btns, q.answer);
  vm.runInContext("__det(__a1, __b1)", sandbox);
  if (get("mission").locked) throw new Error("phase-1 correct should NOT lock");
  const dos = el("qPrompt")._kids[el("qPrompt")._kids.length - 1];
  const lines = dos._kids.filter((k) => k.classList.contains("ev-line"));
  if (lines.length !== q.lines.length) throw new Error("evidence lines not rendered");
  sandbox.__ev = get("tapEvidence");
  // wrong line → hint, no lock, retry allowed
  const wrongIdx = q.lines.findIndex((_, i) => i !== q.evidence);
  sandbox.__li = wrongIdx; sandbox.__le = lines[wrongIdx];
  vm.runInContext("__ev(__li, __le)", sandbox);
  if (get("mission").locked) throw new Error("wrong line should NOT lock");
  if (!/really saying/i.test(sandbox.__spoken[sandbox.__spoken.length - 1]))
    throw new Error("no evidence hint spoken");
  // right line → CASE CLOSED, +10 XP, advance
  const xp0 = get("save").xp;
  const before = maxTimerId();
  sandbox.__li = q.evidence; sandbox.__le = lines[q.evidence];
  vm.runInContext("__ev(__li, __le)", sandbox);
  if (get("save").xp !== xp0 + 10) throw new Error("no +10 XP for closed case");
  if (!lines[q.evidence].classList.contains("correct")) throw new Error("proof line not stamped");
  if (!/CASE CLOSED/i.test(sandbox.__spoken[sandbox.__spoken.length - 1]))
    throw new Error("no CASE CLOSED celebration");
  fireNewTimers(before);
  if (el("qProgress").textContent !== "Challenge 2 of 5") throw new Error("didn't advance");
  timers.clear();
});

console.log("\n" + passed + " total checks passed.");
