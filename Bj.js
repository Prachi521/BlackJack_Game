let BlackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-score', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-score', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', 'K', 'J', 'Q', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'J': 10, 'K': 10, 'Q': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};
const YOU = BlackjackGame['you']
const DEALER = BlackjackGame['dealer']

const hitSound = new Audio('sounds/Swish1.wav');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackdeal);




function blackjackHit() {
    if (BlackjackGame['isStand'] === false) {
        let card = randCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randCard() {
    let randomIndex = Math.floor(Math.random() * 12);
    return BlackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.jpg`
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackdeal() {
    if (BlackjackGame['turnsOver'] === true) {
        BlackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for (i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        for (i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-score').textContent = 0;
        document.querySelector('#dealer-blackjack-score').textContent = 0;

        document.querySelector('#your-blackjack-score').style.color = 'white';
        document.querySelector('#dealer-blackjack-score').style.color = 'white';


        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = 'black';
        BlackjackGame['turnsOver'] = true;
    }
}

function updateScore(card, activePlayer) {
    //IF ADDING 11 KEEPS ME BELOW 21 THEN ADD11 OR ELSE ADD1
    if (card === 'A') {
        if (activePlayer['score'] + BlackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += BlackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += BlackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += BlackjackGame['cardsMap'][card];
    }
}
function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function dealerLogic() {
    BlackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && BlackjackGame['isStand'] === true) {
        let card = randCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

    BlackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);

}


function computeWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            BlackjackGame['wins']++;
            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
            BlackjackGame['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score']) {
            BlackjackGame['draws']++;
            console.log('u drew');
        }
    }
    //condition when you bust
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        BlackjackGame['losses']++;
        winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        BlackjackGame['draws']++;
        console.log('you drew');
    }

    return winner;
}
function showResult(winner) {
    let message, messageColor;
    if (BlackjackGame['turnsOver'] === true) { }
    if (winner === YOU) {
        document.querySelector('#wins').textContent = BlackjackGame['wins'];
        message = 'You won!';
        messageColor = 'green';
        winSound.play();
    }

    else if (winner === DEALER) {
        document.querySelector('#losses').textContent = BlackjackGame['losses'];
        message = 'You lost!';
        messageColor = 'red';
        lossSound.play();

    } else {
        document.querySelector('#draws').textContent = BlackjackGame['draws'];
        message = 'Tie!';
        messageColor = 'black';

    }
    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;

}

