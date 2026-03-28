// --- stars ---
function createStars() {
    const container = document.getElementById('starsContainer');
    for (let i = 0; i < 220; i++) {
        let star = document.createElement('div');
        star.classList.add('star');
        let size = Math.random() * 3 + 1.5;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 6 + 's';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';
        container.appendChild(star);
    }
}
createStars();

// --- floating nur particles ---
function createNurParticles(count = 45) {
    const container = document.getElementById('nurContainer');
    for (let i = 0; i < count; i++) {
        let p = document.createElement('div');
        p.classList.add('nur-particle');
        let s = Math.random() * 35 + 15;
        p.style.width = s + 'px';
        p.style.height = s + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDuration = Math.random() * 12 + 8 + 's';
        p.style.animationDelay = Math.random() * 8 + 's';
        container.appendChild(p);
    }
}
createNurParticles(45);

// --- Shooting stars - fixed downward direction ---
function createShootingStar() {
    const container = document.getElementById('shootingStarsContainer');
    const star = document.createElement('div');
    star.classList.add('shooting-star');

    const startX = Math.random() * 100;
    const drift = (Math.random() * 300) - 100;
    const duration = 1 + Math.random() * 0.8;

    star.style.left = startX + '%';
    star.style.top = '-70px';
    star.style.setProperty('--drift', drift + 'px');
    star.style.animationDuration = duration + 's';

    container.appendChild(star);
    setTimeout(() => star.remove(), duration * 1000);
}

// --- scene sequence and scroll ---
const scenes = document.querySelectorAll('.scene');
let current = 0;
let timer = null;
let playing = false;

function smoothScrollToScene(sceneElement) {
    if (!sceneElement) return;
    requestAnimationFrame(() => {
        sceneElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    });
}

function resetScenes() {
    scenes.forEach(s => s.classList.remove('visible'));
    current = 0;
    if (timer) clearTimeout(timer);
}

function playSequence() {
    if (current < scenes.length) {
        const scene = scenes[current];
        scene.classList.add('visible');
        setTimeout(() => {
            if (scene.classList.contains('visible')) {
                smoothScrollToScene(scene);
            }
        }, 20);
        current++;
        timer = setTimeout(playSequence, 2600);
    } else {
        playing = false;
        timer = null;
    }
}

function startSequence() {
    if (playing) return;
    resetScenes();
    playing = true;
    playSequence();
    setTimeout(() => {
        const firstScene = scenes[0];
        if (firstScene) smoothScrollToScene(firstScene);
    }, 100);
}

// --- Audio setup ---
const audio = document.getElementById('nasheedAudio');
function playAudioFromThree() {
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play error:", e));
}

// --- Flower burst effect ---
function burstFlowers(buttonElement) {
    const rect = buttonElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const flowerIcons = ['🌸', '🌺', '🌼', '🌷', '🌻', '🌸', '🌼', '🌸', '🌷'];
    const colors = ['#ffb7c5', '#ffc4a2', '#ffd9b5', '#ffafc2', '#ffddc4', '#ffe0cc'];

    const petalCount = 45; // number of flowers

    for (let i = 0; i < petalCount; i++) {
        const flower = document.createElement('div');
        flower.classList.add('flower-burst');

        // Random flower icon
        const icon = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];
        flower.innerHTML = icon;

        // Random initial displacement (dx, dy)
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 20;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 30; // slight upward bias
        const rot = Math.random() * 360;

        // Custom properties for animation
        flower.style.setProperty('--dx', dx + 'px');
        flower.style.setProperty('--dy', dy + 'px');
        flower.style.setProperty('--rot', rot + 'deg');

        flower.style.left = (centerX - 10) + 'px';
        flower.style.top = (centerY - 10) + 'px';
        flower.style.fontSize = (Math.random() * 14 + 12) + 'px';
        flower.style.color = colors[Math.floor(Math.random() * colors.length)];

        // Random delay for staggered effect
        flower.style.animationDelay = (Math.random() * 0.1) + 's';

        document.body.appendChild(flower);

        // Remove after animation
        setTimeout(() => {
            flower.remove();
        }, 1200);
    }
}

// --- Start everything on button click ---
const startBtn = document.getElementById('startButton');
const playOverlay = document.getElementById('playOverlay');
const contentWrapper = document.getElementById('contentWrapper');
const replayBtn = document.getElementById('replayBtn');

let started = false;
let shootingInterval = null;

startBtn.addEventListener('click', (event) => {
    if (started) return;
    started = true;

    // Trigger flower burst
    burstFlowers(startBtn);

    // Slight delay to enjoy the burst before hiding overlay
    setTimeout(() => {
        playOverlay.classList.add('hide');
        contentWrapper.classList.add('active');
        startSequence();
        playAudioFromThree();

        if (!shootingInterval) {
            shootingInterval = setInterval(() => createShootingStar(), 4800);
        }
    }, 200);
});

replayBtn.addEventListener('click', () => {
    if (timer) clearTimeout(timer);
    startSequence();
    audio.currentTime = 0;
    if (audio.paused) {
        audio.play().catch(() => { });
    }
});

contentWrapper.classList.remove('active');