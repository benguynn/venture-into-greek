localStorage.clear();

const STATE = { act: 1, step: 0, total: 0, current: null, errors: 0 };

const ACT1_CONTENT = [
    { q: "ἀγάπη", a: "love", why: "English 'love' is a catch-all. Agape is the specific, sacrificial ink of the New Testament.", m: "Mouth hung agape at such love." },
    { q: "ζωή", a: "life", why: "Zoe is not just biological existence; it's the quality of life found in Christ.", m: "The zoo is full of life." },
    { q: "ἀλήθεια", a: "truth", i: "The athlete was doping; there was no hiding the truth." }
];

function enter() {
    if(document.getElementById('pass').value.toUpperCase() === "VIG") {
        document.getElementById('screen-login').style.display = 'none';
        document.getElementById('screen-game').style.display = 'block';
        loadQuestion();
    }
}

function loadQuestion() {
    const display = document.getElementById('greek-main');
    const grid = document.getElementById('interaction-grid');
    const bubble = document.getElementById('chat-bubble');
    
    grid.innerHTML = ''; 
    state.current = ACT1_CONTENT[state.step % ACT1_CONTENT.length];

    display.innerText = state.current.q;
    bubble.innerText = state.current.why || state.current.m;

    let choices = [state.current.a, "world", "sin", "power"].sort(() => Math.random() - 0.5);
    choices.forEach(c => {
        const b = document.createElement('button');
        b.className = "btn-minimal";
        b.innerText = c;
        b.onclick = () => check(c === state.current.a);
        grid.appendChild(b);
    });
}

function check(correct) {
    if(!correct) {
        state.errors++;
        triggerFeedback();
        return;
    }
    
    state.errors = 0;
    state.step++; state.total++;
    
    if(state.step === 12) { showSummary(); }
    else { loadQuestion(); }
}

function triggerFeedback() {
    const card = document.querySelector('.parchment');
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 400);

    // Haptic Logic
    if ("vibrate" in navigator) {
        if(state.errors === 1) navigator.vibrate(50);
        if(state.errors === 2) navigator.vibrate([100, 50, 100]);
        if(state.errors >= 3) {
            navigator.vibrate(500);
            document.body.style.background = "#400";
            setTimeout(() => document.body.style.background = "#000", 300);
        }
    }
}

function showSummary() {
    document.getElementById('screen-game').style.display = 'none';
    document.getElementById('screen-summary').style.display = 'block';
    
    const ring = document.getElementById('progress-ring');
    const pct = Math.min(100, (state.total / 48) * 100);
    const offset = 283 - (283 * pct) / 100;
    
    setTimeout(() => {
        ring.style.strokeDashoffset = offset;
        document.getElementById('pct-label').innerText = Math.round(pct) + "%";
    }, 500);
}

function speakCurrent() {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(state.current.q);
    msg.lang = 'el-GR';
    window.speechSynthesis.speak(msg);
}
