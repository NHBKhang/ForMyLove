const scenes = Array.from(document.querySelectorAll(".scene"));
const progressBar = document.querySelector(".film-progress span");
const bgMusic = document.getElementById("bgMusic");
const startScreen = document.getElementById("startScreen");

const TIMELINE = [
    // 01 — Opening
    { duration: 5000 },

    // 02 — Chúng ta là bạn
    { duration: 6500 },

    // 03 — Những ngày cũ
    { duration: 5200 },

    // 04 — Kỷ niệm
    { duration: 4800 },

    // 05 — Mọi thứ khác đi
    { duration: 4800 },

    // 06 — Bắt đầu để ý
    { duration: 5700 },

    // 07 — Nghĩ rằng chỉ là tình bạn
    { duration: 5700 },

    // 08 — Người anh không dám hy vọng
    { duration: 5200 },

    // 09 — Bắt đầu nhớ
    { duration: 5200 },

    // 10 — Một ngày không nói chuyện
    { duration: 5200 },

    // 11 — Những điều nhỏ bé
    { duration: 5900 },

    // 12 — Em không còn là bạn
    { duration: 5200 },

    // 13 — Sợ nói ra
    { duration: 5700 },

    // 14 — Sợ mất em
    { duration: 5000 },

    // 15 — Không thể giả vờ
    { duration: 6000 },

    // 16 — Bắt đầu nói về nhau
    { duration: 5200 },

    // 17 — Những điều từng giấu
    { duration: 6700 },

    // 18 — Những điều em từng giấu
    { duration: 5800 },

    // 19 — Không còn khoảng cách
    { duration: 6000 },

    // 20 — Chúng ta đã khóc
    { duration: 5100 },

    // 21 — Cuối cùng cũng thật lòng
    { duration: 6500 },

    // 22 — Không cần giấu cảm xúc
    { duration: 5200 },

    // 23 — Chỉ cần ở bên nhau
    { duration: 5800 },

    // 24 — Anh đã thương em từ lâu
    { duration: 6000 },

    // 25 — Gọi tên cảm xúc
    { duration: 5600 },

    // 26 — Anh nói yêu em
    { duration: 6200 },

    // 27 — Chờ câu trả lời
    { duration: 7000 },

    // 28 — Em đồng ý ❤️
    { duration: 7500 },

    // 29 — Niềm vui
    { duration: 5000 },

    // 30 — Em thật sự chọn anh
    { duration: 6500 },

    // 31 — Điều làm anh hạnh phúc
    { duration: 6000 },

    // 32 — Một người anh nghĩ không thể có
    { duration: 6500 },

    // 33 — Chính thức thành đôi
    { duration: 5800 },

    // 34 — Khoảng thời gian bên nhau
    { duration: 6700 },

    // 35 — Kỷ niệm cũ
    { duration: 6500 },

    // 36 — Những bức ảnh của chúng ta
    { duration: 7200 },

    // 37 — Ngày thay đổi mọi thứ
    { duration: 6500 },

    // 38 — Anh không đủ tốt
    { duration: 6000 },

    // 39 — Em ở bên anh
    { duration: 6800 },

    // 40 — Câu chuyện của chúng ta
    { duration: 6500 },

    // FINAL — Anh vẫn chọn em
    { duration: 7500 },

    // HEART — chuyển sang trái tim
    { duration: 5200 }
];

let currentScene = 0;
let sceneStart = performance.now();
let musicStarted = false;
let filmStarted = false;
let heartTransitionStarted = false;
const FRIENDSHIP_START_DATE = new Date(2022, 2, 1);
const LOVE_START_DATE = new Date(2026, 6, 5);

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