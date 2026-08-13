const flames = document.querySelectorAll(".flame");

function animateFire() {

    flames.forEach((flame, index) => {

        const scale =
            0.85 + Math.random() * 0.25;

        const rotation =
            -8 + Math.random() * 16;

        flame.style.transform =
            `rotate(${rotation}deg) scale(${scale})`;

    });

    setTimeout(
        animateFire,
        180
    );
}

animateFire();
