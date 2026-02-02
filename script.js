/* --- DATA VAULT (Chapter 1 Biblical Core) --- */
const VAULT = [
    { q: "ἀλήθεια", a: "truth", why: "Smuggler Intel: Pilate asked 'What is truth?' while standing before the Aletheia.", cat: "intro" },
    { q: "λόγος", a: "word", why: "Patron Intel: The Logic that sustained the stars became a man.", cat: "intro" },
    { q: "ζωή", a: "life", why: "Scribe Intel: Zoe is the quality of life found in the resurrection.", cat: "intro" },
    { q: "θεός", a: "god", why: "Patron Intel: This root defines the very nature of the Creator.", cat: "intro" },
    { q: "ν", a: "n", why: "Tactical Warning: This is the 'nu'. It looks like a 'v', but sounds like 'n'ail.", cat: "alpha" }
];

/* --- PERSONNEL DIALOGUE (12 placeholders each) --- */
const CAST = {
    patron: { name: "[The Patron]", lines: ["The archives are open. Enter with intent.", "Precision is our only defense.", "The mission is clear: Autonomy."] },
    smuggler: { name: "[The Smuggler]", lines: ["I've got the raw data. Don't smudge it.", "Keep it quiet. The Critics are close.", "That nu is a trap. Don't let it trick you."] },
    critic: { name: "[The Critic]", lines: ["You missed a letter. Pathetic.", "You're chasing a ghost, Scribe.", "Fine. You passed. But Act II will break you."] }
};

let STATE = { chapter: 1, act: 1, step: 0, total: 0, errors: 0, current: null };

/* --- NAVIGATION & TRANSITIONS --- */
function showScreen(id) {
    playSnd('snd-paper');
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'screen-map') renderMap();
    if(id === 'screen-game') loadInteraction();
}

function renderMap() {
    const grid = document.getElementById('chapter-grid'); grid.innerHTML = '';
    for(let i=1; i<=36; i++) {
        const node = document.createElement('div');
        node.className = `chap-node ${i > 1 ? 'locked' : ''}`;
        node.innerText = i;
        if(i === 1) node.onclick = () => showScreen('screen-game');
        grid.appendChild(node);
    }
}

/* --- THE GAME LOOP (Act 1: Path Clearer) --- */
function loadInteraction() {
    const display = document.getElementById('greek-display');
    const zone = document.getElementById('interaction-braid');
    const bubble = document.getElementById('chat-bubble');
    
    zone.innerHTML = ''; 
    STATE.current = VAULT[STATE.step % VAULT.length];

    // Character Logic
    bubble.innerText = STATE.current.why;

    // Interaction Style: Path Clearer (Tap letters in order)
    display.innerText = STATE.current.q;
    display.classList.add('ink-trace-faint');

    const chars = STATE.current.q.split('');
    const shuffled = [...chars].sort(() => Math.random() - 0.5);

    shuffled.forEach(c => {
        const b = document.createElement('button');
        b.innerText = c;
        b.onclick = () => {
            if(c === chars[0]) {
                playSnd('snd-ink');
                chars.shift();
                b.style.visibility = 'hidden';
                if(chars.length === 0) handleSuccess();
            } else {
                handleError();
            }
        };
        zone.appendChild(b);
    });
}

function handleSuccess() {
    STATE.step++; STATE.total++;
    hapticFeedback(10);
    if(STATE.step >= 12) triggerSummary();
    else loadInteraction();
}

function handleError() {
    STATE.errors++;
    hapticFeedback(50 * STATE.errors);
    const card = document.getElementById('screen-game');
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 400);
}

function triggerSummary() {
    showScreen('screen-summary');
    const ring = document.getElementById('progress-ring');
    const pct = (STATE.total / 48) * 100;
    ring.style.strokeDashoffset = 283 - (283 * pct) / 100;
    document.getElementById('pct-label').innerText = Math.round(pct) + "%";
}

/* --- MATERIAL & NATIVE HELPERS --- */
function playSnd(id) { document.getElementById(id).play(); }

function hapticFeedback(ms) {
    if ("vibrate" in navigator) navigator.vibrate(ms);
}

function playCurrentInk() {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(STATE.current.q);
    msg.lang = 'el-GR';
    window.speechSynthesis.speak(msg);
}

// Global Entry
function enter() { showScreen('screen-menu'); }
