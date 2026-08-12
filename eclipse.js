document.addEventListener("DOMContentLoaded", () => {

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


    /*
    ============================================================
        USTAWIENIA ANIMACJI
    ============================================================
    */

    const DURATION = 30000;

    /*
        Księżyc zaczyna daleko po lewej
        i kończy daleko po prawej.
    */

    const START_X = -650;
    const END_X = 650;


    /*
    ============================================================
        FUNKCJE
    ============================================================
    */

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }


    /*
        Łagodny ruch na początku i końcu,
        ale środek przejścia jest dość naturalny.
    */

    function ease(t) {
        return t * t * (3 - 2 * t);
    }


    /*
    ============================================================
        RUCH KSIĘŻYCA
    ============================================================
    */

    function updateMoon(progress) {

        const x = START_X + (END_X - START_X) * ease(progress);

        /*
            Bardzo małe odchylenie pionowe.
            Księżyc nie jedzie idealnie po linijce.
        */

        const y =
            Math.sin(progress * Math.PI) * 7;

        moon.style.left =
            `calc(50% + ${x}px)`;

        moon.style.top =
            `calc(50% + ${y}px)`;

        return x;
    }


    /*
    ============================================================
        ZASŁONIĘCIE SŁOŃCA
    ============================================================
    */

    function getCoverage(moonX) {

        /*
            Słońce ma około 276px średnicy,
            Księżyc około 330px.

            Dzięki temu Księżyc może całkowicie
            zakryć tarczę Słońca.
        */

        const sunRadius = 138;
        const moonRadius = 165;

        const distance = Math.abs(moonX);

        /*
            Poza tym dystansem Księżyc
            w ogóle nie dotyka Słońca.
        */

        if (distance >= sunRadius + moonRadius) {
            return 0;
        }


        /*
            Kiedy środek Księżyca jest wystarczająco blisko,
            Słońce jest całkowicie zakryte.
        */

        if (distance <= moonRadius - sunRadius) {
            return 1;
        }


        /*
            Częściowe zaćmienie.
        */

        return clamp(
            1 -
            (
                distance -
                (moonRadius - sunRadius)
            ) /
            (
                (sunRadius + moonRadius) -
                (moonRadius - sunRadius)
            ),
            0,
            1
        );
    }


    /*
    ============================================================
        ŚWIATŁO SŁOŃCA
    ============================================================
    */

    function updateSun(coverage) {

        /*
            WAŻNE:

            Nie chowamy tarczy Słońca!

            Księżyc fizycznie zasłania ją swoim
            czarnym elementem.

            My tylko zmniejszamy POŚWIATĘ.
        */

        const glow =
            Math.pow(1 - coverage, 2.4);

        sunGlow.style.opacity =
            glow;


        /*
            Sama tarcza Słońca pozostaje w pełni widoczna
            pod Księżycem.
        */

        sunCore.style.opacity = "1";
    }


    /*
    ============================================================
        NIEBO
    ============================================================
    */

    function updateSky(coverage) {

        const darkness =
            Math.pow(coverage, 2.0);

        const r =
            Math.round(48 - darkness * 44);

        const g =
            Math.round(73 - darkness * 67);

        const b =
            Math.round(108 - darkness * 92);


        sky.style.background = `
            radial-gradient(
                ellipse at 50% 48%,

                rgb(
                    ${r + 8},
                    ${g + 8},
                    ${b + 8}
                ) 0%,

                rgb(
                    ${r},
                    ${g},
                    ${b}
                ) 35%,

                rgb(
                    ${Math.max(r - 8, 2)},
                    ${Math.max(g - 10, 3)},
                    ${Math.max(b - 15, 5)}
                ) 70%,

                #02030a 100%
            )
        `;
    }


    /*
    ============================================================
        GWIAZDY
    ============================================================
    */

    function updateStars(coverage) {

        let opacity = 0;

        /*
            Pojawiają się dopiero przy mocnym zaćmieniu.
        */

        if (coverage > 0.70) {

            opacity =
                (coverage - 0.70) / 0.30;
        }

        opacity =
            Math.pow(
                clamp(opacity, 0, 1),
                0.8
            );

        stars.style.opacity =
            opacity;
    }


    /*
    ============================================================
        KORONA
    ============================================================
    */

    function updateCorona(coverage) {

        let opacity = 0;

        /*
            Korona pojawia się dopiero,
            kiedy Księżyc prawie całkowicie
            zasłoni Słońce.
        */

        if (coverage > 0.94) {

            opacity =
                (coverage - 0.94) / 0.06;
        }

        opacity =
            clamp(opacity, 0, 1);

        corona.style.opacity =
            opacity * 0.95;
    }


    /*
    ============================================================
        DIAMOND RING
    ============================================================
    */

    function updateDiamondRing(coverage, moonX) {

        /*
            Diamond ring tylko przez bardzo krótki moment.
        */

        if (
            coverage < 0.985 ||
            coverage > 0.999
        ) {

            diamondRing.style.opacity = "0";

            return;
        }


        const t =
            (coverage - 0.985) /
            0.014;


        const intensity =
            Math.sin(t * Math.PI);


        /*
            Po której stronie jest ostatni
            kawałek światła?
        */

        const direction =
            moonX < 0 ? 1 : -1;


        diamondRing.style.left =
            `calc(50% + ${direction * 145}px)`;


        diamondRing.style.top =
            "50%";


        diamondRing.style.opacity =
            intensity;


        diamondRing.style.transform =
            `
            translate(-50%, -50%)
            scale(${0.3 + intensity * 1.2})
            `;
    }


    /*
    ============================================================
        TEKST
    ============================================================
    */

    function updateText(coverage) {

        /*
            Zwykły tekst powoli znika.
        */

        info.style.opacity =
            clamp(
                1 - coverage * 3,
                0,
                1
            );


        /*
            Komunikat pojawia się dopiero
            podczas całkowitego zaćmienia.
        */

        if (coverage >= 0.995) {

            totalityMessage.style.opacity = "1";

            totalityMessage.style.transform =
                "translate(-50%, -50%) scale(1)";

        } else {

            totalityMessage.style.opacity = "0";

            totalityMessage.style.transform =
                "translate(-50%, -50%) scale(.8)";
        }
    }


    /*
    ============================================================
        ANIMACJA
    ============================================================
    */

    let startTime = null;


    function animate(timestamp) {

        if (startTime === null) {
            startTime = timestamp;
        }


        const elapsed =
            timestamp - startTime;


        const progress =
            clamp(
                elapsed / DURATION,
                0,
                1
            );


        /*
            1. Przesuwamy Księżyc.
        */

        const moonX =
            updateMoon(progress);


        /*
            2. Sprawdzamy, ile Słońca
               powinno być zakryte.
        */

        const coverage =
            getCoverage(moonX);


        /*
            3. Aktualizujemy resztę efektów.
        */

        updateSun(coverage);
        updateSky(coverage);
        updateStars(coverage);
        updateCorona(coverage);
        updateDiamondRing(coverage, moonX);
        updateText(coverage);


        /*
            Lecimy dalej.
        */

        if (progress < 1) {

            requestAnimationFrame(animate);

        } else {

            /*
                Koniec animacji.
            */

            moon.style.left =
                `calc(50% + ${END_X}px)`;

            moon.style.top =
                "50%";
        }
    }


    /*
    ============================================================
        START
    ============================================================
    */

    function startEclipse() {

        startTime = null;

        /*
            Ustawiamy Księżyc daleko poza Słońcem.
        */

        moon.style.left =
            `calc(50% + ${START_X}px)`;

        moon.style.top =
            "50%";


        /*
            Resetujemy efekty.
        */

        sunCore.style.opacity = "1";

        sunGlow.style.opacity = "1";

        corona.style.opacity = "0";

        stars.style.opacity = "0";

        diamondRing.style.opacity = "0";

        info.style.opacity = "1";

        totalityMessage.style.opacity = "0";


        requestAnimationFrame(animate);
    }


    /*
    ============================================================
        URUCHOMIENIE
    ============================================================
    */

    startEclipse();

});
