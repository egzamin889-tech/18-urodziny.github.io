const gifts = document.querySelectorAll(".gift");

gifts.forEach((gift) => {

    gift.addEventListener("click", (event) => {

        if (
            gift.classList.contains("opening") ||
            gift.classList.contains("opened")
        ) {
            return;
        }

        gift.classList.add("opening");

        setTimeout(() => {

            gift.classList.remove("opening");

            gift.classList.add("opened");

        }, 800);

    });

});


const closeButtons = document.querySelectorAll(".close-gift");

closeButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        const gift = button.closest(".gift");

        gift.classList.remove("opened");

    });

});
