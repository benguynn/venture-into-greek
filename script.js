const VAULT = [
    { q: "ἀλήθεια", a: "truth", why: "[Smuggler] Pilate stood before the 'Aletheia' (Truth) and didn't recognize it." },
    { q: "λόγος", a: "word", why: "[Patron] The divine 'Logos' (Logic) that sustains the universe." },
    { q: "ζωή", a: "life", why: "[Scribe] Zoe is more than biological; it is the life of the Resurrection." }
];

let state = { step: 0, total: 0, current: null };

function showScreen(id) {
    document.getElementById('snd-paper').play();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'screen-map') renderMap();
    if(id === 'screen-game') loadGame();
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

function loadGame() {
    const display = document.getElementById('greek-display');
    const zone = document.getElementById('interaction-braid');
    const bubble = document.getElementById('chat-bubble');
    
    zone.innerHTML = '';
    state.current = VAULT[state.step % VAULT.length];
    display.innerText = state.current.q;
    bubble.innerText = state.current.why;

    let chars = state.current.q.split('');
    let shuffled = [...chars].sort(() => Math.random() - 0.5);

    shuffled.forEach(c => {
        const b = document.createElement('button');
        b.innerText = c;
        b.onclick = () => {
            if(c === chars[0]) {
                document.getElementById('snd-ink').play();
                chars.shift();
                b.style.visibility = 'hidden';
                if(chars.length === 0) { state.step++; state.total++; checkProgress(); }
            } else {
                document.getElementById('app-container').classList.add('shake');
                setTimeout(() => document.getElementById('app-container').classList.remove('shake'), 400);
                if(navigator.vibrate) navigator.vibrate(100);
            }
        };
        zone.appendChild(b);
    });
}

function checkProgress() {
    if(state.step >= 3) {
        showScreen('screen-summary');
        const ring = document.getElementById('progress-ring');
        ring.style.strokeDashoffset = 283 - (283 * 0.1); // Placeholder 10%
        document.getElementById('pct-label').innerText = "10%";
    } else {
        loadGame();
    }
}
