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

    niespodzianka: {
        image: "",
        title: "🎉 Niespodzianka!",
        text: "To dopiero początek..."
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
