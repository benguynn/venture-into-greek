localStorage.clear();

const STATE = { act: 1, step: 0, total: 0, currentWord: "" };

const ACT1_LESSONS = [
    { type: 'observe', q: "Χριστός", a: "Χ", p: "Touch the letter that looks like an 'X'. It sounds like 'CH'." },
    { type: 'match', q: "Χριστός", a: "Christ", p: "Now find the English match for 'Christos'." },
    { type: 'observe', q: "ν", a: "n", p: "This is the 'nu'. It looks like a 'v', but sounds like 'n'ail." }
];

const ACT2_ROOTS = [
    { q: "θεός", a: "God", p: "The root of Theology." },
    { q: "θεότης", a: "Deity", p: "This is the nature of God (from Act 1)." }
];

function unlock() {
    if(document.getElementById('pass-input').value === "VentureIntoGreek") {
        document.getElementById('screen-login').style.display = 'none';
        document.getElementById('screen-game').style.display = 'block';
        render();
    }
}

function render() {
    const display = document.getElementById('greek-display');
    const zone = document.getElementById('interaction-zone');
    const bubble = document.getElementById('chat-bubble');
    
    display.innerHTML = ''; zone.innerHTML = ''; display.className = "huge-greek";
    
    let db = (STATE.act === 1) ? ACT1_LESSONS : ACT2_ROOTS;
    let item = db[STATE.step % db.length];
    STATE.currentWord = item.q;
    
    bubble.innerText = item.p;
    display.innerText = item.q;

    // Start breathing if idle
    let idleTimer = setTimeout(() => display.classList.add('breathing'), 5000);

    // Varied Interactivity
    if(item.type === 'observe') {
        item.q.split('').forEach(char => {
            let b = document.createElement('button');
            b.innerText = char;
            b.onclick = () => { clearTimeout(idleTimer); check(char === item.a); };
            zone.appendChild(b);
        });
    } else {
        let choices = [item.a, "Life", "Grace"].sort(() => Math.random() - 0.5);
        choices.forEach(c => {
            let b = document.createElement('button');
            b.innerText = c;
            b.onclick = () => { clearTimeout(idleTimer); check(c === item.a); };
            zone.appendChild(b);
        });
    }
    updateBars();
}

function check(correct) {
    if(!correct) return;
    STATE.step++; STATE.total++;
    
    // FUNDRAISER ASK LOGIC
    if(STATE.total === 12) triggerAsk(1);
    if(STATE.total === 24) triggerAsk(2);

    if(STATE.step >= 12 && STATE.act === 1) document.getElementById('nav-bar').classList.remove('hidden');
    
    setTimeout(render, 800);
}

function triggerAsk(num) {
    const bubble = document.getElementById('chat-bubble');
    if(num === 1) {
        bubble.innerText = "You're getting it! Reclaiming the Word is a team effort. Check out how you can help us grow!";
    } else if(num === 2) {
        bubble.innerText = "Mastery is building! Consider a gift to help us preserve these texts for the next generation.";
    }
}

function speakCurrent() {
    let msg = new SpeechSynthesisUtterance(STATE.currentWord);
    msg.lang = 'el-GR';
    window.speechSynthesis.speak(msg);
}

function updateBars() {
    document.getElementById('act-bar').style.width = (STATE.step / 15) * 100 + "%";
    document.getElementById('chap-bar').style.width = (STATE.total / 48) * 100 + "%";
    document.getElementById('game-bar').style.width = "2%";
}

function switchAct(num) { STATE.act = num; STATE.step = 0; render(); }
