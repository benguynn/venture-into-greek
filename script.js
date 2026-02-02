localStorage.clear();

const STATE = { act: 1, step: 0, total: 0, encore: false };

const ACT1 = [
    { q: "Χριστός", a: "Christ", i: "A title, not a name." },
    { q: "ἄγγελος", a: "Angel", i: "Simply a messenger." },
    { q: "ν", a: "n", i: "Looks like 'v'." },
    { q: "ρ", a: "r", i: "Looks like 'p'." },
    { q: "θρόνος", a: "Throne", i: "A seat of authority." },
    // Imagine 45 more items here...
];

const ACT2 = [
    { q: "λογικός", a: "Logical", i: "Root: λόγος (Act 1). Truth follows a pattern." },
    { q: "θεότης", a: "Deity", i: "Root: θεός (Act 1). Essential nature." }
];

function unlock() {
    if(document.getElementById('pass-input').value === "VentureIntoGreek") {
        document.getElementById('screen-login').style.display = 'none';
        document.getElementById('screen-game').style.display = 'block';
        render();
    }
}

function render() {
    const display = document.getElementById('display-area');
    const zone = document.getElementById('interaction-zone');
    
    display.innerHTML = ''; zone.innerHTML = '';
    let db = (STATE.act === 1) ? ACT1 : ACT2;
    let item = db[STATE.step % db.length];

    updateBars();

    if (STATE.encore) {
        startEncore(display, zone);
        return;
    }

    display.innerText = item.q;
    // Diversity: Sometimes 2 buttons, sometimes 4
    let choices = shuffle([item.a, "Life", "Grace", "Spirit"]).slice(0, STATE.act === 1 ? 2 : 4);
    choices.forEach(c => {
        let b = document.createElement('button');
        b.innerText = c;
        b.onclick = () => handleAnswer(c === item.a, item.i);
        zone.appendChild(b);
    });
}

function handleAnswer(correct, intel) {
    if(!correct) { alert("Negative. Recalibrate."); return; }
    
    STATE.step++; STATE.total++;
    showToast(intel);

    setTimeout(() => {
        if (STATE.act === 1 && STATE.step === 12) {
            triggerModal("ACT II UNSEALED", "You've mastered the Training Grounds. Advance to the Forge?", "ADVANCE", "STAY", 2);
        } else if (STATE.step >= 48) {
            startEncoreMode();
        } else {
            render();
        }
    }, 1500);
}

function triggerModal(title, body, pText, sText, targetAct) {
    const m = document.getElementById('modal-overlay');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerText = body;
    document.getElementById('modal-primary').innerText = pText;
    document.getElementById('modal-secondary').innerText = sText;
    
    m.className = ""; // Show
    document.getElementById('modal-primary').onclick = () => { 
        STATE.act = targetAct; STATE.step = 0; m.className = "modal-hide"; render(); 
    };
    document.getElementById('modal-secondary').onclick = () => { m.className = "modal-hide"; render(); };
}

function startEncoreMode() {
    STATE.encore = true;
    triggerModal("THE ENCORE", "High-speed extraction. Tap the words before the ink fades.", "BEGIN", "NOT READY", STATE.act);
}

function startEncore(display, zone) {
    // High action logic: Words fade in/out every 2 seconds
    let item = ACT1[Math.floor(Math.random()*ACT1.length)];
    display.innerText = item.q;
    display.style.animation = "fadeOut 2s forwards";
    // User must click correct button before fade completes
}

function updateBars() {
    document.getElementById('act-fill').style.width = (STATE.step / 48) * 100 + "%";
    document.getElementById('chap-fill').style.width = (STATE.total / 100) * 100 + "%";
}

function showToast(msg) {
    const t = document.getElementById('intel-toast');
    t.innerText = "INTEL: " + msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3000);
}

function shuffle(a) { return a.sort(() => Math.random() - 0.5); }
