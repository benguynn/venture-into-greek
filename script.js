let vaultData = [];
let state = { step: 0, current: null };

async function initVault() {
    try {
        const res = await fetch('vault.json');
        vaultData = await res.json();
        document.getElementById('screen-loader').style.opacity = '0';
        setTimeout(() => document.getElementById('screen-loader').style.display = 'none', 800);
        showScreen('screen-menu');
    } catch (e) {
        alert("Silo connection error. Verify vault.json is present.");
    }
}

function showScreen(id) {
    playSound('snd-paper');
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id === 'screen-map') renderMap();
    if(id === 'screen-game') nextLesson();
}

function renderMap() {
    const grid = document.getElementById('chapter-grid');
    grid.innerHTML = '';
    for(let i=1; i<=36; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = i > 1 ? 'locked' : '';
        btn.onclick = () => i === 1 ? showScreen('screen-game') : null;
        grid.appendChild(btn);
    }
}

function nextLesson() {
    state.current = vaultData[state.step % vaultData.length];
    const display = document.getElementById('ink-display');
    const braid = document.getElementById('interaction-braid');
    const bubble = document.getElementById('chat-bubble');
    
    braid.innerHTML = '';
    display.innerText = state.current.q;
    bubble.innerText = state.current.why;
    
    let chars = state.current.q.split('');
    let shuffled = [...chars].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(c => {
        const btn = document.createElement('button');
        btn.innerText = c;
        btn.onclick = () => {
            if(c === chars[0]) {
                playSound('snd-ink');
                chars.shift();
                btn.style.opacity = '0.1';
                btn.disabled = true;
                if(chars.length === 0) {
                    state.step++;
                    setTimeout(nextLesson, 600);
                }
            } else {
                triggerError();
            }
        };
        braid.appendChild(btn);
    });
}

function playSound(id) {
    const s = document.getElementById(id);
    s.currentTime = 0;
    s.play().catch(()=>{});
}

function triggerError() {
    document.body.classList.add('shake');
    if(navigator.vibrate) navigator.vibrate(80);
    setTimeout(() => document.body.classList.remove('shake'), 400);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}
async function loadPersonnelIcons() {
    try {
        const response = await fetch('dinosaur_sketches.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // Example: Pull the Velociraptor SVG to start
        const raptorSvg = doc.querySelector('.sketch-card:nth-child(1) svg');
        if (raptorSvg) {
            document.getElementById('char-icon').innerHTML = raptorSvg.outerHTML;
        }
    } catch (e) {
        console.warn("Could not retrieve personnel sketches from silo.");
    }
}

// Trigger this when the game starts
window.addEventListener('DOMContentLoaded', loadPersonnelIcons);
