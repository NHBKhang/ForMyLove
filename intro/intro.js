const scenes = Array.from(document.querySelectorAll(".scene"));
const progressBar = document.querySelector(".film-progress span");
const bgMusic = document.getElementById("bgMusic");
const startScreen = document.getElementById("startScreen");

const TIMELINE = [
    { duration: 4800 },
    { duration: 6500 },
    { duration: 6000 },
    { duration: 5200 },
    { duration: 4800 },
    { duration: 5200 },
    { duration: 5200 },
    { duration: 4800 },
    { duration: 6500 },
    { duration: 5200 },
    { duration: 6200 },
    { duration: 5000 },
    { duration: 5000 },
    { duration: 5200 },
    { duration: 6200 },
    { duration: 5500 },
    { duration: 5200 },
    { duration: 7000 },
    { duration: 8000 },
    { duration: 6500 },
    { duration: 6200 },
    { duration: 6200 },
    { duration: 5000 },
    { duration: 5500 },
    { duration: 6000 }
];

let currentScene = 0;
let sceneStart = performance.now();
let musicStarted = false;
let filmStarted = false;
let heartTransitionStarted = false;
const FRIENDSHIP_START_DATE = new Date(2022, 6, 5);
const LOVE_START_DATE = new Date(2026, 4, 1);

function formatDate(date) {
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

function getDuration(startDate, endDate = new Date()) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
        months--;
        const previousMonth = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            0
        );
        days += previousMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

function updateDates() {
    const now = new Date();

    const friendship = getDuration(FRIENDSHIP_START_DATE, now);
    const love = getDuration(LOVE_START_DATE, now);

    const friendshipDateText = formatDate(FRIENDSHIP_START_DATE);
    const loveDateText = formatDate(LOVE_START_DATE);

    document.querySelectorAll(".friendship-date").forEach(element => {
        element.textContent = friendshipDateText;
    });

    document.querySelectorAll(".friendship-duration").forEach(element => {
        element.textContent = `${friendship.years} năm.`;
    });

    document.querySelectorAll(".love-date").forEach(element => {
        element.textContent = loveDateText;
    });

    document.querySelectorAll(".love-duration").forEach(element => {
        if (love.years > 0) {
            element.textContent = `${love.years} năm ${love.months} tháng.`;
        } else if (love.months > 0 && love.days > 0) {
            element.textContent = `${love.months} tháng ${love.days} ngày.`;
        } else if (love.months > 0) {
            element.textContent = `${love.months} tháng.`;
        } else {
            const totalDays = Math.floor(
                (now - LOVE_START_DATE) / 86400000
            );
            element.textContent = `${Math.max(0, totalDays)} ngày.`;
        }
    });
}

updateDates();

function startExperience() {
    if (filmStarted) return;

    filmStarted = true;

    if (startScreen) {
        startScreen.classList.add("hidden");
    }

    startMusic();

    currentScene = 0;
    sceneStart = performance.now();

    showScene(0);

    requestAnimationFrame(filmLoop);
}

function startMusic() {
    if (!bgMusic || musicStarted) return;

    bgMusic.volume = 0;

    bgMusic.play().then(() => {
        musicStarted = true;

        let volume = 0;

        const fadeIn = setInterval(() => {
            volume += 0.01;

            if (volume >= 0.32) {
                volume = 0.32;
                clearInterval(fadeIn);
            }

            bgMusic.volume = volume;
        }, 60);
    }).catch(() => {
        musicStarted = false;
    });
}

document.addEventListener("click", startExperience, { once: true });
document.addEventListener("touchstart", startExperience, { once: true });
document.addEventListener("keydown", startExperience, { once: true });

function showScene(index) {
    scenes.forEach((scene, i) => {
        scene.classList.toggle("active", i === index);
    });

    currentScene = index;
    sceneStart = performance.now();

    resetSceneAnimations();
}

function resetSceneAnimations() {
    const activeScene = scenes[currentScene];

    if (!activeScene) return;

    activeScene.querySelectorAll("*").forEach(element => {
        element.style.animation = "none";
        void element.offsetWidth;
        element.style.animation = "";
    });
}

function updateProgress(elapsed) {
    if (!progressBar) return;

    const totalDuration = TIMELINE.reduce(
        (sum, scene) => sum + scene.duration,
        0
    );

    let passed = 0;

    for (let i = 0; i < currentScene; i++) {
        passed += TIMELINE[i].duration;
    }

    passed += Math.min(
        elapsed,
        TIMELINE[currentScene].duration
    );

    progressBar.style.width =
        `${(passed / totalDuration) * 100}%`;
}

function goToHeart() {
    if (heartTransitionStarted) return;

    heartTransitionStarted = true;

    if (bgMusic) {
        let volume = bgMusic.volume;

        const fade = setInterval(() => {
            volume -= 0.01;

            if (volume <= 0) {
                volume = 0;
                bgMusic.pause();
                clearInterval(fade);
            }

            bgMusic.volume = volume;
        }, 80);
    }

    setTimeout(() => {
        window.location.href = "./../heart/heart.html";
    }, 4000);
}

function filmLoop(time) {
    if (!filmStarted) return;

    const elapsed = time - sceneStart;

    updateProgress(elapsed);

    if (currentScene === scenes.length - 1) {
        if (elapsed >= TIMELINE[currentScene].duration) {
            goToHeart();
            return;
        }
    } else if (elapsed >= TIMELINE[currentScene].duration) {
        showScene(currentScene + 1);
    }

    requestAnimationFrame(filmLoop);
}

showScene(0);

document.addEventListener("dblclick", () => {
    if (!filmStarted) return;

    if (currentScene < scenes.length - 1) {
        showScene(currentScene + 1);
    } else {
        goToHeart();
    }
});