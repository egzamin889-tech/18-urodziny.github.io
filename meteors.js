const meteorField = document.querySelector(".meteor-field");


function createMeteor() {

    const meteor = document.createElement("div");

    meteor.classList.add("meteor");


    /* czasami większy */

    if (Math.random() < 0.18) {
        meteor.classList.add("big");
    }


    /*
     * Meteor pojawia się wysoko
     * i leci ukośnie w dół.
     */

    const startX =
        Math.random() * window.innerWidth * 1.1 - 100;

    const startY =
        Math.random() * window.innerHeight * 0.45 - 100;


    meteor.style.left = `${startX}px`;
    meteor.style.top = `${startY}px`;


    meteorField.appendChild(meteor);


    /* kierunek i długość lotu */

    const distanceX =
        350 + Math.random() * 500;

    const distanceY =
        180 + Math.random() * 350;


    const duration =
        900 + Math.random() * 1300;


    /*
     * Animacja przez Web Animations API.
     */

    const animation = meteor.animate(
        [
            {
                transform:
                    "translate(0, 0) rotate(-35deg) scale(0.7)",
                opacity: 0
            },

            {
                transform:
                    "translate(80px, 50px) rotate(-35deg) scale(1)",
                opacity: 1,

                offset: 0.08
            },

            {
                transform:
                    `translate(${distanceX}px, ${distanceY}px)
                     rotate(-35deg)
                     scale(1)`,

                opacity: 1
            },

            {
                transform:
                    `translate(${distanceX + 80}px, ${distanceY + 70}px)
                     rotate(-35deg)
                     scale(0.3)`,

                opacity: 0
            }
        ],
        {
            duration: duration,
            easing: "cubic-bezier(0.2, 0, 0.8, 1)"
        }
    );


    animation.onfinish = () => {

        meteor.remove();

    };
}


/* ========================================= */
/*           LOSOWY DESZCZ                  */
/* ========================================= */

function meteorRain() {

    createMeteor();


    const nextMeteor =
        250 + Math.random() * 900;


    setTimeout(
        meteorRain,
        nextMeteor
    );
}


/* START */

meteorRain();
