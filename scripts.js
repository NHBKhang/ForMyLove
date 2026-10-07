// =========================================
// ❤️ LOVE HEART — SCRIPT
// =========================================
const bgMusic = document.getElementById("bgMusic");

// =========================================
// CONFIG
// =========================================
const LOVE_START_DATE = new Date(
    "2026-07-05T00:00:00"
);


// =========================================
// LOVE MESSAGES
// =========================================
const LOVE_MESSAGES = [
    "Trái tim này đập vì em ❤️",

    "Cảm ơn em vì đã bước vào cuộc đời anh",

    "Anh không cần một thế giới hoàn hảo, anh chỉ cần có em",

    "Nếu được chọn lại, anh vẫn sẽ chọn em",

    "Em là điều dịu dàng nhất từng đến với anh",

    "Anh yêu em. Hôm nay, ngày mai và cả những ngày sau nữa",

    "Có em bên cạnh, những ngày bình thường cũng trở nên đặc biệt",

    "Anh muốn cùng em đi qua thật nhiều mùa nữa",

    "Dù thế giới có thay đổi thế nào, anh vẫn muốn nắm tay em",

    "Cảm ơn em vì đã chọn anh"

];

// =========================================
// ELEMENTS
// =========================================
const heartButton =
    document.querySelector(".heart-button");

const heart =
    document.querySelector(".heart");

const pulse =
    document.querySelector(".pulse");

const message =
    document.querySelector(".love-message");

const counter =
    document.querySelector(".love-counter");

const particlesContainer =
    document.querySelector(".particles");


// =========================================
// MESSAGE STATE
// =========================================
let messageIndex = 0;

let finishedMessages = false;

// =========================================
// HEARTBEAT
// =========================================
let heartbeatCount = 0;

function heartbeat() {

    heartbeatCount++;

    createPulse();

    if (heartbeatCount % 2 === 0) {

        createFloatingHeart();

    }
}


// =========================================
// PULSE
// =========================================
function createPulse() {

    if (!pulse) return;

    pulse.classList.remove("active");

    void pulse.offsetWidth;

    pulse.classList.add("active");
}

// =========================================
// SHOW MESSAGE
// =========================================
function showNextMessage() {

    if (!message) return;

    // =========================================
    // Nếu đã hết message
    // =========================================

    if (messageIndex >= LOVE_MESSAGES.length) {

        finishedMessages = true;

        showIntro();

        return;
    }

    // =========================================
    // Fade out
    // =========================================
    message.style.opacity = "0";

    message.style.transform =
        "translateY(8px)";

    setTimeout(() => {

        message.textContent =
            LOVE_MESSAGES[messageIndex];


        message.style.opacity = "1";

        message.style.transform =
            "translateY(0)";

        messageIndex++;

    }, 180);
}

// =========================================
// CLICK HEART
// =========================================
if (heartButton) {
    heartButton.addEventListener(
        "click",
        () => {
            if (
                messageIndex >=
                LOVE_MESSAGES.length
            ) {

                transitionToIntroPage();

                return;
            }

            // =====================================
            // Heart animation
            // =====================================
            heart.classList.remove("clicked");

            void heart.offsetWidth;

            heart.classList.add("clicked");

            // =====================================
            // Show next message
            // =====================================
            showNextMessage();

            // =====================================
            // Create burst of hearts
            // =====================================
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {

                    createFloatingHeart(true);

                }, i * 80);
            }
        }
    );
}

// =========================================
// PAGE TRANSITION → INTRO
// =========================================
function transitionToIntroPage() {
    if (heartButton) {
        heartButton.style.pointerEvents =
            "none";
    }

    const transition =
        document.createElement("div");

    transition.className =
        "page-transition";

    transition.innerHTML = `
        <div class="transition-heart">
            ♥
        </div>
    `;

    document.body.appendChild(
        transition
    );

    requestAnimationFrame(() => {
        transition.classList.add("active");
    });
    
    if (bgMusic) {

        let volume =
            bgMusic.volume;

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
        window.location.href =
            "./intro/intro.html";

    }, 1200);
}

// =========================================
// FLOATING HEART
// =========================================
function createFloatingHeart(
    isClick = false
) {
    if (!particlesContainer) return;

    const smallHeart =
        document.createElement("span");

    smallHeart.classList.add(
        "floating-heart"
    );

    smallHeart.textContent = "♥";

    const randomX =
        Math.random() * 100;

    const randomDuration =
        3 + Math.random() * 4;

    const randomDelay =
        Math.random() * 0.5;

    smallHeart.style.left =
        `${randomX}% `;

    smallHeart.style.animationDuration =
        `${randomDuration} s`;

    smallHeart.style.animationDelay =
        `${randomDelay} s`;

    if (isClick) {
        smallHeart.classList.add(
            "from-click"
        );
    }

    particlesContainer.appendChild(
        smallHeart
    );

    setTimeout(() => {
        smallHeart.remove();
    }, (randomDuration + randomDelay) * 1000);
}

// =========================================
// LOVE COUNTER
// =========================================
function updateLoveCounter() {
    if (!counter) return;

    const now =
        new Date();

    const difference =
        now - LOVE_START_DATE;

    if (difference < 0) {
        counter.textContent =
            "Our story is about to begin ❤️";

        return;
    }

    const totalSeconds =
        Math.floor(
            difference / 1000
        );

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    counter.innerHTML = `
        <span>${days}</span> days 
        <span>${hours}</span> hours 
        <span>${minutes}</span> minutes 
        <span>${seconds}</span> seconds`;
}

// =========================================
// MOUSE LIGHT
// =========================================
document.addEventListener(
    "pointermove",
    (event) => {
        const x =
            event.clientX /
            window.innerWidth;

        const y =
            event.clientY /
            window.innerHeight;

        document.documentElement
            .style
            .setProperty(
                "--mouse-x",
                `${x * 100}% `
            );

        document.documentElement
            .style
            .setProperty(
                "--mouse-y",
                `${y * 100}% `
            );
    }
);

// =========================================
// INITIAL PARTICLES
// =========================================
function createInitialHearts() {
    for (
        let i = 0;
        i < 15;
        i++
    ) {
        setTimeout(() => {
            createFloatingHeart();
        }, i * 250);
    }
}

// =========================================
// START
// =========================================
createInitialHearts();

setInterval(
    heartbeat,
    1700
);

heartbeat();

updateLoveCounter();

setInterval(
    updateLoveCounter,
    1000
);

// =========================================
// START MUSIC
// =========================================
bgMusic.volume = 0;

function startMusic() {
    if (!bgMusic) return;

    bgMusic.play().then(() => {
        let volume = 0;

        const fadeIn = setInterval(() => {
            volume += 0.01;

            if (volume >= 0.35) {
                volume = 0.35;
                clearInterval(fadeIn);
            }

            bgMusic.volume = volume;
        }, 50);
    }).catch(() => {});

    document.removeEventListener("click", startMusic);
    document.removeEventListener("touchstart", startMusic);
}

document.addEventListener("click", startMusic);
document.addEventListener("touchstart", startMusic);