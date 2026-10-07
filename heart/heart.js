// =========================================
// CINEMATIC HEART
// =========================================
const canvas = document.querySelector("#heartCanvas");

const ctx = canvas.getContext("2d", { alpha: true });

let width = 0;
let height = 0;

let centerX = 0;
let centerY = 0;

let scale = 1;

// =========================================
// CONFIG
// =========================================
const isMobile =
    window.innerWidth <= 600;

const PARTICLE_COUNT =
    isMobile ? 1000 : 1800;

const FLOATING_COUNT =
    isMobile ? 60 : 120;

const OUTLINE_COUNT =
    isMobile ? 220 : 360;

const CORE_COUNT =
    isMobile ? 70 : 120;

const OUTER_DUST_COUNT =
    isMobile ? 40 : 75;

const HEARTBEAT_DURATION = 1700;

const HEART_COLORS = [
    {
        color: "rgb(210, 15, 35)",
        weight: 55
    },
    {
        color: "rgb(255, 45, 65)",
        weight: 25
    },
    {
        color: "rgb(255, 105, 135)",
        weight: 10
    },
    {
        color: "rgb(190, 55, 145)",
        weight: 5
    },
    {
        color: "rgb(255, 105, 65)",
        weight: 3
    },
    {
        color: "rgb(255, 190, 195)",
        weight: 2
    }
];

// =========================================
// DATA
// =========================================
const particles = [];

const floatingParticles = [];

const outlineParticles = [];

const coreParticles = [];

const outerDust = [];

const escapedParticles = [];

const shockwaves = [];

// =========================================
// RESIZE
// =========================================
function resizeCanvas() {
    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            1.5
        );

    width = window.innerWidth;

    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);

    canvas.height = Math.floor(height * dpr);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    centerX = width / 2;
    centerY = height / 2;

    scale = Math.min(width, height) / 37;
}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

// =========================================
// HEART EQUATION
// =========================================
function heartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return { x, y };
}

// =========================================
// RANDOM COLOR PARTICLES
// =========================================
function randomHeartColor() {
    const random = Math.random() * 100;

    let total = 0;

    for (
        const item of HEART_COLORS
    ) {

        total += item.weight;

        if (
            random <= total
        ) {

            return item.color;
        }
    }

    return "rgb(230, 20, 40)";
}

// =========================================
// PARTICLES
// =========================================
function createParticles() {
    particles.length = 0;

    for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
    ) {
        const t =
            Math.random() *
            Math.PI *
            2;

        const point =
            heartPoint(t);


        const fill =
            Math.sqrt(
                Math.random()
            );

        const overflow =
            Math.random() < 0.22
                ? 1 +
                Math.random() * 0.08
                : 1;

        const targetX =
            point.x *
            fill *
            overflow;

        const targetY =
            point.y *
            fill *
            overflow;

        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            Math.max(
                width,
                height
            ) *
            (
                0.4 +
                Math.random() * 0.5
            );

        particles.push({

            x:
                Math.cos(angle) *
                distance,

            y:
                Math.sin(angle) *
                distance,

            targetX,
            targetY,

            color: randomHeartColor(),

            size:
                overflow > 1
                    ? 0.3 +
                    Math.random() * 0.7
                    : 0.4 +
                    Math.random() * 1.0,

            alpha:
                overflow > 1
                    ? 0.12 +
                    Math.random() * 0.28
                    : 0.28 +
                    Math.random() * 0.62,

            phase:
                Math.random() *
                Math.PI *
                2,

            drift:
                0.08 +
                Math.random() * 0.55,

            speed:
                0.0003 +
                Math.random() * 0.0007
        });
    }
}

createParticles();

// =========================================
// FLOATING PARTICLES
// =========================================
function createFloatingParticles() {
    floatingParticles.length = 0;

    for (
        let i = 0;
        i < FLOATING_COUNT;
        i++
    ) {
        floatingParticles.push({

            angle:
                Math.random() *
                Math.PI *
                2,

            radius:
                Math.min(
                    width,
                    height
                ) *
                (
                    0.38 +
                    Math.random() * 0.42
                ),

            speed:
                0.000025 +
                Math.random() * 0.00009,

            size:
                0.3 +
                Math.random() * 0.7,

            alpha:
                0.05 +
                Math.random() * 0.16,

            phase:
                Math.random() *
                Math.PI *
                2
        });
    }
}

