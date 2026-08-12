const sky = document.querySelector(".sky");
const sun = document.querySelector(".sun");
const sunCore = document.querySelector(".sun-core");
const sunGlow = document.querySelector(".sun-glow");
const corona = document.querySelector(".corona");
const moon = document.querySelector(".moon");
const stars = document.querySelector(".stars");
const info = document.querySelector(".eclipse-info");
const totalityMessage = document.querySelector(".totality-message");

let diamondRing = document.querySelector(".diamond-ring");

if (!diamondRing) {
    diamondRing = document.createElement("div");
    diamondRing.className = "diamond-ring";
    sky.appendChild(diamondRing);
}


/* =========================================================
   USTAWIENIA
   ========================================================= */

const SETTINGS = {
    duration: 26000,

    // Pozycja początkowa i końcowa Księżyca.
    // Im większa różnica, tym dłuższa droga.
    startX: -520,
    endX: 520,

    // Delikatna pionowa nieregularność toru.
    verticalAmplitude: 8
};


/* =========================================================
   FUNKCJE
   ========================================================= */

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function easeInOut(t) {
    return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
}


/*
    Krzywa zaćmienia.

    Dzięki temu Księżyc nie jedzie idealnie liniowo.
    Początek i koniec są spokojniejsze.
*/
function eclipseProgress(t) {
    return easeInOut(clamp(t, 0, 1));
}


/* =========================================================
   OBLICZANIE ZASŁONIĘCIA SŁOŃCA
   ========================================================= */

function calculateCoverage(moonX) {
    const sunRadius = 138;
    const moonRadius = 165;

    const distance = Math.abs(moonX);

    /*
        0 = brak zasłonięcia
        1 = całkowite zaćmienie
    */

    const visibleDistance =
        sunRadius + moonRadius;

    const totalDistance =
        Math.abs(moonRadius - sunRadius);

    if (distance >= visibleDistance) {
        return 0;
    }

    if (distance <= totalDistance) {
        return 1;
    }

    return 1 -
        (distance - totalDistance) /
        (visibleDistance - totalDistance);
}


/* =========================================================
   KOLOR NIEBA
   ========================================================= */

function updateSky(coverage) {
    /*
        Naturalne zaćmienie nie robi nagle czarnego nieba.
        Najpierw robi się bardziej szare,
        potem granatowe,
        a dopiero przy totality bardzo ciemne.
    */

    const darkness = Math.pow(coverage, 1.7);

    const r = Math.round(48 - darkness * 43);
    const g = Math.round(73 - darkness * 67);
    const b = Math.round(108 - darkness * 91);

    sky.style.background = `
        radial-gradient(
            ellipse at 50% 48%,
            rgb(${r + 8}, ${g + 8}, ${b + 8}) 0%,
            rgb(${r}, ${g}, ${b}) 30%,
            rgb(${Math.max(r - 7, 2)}, ${Math.max(g - 9, 3)}, ${Math.max(b - 15, 5)}) 62%,
            rgb(2, 3, 8) 100%
        )
    `;

    sky.style.setProperty(
        "--darkness",
        darkness
    );
}


/* =========================================================
   SŁOŃCE
   ========================================================= */

function updateSun(coverage) {
    /*
        Poświata gaśnie znacznie wcześniej
        niż sama tarcza.
    */

    const glowOpacity =
        Math.pow(1 - coverage, 2.2);

    const coreOpacity =
        clamp(1 - coverage * 1.08, 0, 1);

    sunGlow.style.opacity =
        glowOpacity;

    sunCore.style.opacity =
        coreOpacity;

    /*
        Im mniej Słońca widać,
        tym mniejsza jego poświata.
    */

    const glowScale =
        lerp(.65, 1, glowOpacity);

    sunGlow.style.transform =
        `translate(-50%, -50%) scale(${glowScale})`;
}


/* =========================================================
   KORONA
   ========================================================= */

function updateCorona(coverage) {
    /*
        Korona zaczyna się pojawiać dopiero
        bardzo blisko totality.
    */

    let coronaOpacity = 0;

    if (coverage > .88) {
        coronaOpacity =
            clamp((coverage - .88) / .12, 0, 1);
    }

    /*
        W samym środku totality korona jest najmocniejsza.
    */

    if (coverage >= .995) {
        coronaOpacity = 1;
    }

    corona.style.opacity =
        coronaOpacity * .9;
}


/* =========================================================
   GWIAZDY
   ========================================================= */

