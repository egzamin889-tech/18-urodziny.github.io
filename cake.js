const candles = document.querySelectorAll(".candle");

const message =
    document.querySelector(".birthday-message");

let blownCandles = 0;


candles.forEach((candle) => {

    candle.addEventListener("click", () => {

        if (candle.classList.contains("blown")) {
            return;
        }

        candle.classList.add("blown");

        blownCandles++;

        if (blownCandles === candles.length) {

            setTimeout(() => {

                message.classList.add("show");

            }, 600);

        }

    });

});
