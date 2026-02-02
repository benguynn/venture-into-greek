const PERSONNEL = {
    theophilus: { icon: "📜", msg: "Welcome to the archives. We are here to restore what was lost." },
    silvanus: { icon: "🧥", msg: "I've got the manuscripts. Keep them hidden, keep them safe." },
    celsus: { icon: "🗡️", msg: "You really think this ink is reliable? I have my doubts." }
};

const CHAPTER_1 = [
    { q: "ἀλήθεια", a: "Truth", why: "Silvanus Smuggle: Pilate stood before this word and asked 'What is truth?'", type: "intro" },
    { q: "λόγος", a: "Word", why: "Theophilus: The divine logic that John claims became a man.", type: "intro" }
];

let state = { act: 1, step: 0, errors: 0 };

// INTEL CRAWL SEQUENCE
setTimeout(() => {
    document.getElementById('screen-intro').style.display = 'none';
    document.getElementById('screen-menu').style.display = 'flex';
}, 3000);

function startChapter(num) {
    document.getElementById('screen-menu').style.display = 'none';
    document.getElementById('screen-game').style.display = 'flex';
    loadStage();
}

function loadStage() {
    const display = document.getElementById('greek-main');
    const bubble = document.getElementById('chat-bubble');
    const port = document.getElementById('person-portrait');
    const grid = document.getElementById('interaction-grid');

    let item = CHAPTER_1[state.step % CHAPTER_1.length];
    grid.innerHTML = '';
    
    // Act 1: Intro Logic (Silvanus as Smuggler)
    display.innerText = item.q;
    port.innerText = PERSONNEL.silvanus.icon;
    bubble.innerText = item.why;

    ["Truth", "Word", "Life"].forEach(choice => {
        const b = document.createElement('button');
        b.className = "btn-main";
        b.innerText = choice;
        b.onclick = () => handleAnswer(choice === item.a);
        grid.appendChild(b);
    });
}

function handleAnswer(correct) {
    if(!correct) {
        state.errors++;
        document.querySelector('.main-stage').classList.add('shake');
        setTimeout(() => document.querySelector('.main-stage').classList.remove('shake'), 400);
        return;
    }
    state.step++;
    // Act 1 is "almost automatic" - simple progression
    loadStage();
}
