const gifts = document.querySelectorAll(".gift");
const giftContent = document.querySelector(".gift-content");
const closeButton = document.querySelector(".close-gift");

let isOpening = false;

gifts.forEach((gift) => {

    gift.addEventListener("click", () => {

        if (isOpening) {
            return;
        }

        isOpening = true;

        gift.classList.add("opening");

        setTimeout(() => {

            gift.classList.remove("opening");
            gift.classList.add("opened");

        }, 800);

        setTimeout(() => {

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