createFloatingParticles();

// =========================================
// OUTLINE PARTICLES
// =========================================
function createOutlineParticles() {
    outlineParticles.length = 0;

    for (
        let i = 0;
        i < OUTLINE_COUNT;
        i++
    ) {
        const t =
            (
                i /
                OUTLINE_COUNT
            ) *
            Math.PI *
            2;

        const point =
            heartPoint(t);

        outlineParticles.push({

            x: point.x,

            y: point.y,

            size:
                0.25 +
                Math.random() * 0.55,

            alpha:
                0.12 +
                Math.random() * 0.28,

            phase:
                Math.random() *
                Math.PI *
                2,

            drift:
                0.04 +
                Math.random() * 0.16
        });
    }
}

createOutlineParticles();

// =========================================
// CORE PARTICLES
// =========================================
function createCoreParticles() {
    coreParticles.length = 0;

    for (
        let i = 0;
        i < CORE_COUNT;
        i++
    ) {
        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            Math.sqrt(
                Math.random()
            ) * 7;

        coreParticles.push({

            x:
                Math.cos(angle) *
                radius,

            y:
                Math.sin(angle) *
                radius *
                0.72,

            size:
                0.2 +
                Math.random() * 0.5,

            alpha:
                0.025 +
                Math.random() * 0.075,

            phase:
                Math.random() *
                Math.PI *
                2,

            drift:
                0.04 +
                Math.random() * 0.12
        });
    }
}

createCoreParticles();

// =========================================
// OUTER DUST
// =========================================
function createOuterDust() {
    outerDust.length = 0;

    for (
        let i = 0;
        i < OUTER_DUST_COUNT;
        i++
    ) {
        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            17 +
            Math.random() * 13;

        outerDust.push({
            x:
                Math.cos(angle) *
                radius,

            y:
                Math.sin(angle) *
                radius *
                (
                    0.72 +
                    Math.random() * 0.15
                ),

            size:
                0.18 +
                Math.random() * 0.42,

            alpha:
                0.025 +
                Math.random() * 0.09,

            phase:
                Math.random() *
                Math.PI *
                2,

            drift:
                0.08 +
                Math.random() * 0.25
        });
    }
}

createOuterDust();

// =========================================
// ESCAPED PARTICLES
// =========================================
function createEscapedParticles() {
    const count = 2 + Math.floor(Math.random() * 3);

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const t =
            Math.random() *
            Math.PI *
            2;

        const point =
            heartPoint(t);

        const length =
            Math.sqrt(
                point.x *
                point.x +
                point.y *
                point.y
            );

        const normalX = point.x / length;

        const normalY = point.y / length;

        const startOffset =
            0.2 +
            Math.random() * 0.25;

        escapedParticles.push({

            x:
                point.x +
                normalX *
                startOffset,

            y:
                point.y +
                normalY *
                startOffset,

            vx:
                normalX *
                (
                    0.018 +
                    Math.random() * 0.025
                ),

            vy:
                normalY *
                (
                    0.018 +
                    Math.random() * 0.025
                ),

            size:
                0.3 +
                Math.random() * 0.45,

            alpha:
                0.25 +
                Math.random() * 0.2,

            life: 1,

            decay:
                0.005 +
                Math.random() * 0.003,

            drift:
                Math.random() *
                Math.PI *
                2
        });
    }

    if (
        escapedParticles.length > 18
    ) {

        escapedParticles.splice(
            0,
            escapedParticles.length - 18
        );
    }
}

// =========================================
// HEARTBEAT
// =========================================
const heartbeatStart =
    performance.now();

// =========================================
// SMOOTH EASING
// =========================================
function smootherStep(t) {
    t =
        Math.max(
            0,
            Math.min(1, t)
        );

    return (
        t *
        t *
        t *
        (
            t *
            (
                t * 6 - 15
            ) +
            10
        )
    );
}