function updateStars(coverage) {
    /*
        Gwiazdy nie powinny wyskoczyć od razu.

        Przy około 70% zaczynają być bardzo delikatne.
        Przy totality są wyraźne.
    */

    let opacity = 0;

    if (coverage > .65) {
        opacity =
            clamp((coverage - .65) / .35, 0, 1);
    }

    opacity =
        Math.pow(opacity, .75);

    stars.style.opacity =
        opacity;
}


/* =========================================================
   DIAMOND RING
   ========================================================= */

function updateDiamondRing(coverage, moonX) {
    /*
        Diamond ring pojawia się tylko przez bardzo krótki
        moment tuż przed całkowitym zaćmieniem.

        Najważniejsze:
        nie pokazujemy go podczas całego totality.
    */

    const nearTotality =
        coverage > .965 && coverage < .9995;

    if (!nearTotality) {
        diamondRing.style.opacity = "0";
        return;
    }

    /*
        0 -> początek diamond ring
        1 -> jego maksimum
        0 -> tuż przed totality
    */

    const local =
        clamp((coverage - .965) / .0345, 0, 1);

    const intensity =
        Math.sin(local * Math.PI);

    /*
        Pozycja punktu światła zależy od strony,
        z której Księżyc zasłania Słońce.
    */

    const direction =
        moonX < 0 ? -1 : 1;

    diamondRing.style.left =
        `calc(50% + ${direction * 100}px)`;

    diamondRing.style.top =
        "50%";

    diamondRing.style.opacity =
        intensity;

    diamondRing.style.transform =
        `translate(-50%, -50%) scale(${0.35 + intensity * .8})`;
}


/* =========================================================
   TOR KSIĘŻYCA
   ========================================================= */

function updateMoon(t) {
    const progress =
        eclipseProgress(t);

    const x =
        lerp(
            SETTINGS.startX,
            SETTINGS.endX,
            progress
        );

    /*
        Minimalne odchylenie góra/dół.
        Dzięki temu ruch nie jest komputerowo idealny.
    */

    const y =
        Math.sin(progress * Math.PI) *
        SETTINGS.verticalAmplitude;

    moon.style.left =
        `calc(50% + ${x}px)`;

    moon.style.top =
        `calc(50% + ${y}px)`;

    return x;
}


/* =========================================================
   GŁÓWNA ANIMACJA
   ========================================================= */

let animationStart = null;

function animate(timestamp) {
    if (!animationStart) {
        animationStart = timestamp;
    }

    const elapsed =
        timestamp - animationStart;

    const rawProgress =
        clamp(
            elapsed / SETTINGS.duration,
            0,
            1
        );

    const moonX =
        updateMoon(rawProgress);

    const coverage =
        calculateCoverage(moonX);

    updateSky(coverage);
    updateSun(coverage);
    updateCorona(coverage);
    updateStars(coverage);
    updateDiamondRing(coverage, moonX);

    /*
        Tekst znika w miarę zbliżania się
        do totality.
    */

    const infoOpacity =
        clamp(1 - coverage * 2.8, 0, 1);

    info.style.opacity =
        infoOpacity;

    /*
        Komunikat pokazujemy dopiero podczas
        rzeczywistego totality.
    */

    if (coverage > .995) {
        totalityMessage.style.opacity = "1";
        totalityMessage.style.transform =
            "translate(-50%, -50%) scale(1)";
    } else {
        totalityMessage.style.opacity = "0";
        totalityMessage.style.transform =
            "translate(-50%, -50%) scale(.8)";
    }

    if (rawProgress < 1) {
        requestAnimationFrame(animate);
    } else {
        /*
            Po zakończeniu zostawiamy scenę
            w stanie końcowym.
        */

        updateMoon(1);
    }
}


/* =========================================================
   START
   ========================================================= */

function startEclipse() {
    animationStart = null;

    /*
        Reset
    */

    moon.style.left =
        `calc(50% + ${SETTINGS.startX}px)`;

    moon.style.top =
        "50%";

    moon.style.display =
        "block";

    stars.style.opacity = "0";

    corona.style.opacity = "0";

    diamondRing.style.opacity = "0";

    totalityMessage.style.opacity = "0";

    info.style.opacity = "1";

    requestAnimationFrame(animate);
}


/* =========================================================
   START AUTOMATYCZNY
   ========================================================= */

window.addEventListener(
    "load",
    () => {
        startEclipse();
    }
);
