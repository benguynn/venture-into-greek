const ROOTS_DATA = [
    { root: "θε-", act1: "θεός", act2: "θεότης", why: "John 1:1 uses 'Theos' to define the Nature of the Word." },
    { root: "λογ-", act1: "λόγος", act2: "λογικός", why: "Scripture claims the universe is sustained by a divine 'Logos'." },
    { root: "ζω-", act1: "ζωή", act2: "ζωοποιέω", why: "Jesus said, 'I am the Resurrection and the Life (Zoe).'" },
    { root: "ἀληθ-", act1: "ἀλήθεια", act2: "ἀληθινός", why: "Pilate asked: 'What is Truth?' while standing before the Aletheia." }
];

const STATE = { chapter: 1, act: 1, totalCorrect: 0 };

// 1. INTEL CRAWL START
setTimeout(() => {
    document.getElementById('screen-intro').style.display = 'none';
    document.getElementById('screen-title').style.display = 'flex';
}, 3000);

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
    if(id === 'screen-map') generateMap();
}

function generateMap() {
    const grid = document.getElementById('chapter-grid');
    grid.innerHTML = '';
    for(let i=1; i<=36; i++) {
        const node = document.createElement('div');
        node.className = `chap-node ${i > STATE.chapter ? 'locked' : ''}`;
        node.innerText = i;
        if(i === 1) node.onclick = () => startChapter(1);
        grid.appendChild(node);
    }
}

function startChapter(num) {
    STATE.chapter = num;
    showScreen('screen-game');
    loadGame();
}

function loadGame() {
    const display = document.getElementById('greek-display');
    const bubble = document.getElementById('intel-bubble');
    const grid = document.getElementById('interaction-grid');
    
    // Act 1 logic (The Crawl)
    display.innerText = "ἀλήθεια";
    bubble.innerText = "Pilate stood before the 'Aletheia' (Truth) and didn't recognize it.";
    
    // Multiple variations of questions...
    ["Truth", "World", "Sin"].forEach(choice => {
        const btn = document.createElement('button');
        btn.innerText = choice;
        btn.onclick = () => handleCorrect();
        grid.appendChild(btn);
    });
}

function handleCorrect() {
    STATE.totalCorrect++;
    // Add logic for transitions and Act switching
    loadGame();
}

function enter() {
    if(document.getElementById('pass').value.toUpperCase() === "VIG") {
        showScreen('screen-title');
    }
}
