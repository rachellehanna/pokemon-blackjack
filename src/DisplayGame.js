import { useState, useEffect } from "react";
import {
    getNewDeck,
    drawCardsFromDeck,
    getHandTotalValue,
    determineWinner,
    getGameOverMessage,
} from "./helpers/blackjack";

import User from "./User";
import PokemonDisplay from "./PokemonDisplay";
import Results from "./Results";

const DisplayGame = () => {
    // Variables to store Pokemon that can evolve for both users
    const [userOnePokemon, setUserOnePokemon] = useState({});
    const [userTwoPokemon, setUserTwoPokemon] = useState({});

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

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max + 1);
    };

    // Highest evolution chain index
    const maxEvoChains = 476;

    // Make API calls until an evolution chain is found where the Pokemon can evolve
    const pickAPokemon = async (user) => {
        const pokeIndex = getRandomInt(maxEvoChains);

        await fetch(`https://pokeapi.co/api/v2/evolution-chain/${pokeIndex}`)
            .then((res) => {
                // If response is OK - proceed to parse JSON, else throw error
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error();
                }
            })
            .then((res) => {
                // If array is empty, make a recursive API call again
                if (res.chain["evolves_to"].length === 0) {
                    return pickAPokemon(user);
                } else {
                    // set Pokemon depending on which user we are generating it for
                    setRandomChoice(res, user);
                    return res;
                }
            })
            .catch((err) => {
                return pickAPokemon(user);
            });
    };

    // Set Pokemon based on which user we are generating it for
    const setRandomChoice = (res, user) => {
        // Make a request to the next endpoint where we want to save data from
        const nextRequestURL = res.chain.species.url.replace("-species", "");

        // A function that accepts a pokemon object as a parameter and randomly determines if it is shiny
        const areYouShiny = (pokemon) => {
            const data = {
                sprites: {}
            };
            // 1 in 4 chance that the pokemon is shiny
            let odds = Math.floor(Math.random() * 4);

            if (odds === 1) {
                data.sprites.front = pokemon.sprites.front_shiny;
                data.sprites.back = pokemon.sprites.back_shiny;
                data.name = pokemon.name;
                data.shiny = true;
            } else {
                data.sprites.front = pokemon.sprites.front_default;
                data.sprites.back = pokemon.sprites.back_default;
                data.name = pokemon.name;
                data.shiny = false; 
            }
            return data;
        };

        fetch(nextRequestURL)
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (user === "first") {
                    setUserOnePokemon(areYouShiny(res));
                } else if (user === "second") {
                    setUserTwoPokemon(areYouShiny(res));
                }
            });
        return;
    };

    // On component mount - determine the Pokemon to be assigned to the players randomly
    useEffect(() => {
        pickAPokemon("first");
        pickAPokemon("second");
    }, []);

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
        <section className="game">
            {/* The following user component exists but is currently not being rendered - left it so we can discuss app structure as a group */}
            {/* <User 
                    userOnePokemon={userOnePokemon}
                    userTwoPokemon={userTwoPokemon}
                /> */}

            {error ? <p>Oh no! There was an error!</p> : null}

            {playerOneDone && playerTwoDone && (
                <>
                    <Results />
                    <p>
                        {getGameOverMessage(
                            determineWinner(playerOneTotal, playerTwoTotal)
                        )}
                    </p>
                </>
            )}

            {activePlayer === "player1" ? (
                <>
                    <p>Player 1</p>

                    <PokemonDisplay
                        currentPoke={userOnePokemon}
                        opponent={userTwoPokemon}
                    />

                    <div className="current-hand">
                        {playerOneHand.map((card) => {
                            return (
                                <img
                                    key={card.code}
                                    src={card.image}
                                    alt={card.code}
                                />
                            );
                        })}
                    </div>

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
                </>
            ) : (
                <>
                    <p>Player 2</p>

                    <PokemonDisplay
                        currentPoke={userTwoPokemon}
                        opponent={userOnePokemon}
                    />

                    <div className="current-hand">
                        {playerTwoHand.map((card) => {
                            return (
                                <img
                                    key={card.code}
                                    src={card.image}
                                    alt={card.code}
                                />
                            );
                        })}
                    </div>

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
                </>
            )}

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
        </section>
    );
};

export default DisplayGame;
