import { useState, useEffect } from "react";
import {
    getNewDeck,
    drawCardsFromDeck,
    getHandTotalValue,
    determineWinner,
    getGameOverMessage,
} from "./helpers/blackjack";

const DisplayGame = () => {
    const [deckId, setDeckId] = useState();
    const [error, setError] = useState(false);
    const [activePlayer, setActivePlayer] = useState("player1");
    const [playerOneHand, setPlayerOneHand] = useState([]);
    const [playerTwoHand, setPlayerTwoHand] = useState([]);
    const [playerOneDone, setPlayerOneDone] = useState(false);
    const [playerTwoDone, setPlayerTwoDone] = useState(false);

    const playerOneTotal = getHandTotalValue(playerOneHand);
    const playerTwoTotal = getHandTotalValue(playerTwoHand);

    const isPlayerOneBust = playerOneTotal > 21;
    const isPlayerTwoBust = playerTwoTotal > 21;

    async function startGame() {
        try {
            const deck = await getNewDeck();
            const initialCards = await drawCardsFromDeck(deck.deck_id, 4);
            setDeckId(deck.deck_id);
            setPlayerOneHand(initialCards.slice(0, 2));
            setPlayerTwoHand(initialCards.slice(2, 4));
        } catch (e) {
            setError(true);
        }
    }

    function resetGame() {
        setDeckId(undefined);
        setActivePlayer(activePlayer === "player1" ? "player2" : "player1");
        setPlayerOneHand([]);
        setPlayerTwoHand([]);
        setPlayerOneDone(false);
        setPlayerTwoDone(false);
    }

    useEffect(() => {
        startGame();
    }, []);

    useEffect(() => {
        if (playerOneDone && playerTwoDone) {
            // Here we can use the `determineWinner` function and evolve the pokemon.
            console.log("game over");
        }
    }, [playerOneDone, playerTwoDone]);

    return (
        <div className="app">
            {error ? <p>Oh no! There was an error!</p> : null}
            {playerOneDone && playerTwoDone && (
                <p>
                    {getGameOverMessage(
                        determineWinner(playerOneTotal, playerTwoTotal)
                    )}
                </p>
            )}
            <p>Player 1</p>
            {playerOneHand.map((card) => {
                return <img key={card.code} src={card.image} alt={card.code} />;
            })}
            {isPlayerOneBust && <p>BUST!</p>}

            <p>Total: {playerOneTotal}</p>
            <button
                disabled={playerOneDone || activePlayer !== "player1"}
                onClick={async () => {
                    const newCards = await drawCardsFromDeck(deckId, 1);
                    const newHand = [...playerOneHand, ...newCards];
                    const total = getHandTotalValue(newHand);
                    setPlayerOneHand(newHand);
                    if (total > 21) {
                        setPlayerOneDone(true);
                        setActivePlayer("player2");
                    }
                }}
            >
                Hit
            </button>
            <button
                disabled={playerOneDone || activePlayer !== "player1"}
                onClick={() => {
                    setPlayerOneDone(true);
                    setActivePlayer("player2");
                }}
            >
                Stand
            </button>

            <p>Player 2</p>
            {playerTwoHand.map((card) => {
                return <img key={card.code} src={card.image} alt={card.code} />;
            })}
            {isPlayerTwoBust && <p>BUST!</p>}
            <p>Total: {playerTwoTotal}</p>
            <button
                disabled={playerTwoDone || activePlayer !== "player2"}
                onClick={async () => {
                    const newCards = await drawCardsFromDeck(deckId, 1);
                    const newHand = [...playerTwoHand, ...newCards];
                    const total = getHandTotalValue(newHand);
                    setPlayerTwoHand(newHand);
                    if (total > 21) {
                        setPlayerTwoDone(true);
                        setActivePlayer("player1");
                    }
                }}
            >
                Hit
            </button>
            <button
                disabled={playerTwoDone || activePlayer !== "player2"}
                onClick={() => {
                    setPlayerTwoDone(true);
                    setActivePlayer("player1");
                }}
            >
                Stand
            </button>
            {playerOneDone && playerTwoDone && (
                <div>
                    <button
                        onClick={() => {
                            resetGame();
                            startGame();
                        }}
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default DisplayGame;
