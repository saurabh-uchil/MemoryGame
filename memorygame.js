console.log("Memory Game");

const cards = [
    { suite: "♦", value: "K" },
    { suite: "♦", value: "Q" },
    { suite: "♦", value: "J" },
    { suite: "♦", value: "10" },
    { suite: "♦", value: "9" },
    { suite: "♦", value: "8" },
    { suite: "♦", value: "7" },
    { suite: "♦", value: "A" },

    { suite: "♦", value: "K" },
    { suite: "♦", value: "Q" },
    { suite: "♦", value: "J" },
    { suite: "♦", value: "10" },
    { suite: "♦", value: "9" },
    { suite: "♦", value: "8" },
    { suite: "♦", value: "7" },
    { suite: "♦", value: "A" }
];


// =========================================
// DOM ELEMENTS
// =========================================

const table = document.getElementById("table");
const start = document.getElementById("start");

const timerDiv = document.getElementById("timer");
const pairsDiv = document.getElementById("pairs");
const selectedCardsDiv = document.getElementById("selectedCards");
const endDiv = document.getElementById("end");


// =========================================
// GAME STATE
// =========================================

let selectedCards = [];
let pairs = 0;

let firstSelectedElement = null;

let gameActive = false;

let time = 60;

let myInterval = null;

let flipTimeout = null;


// =========================================
// SHUFFLE
// =========================================

const shuffleCards = () => {

    const shuffledCards = [...cards];

    for (let i = shuffledCards.length - 1; i > 0; i--) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));

        [
            shuffledCards[i],
            shuffledCards[randomIndex]
        ] =
        [
            shuffledCards[randomIndex],
            shuffledCards[i]
        ];
    }

    return shuffledCards;
};


// =========================================
// UPDATE UI
// =========================================

const updateUI = () => {

    selectedCardsDiv.innerHTML = `
        <p class="selected-card">
            Selected Cards:
            ${selectedCards.length > 0
                ? selectedCards[0]
                : "No cards selected"}
        </p>
    `;

    pairsDiv.innerHTML = `
        <p class="pairs-count">
            Pairs:
            <span>${pairs}</span>
        </p>
    `;
};


// =========================================
// RESET TIMER
// =========================================

const resetTimer = () => {

    // Stop previous timer
    if (myInterval !== null) {
        clearInterval(myInterval);
        myInterval = null;
    }

    time = 60;

    timerDiv.innerHTML = `
        <p>Time Left: ${time}</p>
    `;
};


// =========================================
// START TIMER
// =========================================

const startTimer = () => {

    myInterval = setInterval(() => {

        time--;

        timerDiv.innerHTML = `
            <p>Time Left: ${time}</p>
        `;

        if (time <= 0) {

            clearInterval(myInterval);

            myInterval = null;

            endGame();
        }

    }, 1000);
};


// =========================================
// END GAME
// =========================================

const endGame = () => {

    gameActive = false;

    // Stop timer
    if (myInterval !== null) {
        clearInterval(myInterval);
        myInterval = null;
    }

    // Cancel any old flip timeout
    if (flipTimeout !== null) {
        clearTimeout(flipTimeout);
        flipTimeout = null;
    }

    // Clear current selection
    selectedCards = [];
    firstSelectedElement = null;

    // Flip all cards face up
    const allCards = document.querySelectorAll(".card");

    allCards.forEach(card => {
        card.classList.add("flipped");
    });

    // Display message
    endDiv.innerHTML = `
        <p class="lost">
            Game Over!
            <br>
            You found ${pairs} pairs.
        </p>
    `;

    updateUI();
};


// =========================================
// SELECT CARD
// =========================================

const selectCard = (card, cardElement) => {

    // Don't allow clicks after game ends
    if (!gameActive) {
        return;
    }

    // Don't allow clicking a matched card
    if (cardElement.classList.contains("matched")) {
        return;
    }

    // Don't allow clicking an already flipped card
    if (cardElement.classList.contains("flipped")) {
        return;
    }

    // Don't allow a third card while
    // two cards are being compared
    if (selectedCards.length === 2) {
        return;
    }


    // =====================================
    // FIRST CARD
    // =====================================

    if (selectedCards.length === 0) {

        selectedCards.push(card.value);

        firstSelectedElement = cardElement;

        cardElement.classList.add("flipped");

        updateUI();

        return;
    }


    // =====================================
    // SECOND CARD
    // =====================================

    selectedCards.push(card.value);

    cardElement.classList.add("flipped");

    updateUI();


    // =====================================
    // MATCH
    // =====================================

    if (selectedCards[0] === selectedCards[1]) {

        pairs++;

        firstSelectedElement.classList.add("matched");

        cardElement.classList.add("matched");

        selectedCards = [];

        firstSelectedElement = null;

        updateUI();


        // WIN
        if (pairs === 8) {

            gameActive = false;

            if (myInterval !== null) {
                clearInterval(myInterval);
                myInterval = null;
            }

            endDiv.innerHTML = `
                <p class="won">
                    You Won!
                    <br>
                    You found all 8 pairs!
                </p>
            `;
        }

        return;
    }


    // =====================================
    // NO MATCH
    // =====================================

    flipTimeout = setTimeout(() => {

        // Make sure game is still active
        if (!gameActive) {
            return;
        }

        firstSelectedElement.classList.remove("flipped");

        cardElement.classList.remove("flipped");

        selectedCards = [];

        firstSelectedElement = null;

        flipTimeout = null;

        updateUI();

    }, 1000);
};


// =========================================
// START GAME
// =========================================

const startGame = () => {

    console.log("Starting new game");


    // =====================================
    // CANCEL OLD GAME
    // =====================================

    gameActive = false;


    // Stop old timer
    if (myInterval !== null) {
        clearInterval(myInterval);
        myInterval = null;
    }


    // Cancel old card flip
    if (flipTimeout !== null) {
        clearTimeout(flipTimeout);
        flipTimeout = null;
    }


    // =====================================
    // RESET STATE
    // =====================================

    selectedCards = [];

    pairs = 0;

    firstSelectedElement = null;

    time = 60;


    // =====================================
    // CLEAR OLD UI
    // =====================================

    table.innerHTML = "";

    endDiv.innerHTML = "";


    // =====================================
    // CREATE NEW DECK
    // =====================================

    const shuffledDeck = shuffleCards();


    // =====================================
    // CREATE CARDS
    // =====================================

    const cardElements = shuffledDeck.map(card => {

        const div = document.createElement("div");

        div.classList.add("card");

        div.innerHTML = `
            <div class="card-inner">

                <div class="card-front">
                    <p class="suite">${card.suite}</p>
                    <p class="value">${card.value}</p>
                </div>

                <div class="card-back">
                    ♦
                </div>

            </div>
        `;


        div.addEventListener("click", () => {

            selectCard(card, div);

        });


        return div;
    });


    table.append(...cardElements);


    // =====================================
    // RESET UI
    // =====================================

    updateUI();

    timerDiv.innerHTML = `
        <p>Time Left: ${time}</p>
    `;


    // =====================================
    // ACTIVATE GAME
    // =====================================

    gameActive = true;


    // =====================================
    // START TIMER
    // =====================================

    startTimer();
};


// =========================================
// START BUTTON
// =========================================

start.addEventListener("click", startGame);