localStorage.clear();

const STATE = { act: 1, step: 0, total: 0, unlockedIntel: [] };

const ACT1 = [ // Recognition
    { q: "θεός", a: "God", i: "The root of theology." },
    { q: "λόγος", a: "Word", i: "The root of logic." },
    { q: "ἀλήθεια", a: "Truth", i: "Reality uncovered." },
    { q: "ν", a: "n", i: "Looks like 'v', sounds like 'n'." },
    { q: "ρ", a: "r", i: "Looks like 'p', sounds like 'r'." }
];

const ACT2 = [ // Patterns (Builds on Act 1)
    { q: "θεότης", a: "Deity", i: "Built on θεός (Act 1). This is the nature of God." },
    { q: "λογικός", a: "Logical", i: "Built on λόγος (Act 1). The pattern of the Word." },
    { q: "ἀληθινός", a: "True", i: "Built on ἀλήθεια (Act 1). The adjective form." }
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
    const grid = document.getElementById('options-grid');
    
    display.innerHTML = ''; grid.innerHTML = '';
    let db = (STATE.act === 1) ? ACT1 : (STATE.act === 2) ? ACT2 : ACT1;
    let item = db[STATE.step % db.length];

    display.innerText = item.q;

    // Fix: Clear and rebuild options
    let pool = ["Life", "Faith", "Grace", "Spirit", "Earth"];
    let choices = shuffle([item.a, ...pool.slice(0, 3)]);

    choices.forEach(c => {
        let b = document.createElement('button');
        b.innerText = c;
        b.onclick = () => handleAnswer(c === item.a, item.i);
        grid.appendChild(b);
    });

    updateUI();
}

function handleAnswer(correct, intel) {
    if(!correct) return; // Silent fail or minor red flash
    
    STATE.step++;
    STATE.total++;
    
    // Save to Dossier
    if(!STATE.unlockedIntel.includes(intel)) {
        STATE.unlockedIntel.push(intel);
        localStorage.setItem('dossier', JSON.stringify(STATE.unlockedIntel));
    }

    document.getElementById('intel-feed').innerText = intel;
    
    if(STATE.step >= 12 && STATE.act === 1) {
        document.getElementById('act-navigator').classList.remove('nav-hidden');
    }

    setTimeout(render, 1000);
}

function switchAct(num) {
    STATE.act = num;
    STATE.step = 0;
    render();
}

function updateUI() {
    const fill = document.getElementById('chap-fill');
    let pct = (STATE.total / 50) * 100;
    fill.style.width = Math.min(pct, 100) + "%";
    document.getElementById('chap-pct').innerText = Math.round(pct) + "%";
}

function shuffle(a) { return a.sort(() => Math.random() - 0.5); }
