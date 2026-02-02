// CLEAR PROGRESS FOR FRESH START
localStorage.clear();

const CODEX_KEY = "VentureIntoGreek";
let state = { act: 1, step: 0, totalCorrect: 0, intel: [] };

const act1_data = [
    { q: "Χριστός", a: "Christ", i: "The title 'Christ' means 'Anointed.' In the ancient world, it marked someone set apart for a specific, royal mission." },
    { q: "ἄγγελος", a: "Angel", i: "This simply meant 'messenger.' It was used for human mailmen and heavenly beings alike." },
    { q: "βάπτισμα", a: "Baptism", i: "Used by fabric dyers. To 'baptize' cloth was to dip it until it took on the permanent color of the dye." },
    { q: "ἀμήν", a: "Amen", i: "This is a legal word. It means 'I stake my life on the truth of what was just said.'" },
    { q: "ν", a: "n", i: "Careful: This is the Greek 'nu'. It looks like our 'v' but sounds like 'n'ail. It's a classic false friend." },
    { q: "ρ", a: "r", i: "The 'rho'. It looks like a 'p', but it sounds like a 'r'umble. Don't let your eyes lie to you." },
    { q: "θρόνος", a: "Throne", i: "The 'theta' (θ) is a circle with a bar, representing a shield or a seat of authority." },
    { q: "βιβλίον", a: "Book", i: "Where we get 'Bible.' It refers to the papyrus reed used to make the scrolls." },
    { q: "ἀπόστολος", a: "Apostle", i: "A diplomatic term for a 'Sent One'—an ambassador with the full authority of the sender." },
    { q: "Paradise", a: "παράδεισος", i: "Historical Context: This referred to a King's walled garden, a place of peace protected from the wilderness." },
    { q: "Church", a: "ἐκκλησία", i: "Literally 'the called-out ones.' It was a political term for citizens summoned to a public meeting." },
    { q: "Deacon", a: "διάκονος", i: "In the 1st century, this was the word for a waiter. It means to serve others at a table." }
];

function unlock() {
    const input = document.getElementById('pass-input').value;
    if (input === CODEX_KEY) {
        document.getElementById('screen-login').style.display = 'none';
        document.getElementById('screen-game').style.display = 'block';
        render();
    }
}

function render() {
    const display = document.getElementById('display-area');
    const opts = document.getElementById('options-area');
    const status = document.getElementById('status-update');
    
    display.innerHTML = '';
    opts.innerHTML = '';
    status.style.display = 'none';

    let db = (state.act === 1) ? act1_data : act1_data; // Will add Act 2 data in next step
    let item = db[state.step % db.length];

    updateProgress();

    display.innerHTML = `<div class="word-display">${item.q}</div>`;
    
    let choices = [item.a, "Spirit", "Life", "Truth"].sort(() => Math.random() - 0.5);
    choices.forEach(c => {
        let b = document.createElement('button');
        b.innerText = c;
        b.onclick = () => check(c === item.a, item.i);
        opts.appendChild(b);
    });
}

function check(correct, intel) {
    if (!correct) {
        alert("Slow is smooth. Re-read the ink.");
        return;
    }

    const opts = document.getElementById('options-area');
    const status = document.getElementById('status-update');
    const dossier = document.getElementById('dossier-scroll');
    
    opts.innerHTML = '';
    status.style.display = 'block';
    dossier.style.display = 'block';
    dossier.innerHTML = `<b>INTEL RECOVERED:</b><br>${intel}`;

    state.step++;
    state.totalCorrect++;

    // "Slow is Smooth" Delay
    setTimeout(() => {
        handleMasteryGates();
    }, 1800);
}

function handleMasteryGates() {
    if (state.act === 1 && state.step === 12) {
        if (confirm("80% Mastery achieved. Proceed to Act II or stay to sharpen your skills?")) {
            state.act = 2; state.step = 0;
        }
    } else if (state.act === 1 && state.step === 24) {
        alert("90% Mastery. Moving to the Scriptorium.");
        state.act = 2; state.step = 0;
    } else if (state.act === 1 && state.step === 48) {
        showSuccess();
        return;
    }
    render();
}

function updateProgress() {
    const actFill = document.getElementById('act-fill');
    const chapFill = document.getElementById('chap-fill');
    
    let actPct = (state.step / 48) * 100;
    actFill.style.width = actPct + "%";
    document.getElementById('act-pct').innerText = Math.round(actPct) + "%";
    
    let chapPct = ((state.act - 1) * 33) + (actPct / 3);
    chapFill.style.width = chapPct + "%";
    document.getElementById('chap-pct').innerText = Math.round(chapPct) + "%";
}

function showSuccess() {
    document.getElementById('screen-game').style.display = 'none';
    document.getElementById('screen-success').style.display = 'block';
    const board = document.getElementById('leaderboard');
    const names = [
        {n: "Lydia", x: 4500}, {n: "Barnabas", x: 4100}, {n: "YOU", x: 3950},
        {n: "Timothy", x: 3600}, {n: "Silas", x: 3100}
    ];
    board.innerHTML = "<b>SCRIPTORIUM RANKINGS:</b><br>";
    names.forEach((p, i) => {
        board.innerHTML += `<div class="leaderboard-row ${p.n === 'YOU' ? 'user-row' : ''}">
            <span>${i+1}. ${p.n}</span> <span>${p.x} XP</span>
        </div>`;
    });
}
