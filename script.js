localStorage.clear();

const CODEX_KEY = "VIG";
let state = { act: 1, step: 0, total: 0, current: null, char: null };

// ENSEMBLE CAST
const CAST = {
    ptolemy: { icon: "🦉", name: "Ptolemy" },
    pensive: { icon: "📜", name: "The Scribe" },
    celsus: { icon: "🗡️", name: "Celsus" }
};

// DATA BANK (Acts 1 & 2)
const DATA = [
    { q: "ἀγάπη", a: "love", why: "Why Greek? Because 'love' is too broad in English. Agape is the specific, sacrificial choice of the cross.", m: "My mouth hung agape as the love of my life walked down the aisle." },
    { q: "ζωή", a: "life", why: "The New Testament uses Zoe for eternal life—the kind of life that never ends.", m: "The zoo is full of life." },
    { q: "ν", a: "n", why: "Accuracy matters. Misreading one letter can change the mission profile.", m: "Looks like 'v', sounds like 'n'ail." },
    { q: "θεότης", a: "deity", why: "Recognizing roots (θε-) helps you see the nature of the person being described.", m: "Built on God (θεός)." }
];

function enter() {
    if(document.getElementById('pass').value === CODEX_KEY) {
        document.getElementById('screen-login').style.display = 'none';
        document.getElementById('screen-game').style.display = 'block';
        document.getElementById('hud').classList.remove('hidden');
        loadQuestion();
    }
}

function loadQuestion() {
    const display = document.getElementById('greek-main');
    const grid = document.getElementById('interaction-grid');
    const bubble = document.getElementById('chat-bubble');
    const port = document.getElementById('char-portrait');
    
    grid.innerHTML = ''; display.classList.remove('breathing');
    state.current = DATA[Math.floor(Math.random() * DATA.length)];

    // QUESTION ROTATION (3 WAYS)
    let type = Math.floor(Math.random() * 3);
    if(type === 0) { // MATCH
        display.innerText = state.current.q;
        setChoices([state.current.a, "world", "sin", "power"]);
    } else if (type === 1) { // REVERSE
        display.innerText = state.current.a.toUpperCase();
        setChoices([state.current.q, "λόγος", "φῶς", "γῆ"]);
    } else { // TARGET ID
        display.innerText = state.current.q;
        state.current.q.split('').forEach(char => {
            createBtn(char, char === state.current.q[0]); // Simple ID for now
        });
    }

    // ENSEMBLE LOGIC
    if(state.total % 4 === 0) {
        state.char = CAST.ptolemy;
        showBubble(state.current.m);
    } else if (state.total % 7 === 0) {
        state.char = CAST.celsus;
        showBubble("Are you sure? This ink looks like it's been smudged by time.");
    }

    // BREATHING TRIGGER
    setTimeout(() => { if(grid.innerHTML !== '') display.classList.add('breathing'); }, 6000);
}

function setChoices(arr) {
    let pool = shuffle(arr);
    pool.forEach(c => createBtn(c, c === state.current.a || c === state.current.q));
}

function createBtn(txt, correct) {
    const b = document.createElement('button');
    b.innerText = txt;
    b.onclick = () => { if(correct) next(); else flashError(); };
    document.getElementById('interaction-grid').appendChild(b);
}

function next() {
    state.step++; state.total++;
    updateHUD();

    // FUNDRAISER SCALE
    if(state.total === 12) showAsk(1);
    if(state.total === 24) showAsk(2);
    if(state.total === 48) { document.getElementById('screen-game').style.display = 'none'; document.getElementById('screen-end').style.display = 'block'; }
    
    if(state.step >= 12) document.getElementById('codex-nav').classList.remove('hidden');
    loadQuestion();
}

function showAsk(lvl) {
    if(lvl === 1) showBubble("You’re reclaiming the Word. Help us keep the archives open for everyone?");
    if(lvl === 2) showBubble("The mission is expanding. Your support helps us build the Hebrew and Latin vaults.");
}

function showBubble(txt) {
    const b = document.getElementById('chat-bubble');
    const p = document.getElementById('char-portrait');
    b.innerText = txt; b.style.display = "block";
    p.innerText = state.char.icon;
}

function speak() {
    let msg = new SpeechSynthesisUtterance(state.current.q);
    msg.lang = 'el-GR';
    window.speechSynthesis.cancel(); // Fix audio lock
    window.speechSynthesis.speak(msg);
}

function updateHUD() {
    document.getElementById('bar-act').style.width = (state.step / 15) * 100 + "%";
    document.getElementById('bar-chap').style.width = (state.total / 48) * 100 + "%";
}

function shuffle(a) { return a.sort(() => Math.random() - 0.5); }
function flashError() { document.body.style.background = "#300"; setTimeout(()=>document.body.style.background="#000", 200); }
