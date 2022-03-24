export function getNewDeck() {
    return fetch("https://deckofcardsapi.com/api/deck/new/shuffle/").then(
        (response) => response.json()
    );
}

export function drawCardsFromDeck(deckId, numberOfCards) {
    return fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numberOfCards}`
    )
        .then((response) => response.json())
        .then((json) => json.cards);
}

export function getCardValue(card) {
    if (
        card.value === "JACK" ||
        card.value === "QUEEN" ||
        card.value === "KING"
    ) {
        return 10;
    } else if (card.value === "ACE") {
        return 11;
    } else {
        return Number(card.value);
    }
}

export function getHandTotalValue(cards) {
    const aces = cards.filter((card) => card.value === "ACE");

    let total = cards.reduce((acc, current) => {
        return acc + getCardValue(current);
    }, 0);

    aces.forEach((ace) => {
        if (total > 21) {
            total = total - 10;
        }
    });

    return total;
}

export function determineWinner(playerOneTotal, playerTwoTotal) {
    if (playerOneTotal > 21 && playerTwoTotal > 21) {
        // No winner, it's a tie
        return null;
    } else if (playerOneTotal > 21) {
        return "player2";
    } else if (playerTwoTotal > 21) {
        return "player1";
    } else if (playerOneTotal === playerTwoTotal) {
        // Also a tie
        return null;
    } else {
        return playerOneTotal > playerTwoTotal ? "player1" : "player2";
    }
}

export function getGameOverMessage(winner) {
    if (winner === null) {
        return `It's a tie!`;
    } else if (winner === "player1") {
        return "Player one is the winner!";
    } else {
        return "Player two is the winner!";
    }
}
