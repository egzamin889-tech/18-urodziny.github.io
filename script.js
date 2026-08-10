document.querySelectorAll(".gift").forEach((gift) => {

    gift.addEventListener("click", () => {

        if (gift.classList.contains("opened")) {
            return;
        }

        gift.classList.add("opening");

        setTimeout(() => {
            gift.classList.remove("opening");
            gift.classList.add("opened");
        }, 800);

    });

});
