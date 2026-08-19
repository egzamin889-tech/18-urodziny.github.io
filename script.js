const gifts = document.querySelectorAll(".gift");

const giftContent = document.querySelector(".gift-content");
const giftImage = document.querySelector(".gift-image");
const giftTitle = document.querySelector(".gift-title");
const giftText = document.querySelector(".gift-text");
const closeButton = document.querySelector(".close-gift");

let isOpening = false;


const giftData = {

    matematyka: {
        image: "KartaPodarunkowaMatematyka.png",
        title: "",
        text: "„Nie martw się, że masz problemy z matematyką. Zapewniam cię, że moje są o wiele większe.” — Albert Einstein"
    },

    ciem: {
        image: "KartaPodarunkowaCiem.png",
        title: "",
        text: "„Odwaga to nie brak strachu, lecz świadomość, że coś innego jest ważniejsze.” – Ambrose Redmoon "
    },

    zacmienie: {
        image: "WspolneOgladanieZacmieniaSlonca.png",
        title: "",
        text: "Mieliśmy razem obejrzeć, ale się nie udało więc jak otworzysz wszystkie prezenty to w menu głównym jest dla ciebie zaćmienie.. tylko twoje."
    },

    meteoryty: {
        image: "NocMeteorytów.jpg",
        title: "",
        text: "Chciałes sobie wyobrażać wspólne oglądania spadających meteorytów.. teraz już nie musisz. W głównym menu je masz.."
    },

    jaXD: {
        image: "",
        title: "",
        text: "Dostałeś zdjęcie Janka to masz też moje. NIE NO ŻART XD, ale kiedyś pewnie dostaniesz."
    },

    RanczoFilm: {
        image: "",
        title: "",
        text: "Jedna sekunda z każdego filmu Ranczo. Dlaczego? Nie wiem.."
    }

};


gifts.forEach((gift) => {

    gift.addEventListener("click", () => {

        if (isOpening) {
            return;
        }

        isOpening = true;

        const giftType = gift.dataset.gift;
        const data = giftData[giftType];

        gift.classList.add("opening");


        setTimeout(() => {

            gift.classList.remove("opening");
            gift.classList.add("opened");

        }, 800);


        setTimeout(() => {

            giftImage.src = data.image;
            giftImage.alt = data.title;

            giftTitle.textContent = data.title;
            giftText.textContent = data.text;

            if (data.image) {
                giftImage.style.display = "block";
            } else {
                giftImage.style.display = "none";
            }

            giftContent.classList.add("show");

        }, 900);

    });

});


closeButton.addEventListener("click", () => {

    giftContent.classList.remove("show");

    document.querySelectorAll(".gift").forEach((gift) => {
        gift.classList.remove("opened");
    });

    setTimeout(() => {
        isOpening = false;
    }, 500);

});

const music = document.getElementById("background-music");
const musicButton = document.getElementById("music-button");

if (music && musicButton) {

    musicButton.addEventListener("click", () => {

        if (music.paused) {

            music.play();

            musicButton.textContent = "🔊";
            musicButton.setAttribute(
                "aria-label",
                "Wycisz muzykę"
            );

        } else {

            music.pause();

            musicButton.textContent = "🔇";
            musicButton.setAttribute(
                "aria-label",
                "Włącz muzykę"
            );

        }

    });

}