// =========================================
// HEARTBEAT CURVE
// =========================================
function getHeartbeat(time) {
    const elapsed =
        (
            time -
            heartbeatStart
        ) %
        HEARTBEAT_DURATION;


    // REST
    if (elapsed < 500) {
        return 1;
    }

    // FIRST BEAT
    if (elapsed < 650) {

        const t =
            (
                elapsed -
                500
            ) / 150;

        return (
            1 +
            smootherStep(t) *
            0.035
        );
    }

    // FIRST RETURN
    if (elapsed < 790) {

        const t =
            (
                elapsed -
                650
            ) / 140;

        return (
            1.035 -
            smootherStep(t) *
            0.035
        );
    }

    // SMALL REST
    if (elapsed < 860) {
        return 1;
    }

    // SECOND BEAT
    if (elapsed < 1080) {

        const t =
            (
                elapsed -
                860
            ) / 220;

        return (
            1 +
            smootherStep(t) *
            0.065
        );
    }

    // SECOND RETURN
    if (elapsed < 1280) {

        const t =
            (
                elapsed -
                1080
            ) / 200;

        return (
            1.065 -
            smootherStep(t) *
            0.065
        );
    }

    // LONG REST

    return 1;
}

// =========================================
// HEARTBEAT INTENSITY
// =========================================
function getBeatIntensity(
    beat
) {
    return Math.max(
        0,
        Math.min(
            1,
            (
                beat - 1
            ) / 0.065
        )
    );
}

// =========================================
// SHOCKWAVE
// =========================================
function createShockwave(
    strength = 1
) {
    shockwaves.push({

        radius:
            scale * 10,

        alpha:
            0.11 *
            strength,

        speed:
            1.4 *
            strength,

        maxRadius:
            scale * 23
    });

    if (
        shockwaves.length > 3
    ) {

        shockwaves.shift();
    }
}

// =========================================
// DRAW SHOCKWAVE
// =========================================
function drawShockwaves() {
    for (
        let i =
            shockwaves.length - 1;

        i >= 0;

        i--
    ) {
        const wave =
            shockwaves[i];

        wave.radius +=
            wave.speed;

        wave.alpha *=
            0.975;

        const progress =
            wave.radius /
            wave.maxRadius;

        if (
            progress >= 1 ||
            wave.alpha < 0.004
        ) {

            shockwaves.splice(
                i,
                1
            );

            continue;
        }

        ctx.save();

        ctx.globalAlpha =
            wave.alpha *
            (
                1 -
                progress
            );

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            wave.radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "rgba(255, 105, 125, 1)";

        ctx.lineWidth =
            0.45;

        ctx.shadowColor =
            "rgba(255, 70, 95, 0.3)";

        ctx.shadowBlur =
            4;

        ctx.stroke();

        ctx.restore();
    }
}

// =========================================
// DRAW FLOATING PARTICLES
// =========================================
function drawFloatingParticles(
    time,
    beat
) {
    ctx.fillStyle =
        "rgb(255, 105, 125)";

    for (
        let i = 0;
        i < floatingParticles.length;
        i++
    ) {

        const particle =
            floatingParticles[i];

        particle.angle +=
            particle.speed;

        const pulse =
            Math.sin(
                time * 0.0007 +
                particle.phase
            );

        const radius =
            particle.radius +
            pulse * 4 +
            (
                beat - 1
            ) * 18;

        const x =
            centerX +
            Math.cos(
                particle.angle
            ) *
            radius;

        const y =
            centerY +
            Math.sin(
                particle.angle
            ) *
            radius *
            0.72;

        const size =
            particle.size *
            (
                0.85 +
                pulse * 0.12
            );

        ctx.globalAlpha =
            particle.alpha;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

// =========================================
// DRAW OUTER DUST
// =========================================
function drawOuterDust(
    time,
    intensity
) {
    for (
        let i = 0;
        i < outerDust.length;
        i++
    ) {
        const particle =
            outerDust[i];

        const driftX =
            Math.sin(
                time * 0.00035 +
                particle.phase
            ) *
            particle.drift;

        const driftY =
            Math.cos(
                time * 0.0003 +
                particle.phase
            ) *
            particle.drift;

        const x =
            centerX +
            (
                particle.x +
                driftX
            ) *
            scale;

        const y =
            centerY -
            (
                particle.y +
                driftY
            ) *
            scale;

        const pulse =
            Math.sin(
                time * 0.0008 +
                particle.phase
            );

        ctx.globalAlpha =
            particle.alpha *
            (
                0.8 +
                pulse * 0.2 +
                intensity * 0.25
            );

        ctx.fillStyle =
            "rgb(255, 105, 125)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

// =========================================
// DRAW HEART OUTLINE
// =========================================
function drawHeartOutline(
    time,
    heartScale,
    intensity
) {
    ctx.save();
    ctx.globalCompositeOperation =
        "source-over";

    // VERY SOFT ENERGY LINE
    ctx.beginPath();

    const steps = 220;

    for (
        let i = 0;
        i <= steps;
        i++
    ) {
        const t =
            (
                i / steps
            ) *
            Math.PI *
            2;

        const point =
            heartPoint(t);

        const x =
            centerX +
            point.x *
            heartScale;

        const y =
            centerY -
            point.y *
            heartScale;

        if (i === 0) {
            ctx.moveTo(
                x,
                y
            );

        } else {
            ctx.lineTo(
                x,
                y
            );
        }
    }

    ctx.closePath();

    ctx.strokeStyle =
        `rgba(
        255,
        120,
        140,
        ${0.1 + intensity * 0.15}
    )`;

    ctx.lineWidth = 0.9;

    ctx.shadowColor =
        "rgba(255, 80, 105, 0.25)";

    ctx.shadowBlur = 4;

    ctx.stroke();

    ctx.shadowBlur = 0;

    ctx.restore();

    // OUTLINE PARTICLES
    for (
        let i = 0;
        i < outlineParticles.length;
        i++
    ) {
        const particle =
            outlineParticles[i];

        const pulse =
            Math.sin(
                time * 0.001 +
                particle.phase
            );

        const x =
            centerX +
            (
                particle.x +
                Math.sin(
                    time * 0.0007 +
                    particle.phase
                ) *
                particle.drift
            ) *
            heartScale;

        const y =
            centerY -
            (
                particle.y +
                Math.cos(
                    time * 0.0008 +
                    particle.phase
                ) *
                particle.drift
            ) *
            heartScale;

        const size =
            particle.size *
            (
                0.9 +
                pulse * 0.1 +
                intensity * 0.18
            );

        const alpha =
            particle.alpha *
            (
                0.7 +
                intensity * 0.45
            );

        ctx.globalAlpha =
            Math.min(
                alpha,
                0.45
            );

        ctx.fillStyle =
            "rgb(255, 125, 145)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.globalAlpha = 1;

    ctx.restore();
}

// =========================================
// DRAW HEART AURA
// =========================================
function drawHeartAura(
    heartScale,
    intensity
) {
    const radius = heartScale * 14;

    const glow =
        ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            radius
        );

    glow.addColorStop(
        0,
        `rgba(
            255,
            35,
            70,
            ${0.045 +
        intensity * 0.055
        }
        )`
    );

    glow.addColorStop(
        0.25,
        `rgba(
            255,
            45,
            75,
            ${0.035 +
        intensity * 0.035
        }
        )`
    );

    glow.addColorStop(
        0.6,
        `rgba(
            255,
            35,
            70,
            ${0.018 +
        intensity * 0.018
        }
        )`
    );

    glow.addColorStop(
        1,
        "rgba(255, 35, 70, 0)"
    );

    ctx.fillStyle =
        glow;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

// =========================================
// DRAW HEART CORE
// =========================================
function drawHeartCore(
    time,
    heartScale,
    intensity
) {
    for (
        let i = 0;
        i < coreParticles.length;
        i++
    ) {
        const particle =
            coreParticles[i];

        const pulse =
            Math.sin(
                time * 0.001 +
                particle.phase
            );

        const x =
            centerX +
            (
                particle.x +
                Math.sin(
                    time * 0.0007 +
                    particle.phase
                ) *
                particle.drift
            ) *
            heartScale;

        const y =
            centerY -
            (
                particle.y +
                Math.cos(
                    time * 0.0008 +
                    particle.phase
                ) *
                particle.drift
            ) *
            heartScale;

        const size =
            particle.size *
            (
                0.9 +
                pulse * 0.1 +
                intensity * 0.3
            );

        const alpha =
            particle.alpha *
            (
                1 +
                intensity * 1.6
            );

        ctx.globalAlpha =
            Math.min(
                alpha,
                0.2
            );

        ctx.fillStyle =
            "rgb(255, 170, 180)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

// =========================================
// DRAW HEART PARTICLES
// =========================================
function drawHeartParticles(
    time,
    heartScale,
    beat,
    intensity
) {
    for (
        let i = 0;
        i < particles.length;
        i++
    ) {
        const particle =
            particles[i];

        // Smooth movement vào vị trí heart
        particle.x +=
            (
                particle.targetX -
                particle.x
            ) * 0.018;

        particle.y +=
            (
                particle.targetY -
                particle.y
            ) * 0.018;


        // Chuyển động rất nhẹ
        const driftX =
            Math.sin(
                time * particle.speed +
                particle.phase
            ) *
            particle.drift;

        const driftY =
            Math.cos(
                time *
                particle.speed *
                0.8 +
                particle.phase
            ) *
            particle.drift;

        // ==============================
        // DEPTH
        // ==============================
        const depth =
            particle.depth ?? 0.5;

        const depthScale =
            0.82 +
            depth * 0.28;

        const depthAlpha =
            0.78 +
            depth * 0.30;

        // ==============================
        // DISTANCE FROM CENTER
        // ==============================
        const distance =
            Math.sqrt(
                particle.targetX *
                particle.targetX +

                particle.targetY *
                particle.targetY
            );

        const inner =
            1 -
            Math.min(
                1,
                distance / 22
            );

        // ==============================
        // SUBTLE INTERNAL LIGHT
        // ==============================
        const flow =
            (
                Math.sin(
                    time * 0.00045 +
                    particle.phase +
                    distance * 0.7
                ) + 1
            ) * 0.5;

        // ==============================
        // POSITION
        // ==============================
        const x =
            centerX +
            (
                particle.x +
                driftX
            ) *
            heartScale;

        const y =
            centerY -
            (
                particle.y +
                driftY
            ) *
            heartScale;

        // ==============================
        // SIZE
        // ==============================
        const size =
            particle.size *
            depthScale *
            (
                1.15 +
                (beat - 1) * 0.3
            );

        // ==============================
        // ALPHA
        // ==============================
        const alpha =
            particle.alpha *
            depthAlpha *
            (
                1.15 +
                inner * 0.18 +
                flow * 0.06 +
                intensity * 0.18
            );

        ctx.globalAlpha = Math.min(alpha, 1);

        // ==============================
        // COLOR
        // ==============================
        let color =
            particle.color;
        if (
            depth > 0.78 &&
            particle.color !== "rgb(190, 55, 145)"
        ) {
            color =
                particle.color;

        }

        ctx.fillStyle =
            color;

        if (
            depth > 0.78 &&
            intensity > 0.15
        ) {
            ctx.shadowColor =
                "rgba(255, 25, 45, 0.65)";

            ctx.shadowBlur =
                4 + intensity * 4;

        } else {
            ctx.shadowBlur = 0;
        }

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

// =========================================
// DRAW ESCAPED PARTICLES
// =========================================
function drawEscapedParticles(
    time
) {
    for (
        let i =
            escapedParticles.length - 1;

        i >= 0;

        i--
    ) {
        const particle =
            escapedParticles[i];

        // MOVEMENT
        particle.x +=
            particle.vx;

        particle.y +=
            particle.vy;


        particle.vx *=
            0.992;

        particle.vy *=
            0.992;

        const drift =
            Math.sin(
                time * 0.001 +
                particle.drift
            ) *
            0.0015;

        particle.x +=
            drift;

        // LIFE
        particle.life -=
            particle.decay;

        if (
            particle.life <= 0
        ) {
            escapedParticles.splice(
                i,
                1
            );

            continue;
        }

        // FADE
        const alpha =
            particle.alpha *
            particle.life;

        const size =
            particle.size *
            (
                0.45 +
                particle.life *
                0.55
            );

        const x =
            centerX +
            particle.x *
            scale;

        const y =
            centerY -
            particle.y *
            scale;

        ctx.save();

        ctx.globalAlpha =
            alpha;

        ctx.fillStyle =
            "rgb(255, 120, 140)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}

// =========================================
// DRAW HEART BODY GLOW
// =========================================
function drawHeartBodyGlow(
    heartScale,
    intensity
) {
    const gradient =
        ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            heartScale * 18
        );

    gradient.addColorStop(
        0,
        `rgba(
            255,
            45,
            75,
            ${0.045 + intensity * 0.035}
        )`
    );

    gradient.addColorStop(
        0.35,
        `rgba(
            255,
            45,
            75,
            ${0.025 + intensity * 0.025}
        )`
    );

    gradient.addColorStop(
        0.7,
        `rgba(
            255,
            45,
            75,
            ${0.012 + intensity * 0.012}
        )`
    );

    gradient.addColorStop(
        1,
        "rgba(255, 45, 75, 0)"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    const steps = 180;

    for (let i = 0; i <= steps; i++) {

        const t =
            (i / steps) *
            Math.PI *
            2;

        const point =
            heartPoint(t);

        const x =
            centerX +
            point.x *
            heartScale *
            0.96;

        const y =
            centerY -
            point.y *
            heartScale *
            0.96;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();
    ctx.fill();
}

// =========================================
// DRAW HEART
// =========================================
function drawHeart(time) {

    const beat =
        getHeartbeat(time);

    const intensity =
        getBeatIntensity(
            beat
        );

    const heartScale =
        scale *
        (
            1 +
            (
                beat - 1
            ) *
            0.45
        );

    // OUTER LIGHT
    drawHeartAura(
        heartScale,
        intensity
    );

    // OUTER DUST
    drawOuterDust(
        time,
        intensity
    );

    // BODY GLOW
    drawHeartBodyGlow(
        heartScale,
        intensity
    );

    // BODY
    drawHeartParticles(
        time,
        heartScale,
        beat,
        intensity
    );

    // CORE
    drawHeartCore(
        time,
        heartScale,
        intensity
    );

    // EDGE
    drawHeartOutline(
        time,
        heartScale,
        intensity
    );
}


// =========================================
// HEARTBEAT EVENTS
// =========================================
let lastEscapeCycle = -1;

let lastShockwaveCycle = -1;

function updateHeartbeatEvent(
    time
) {
    const elapsed =
        (
            time -
            heartbeatStart
        ) %
        HEARTBEAT_DURATION;

    const cycle =
        Math.floor(
            (
                time -
                heartbeatStart
            ) /
            HEARTBEAT_DURATION
        );

    /*
     * ---------------------------------
     * SECOND BEAT
     * ---------------------------------
     * Chỉ tạo particle thoát
     * ở nhịp mạnh thứ hai.
     */
    if (
        elapsed >= 860 &&
        elapsed < 1080 &&
        cycle !== lastEscapeCycle
    ) {
        lastEscapeCycle =
            cycle;

        createEscapedParticles();
    }

    /*
     * ---------------------------------
     * SHOCKWAVE
     * ---------------------------------
     * Đồng bộ với nhịp thứ hai.
     */
    if (
        elapsed >= 860 &&
        elapsed < 1080 &&
        cycle !== lastShockwaveCycle
    ) {
        lastShockwaveCycle =
            cycle;

        createShockwave(
            0.55
        );
    }
}

// =========================================
// MAIN LOOP
// =========================================

function draw(time) {
    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    updateHeartbeatEvent(
        time
    );

    const beat =
        getHeartbeat(time);

    drawFloatingParticles(
        time,
        beat
    );

    drawHeart(
        time
    );

    drawEscapedParticles(
        time
    );

    drawShockwaves();


    requestAnimationFrame(
        draw
    );
}

requestAnimationFrame(
    draw
);

// =========================================
// CLICK
// =========================================
document.addEventListener(
    "click",
    () => {
        createShockwave(
            0.3
        );
    }
);

// =========================================
// CINEMATIC TEXT FADE
// =========================================
const heartContent =
    document.querySelector(
        ".heart-content"
    );

const TEXT_HIDE_DELAY =
    15000;

setTimeout(() => {

    if (
        heartContent
    ) {
        heartContent.classList.add(
            "text-hidden"
        );
    }
}, TEXT_HIDE_DELAY);