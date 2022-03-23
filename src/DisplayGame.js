import { useState, useEffect } from "react";
import {
    getNewDeck,
    drawCardsFromDeck,
    getHandTotalValue,
} from "./helpers/blackjack";

import PokemonDisplay from "./PokemonDisplay";
import Results from "./Results";

const DisplayGame = () => {
    // Variables to store Pokemon that can evolve for both users
    const [userOnePokemon, setUserOnePokemon] = useState({});
    const [userTwoPokemon, setUserTwoPokemon] = useState({});

    // Number of rounds played, initialize at round 1
    const [numOfRounds, setNumOfRounds] = useState(1);

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

    // A function that accepts a pokemon object as a parameter and randomly determines if it is shiny
    const areYouShiny = (pokemon) => {
        const data = {
            sprites: {},
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

    // A function that allows the user to fetch the next evolution for the given Pokemon
    const setNextEvolution = (evolutionURL, isShiny) => {
        return fetch(evolutionURL)
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                let data = {};
                // If shiny, save evolution's shiny sprites
                if (isShiny) {
                    data = {
                        evoName: res.name,
                        evoSprites: {
                            front: res.sprites.front_shiny,
                            back: res.sprites.back_shiny,
                        },
                    };
                } else {
                    // Otherwise save defaults
                    data = {
                        evoName: res.name,
                        evoSprites: {
                            front: res.sprites.front_default,
                            back: res.sprites.back_default,
                        },
                    };
                }

                return data;
            });
    };

    // Set Pokemon based on which user we are generating it for
    const setRandomChoice = (res, user) => {
        // Make a request to the next endpoint where we want to save data from
        const nextRequestURL = res.chain.species.url.replace("-species", "");
        // the endpoint where the evolution's data is stored - we need to extract this URL from the evolution_chains endpoint and plug it into a new fetch request because of the API structure
        const evolutionURL = res.chain["evolves_to"][0].species.url.replace(
            "-species",
            ""
        );
        fetch(nextRequestURL)
            .then((res) => {
                return res.json();
            })
            .then(async (res) => {
                // Generate the Pokemon's shiny chances and record the next evolution + its sprites based on shiny chances
                const isShiny = areYouShiny(res);
                const nextEvo = await setNextEvolution(
                    evolutionURL,
                    isShiny.shiny
                );
                if (user === "first") {
                    setUserOnePokemon({ ...isShiny, ...nextEvo });
                } else if (user === "second") {
                    setUserTwoPokemon({ ...isShiny, ...nextEvo });
                }
            });

        return;
    };

    // On round change - determine the Pokemon to be assigned to the players randomly
    useEffect(() => {
        pickAPokemon("first");
        pickAPokemon("second");
    }, [numOfRounds]);

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
        setNumOfRounds(numOfRounds + 1);
    }

    useEffect(() => {
        startGame();
    }, []);

    // useEffect(() => {
    //     if (playerOneDone && playerTwoDone) {
    //         // Here we can use the `determineWinner` function and evolve the pokemon.
    //         console.log("game over");
    //     }
    // }, [playerOneDone, playerTwoDone]);

    return (
        <section className="game">
            {error ? <p>Oh no! There was an error!</p> : null}

            {
                // If both players are done, then display Results screen
                playerOneDone && playerTwoDone ? (
                    <>
                        <Results
                            playerOneTotal={playerOneTotal}
                            playerTwoTotal={playerTwoTotal}
                            userOnePokemon={userOnePokemon}
                            userTwoPokemon={userTwoPokemon}
                        />
                    </>
                ) : // Based on the active player, re-render the Pokemon facing the correct direction
                activePlayer === "player1" ? (
                    <>
                        <p>Player One's Turn!</p>

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
                            disabled={
                                playerOneDone || activePlayer !== "player1"
                            }
                            onClick={async () => {
                                const newCards = await drawCardsFromDeck(
                                    deckId,
                                    1
                                );
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
                            disabled={
                                playerOneDone || activePlayer !== "player1"
                            }
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
                        <p>Player Two's Turn!</p>

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
                            disabled={
                                playerTwoDone || activePlayer !== "player2"
                            }
                            onClick={async () => {
                                const newCards = await drawCardsFromDeck(
                                    deckId,
                                    1
                                );
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
                            disabled={
                                playerTwoDone || activePlayer !== "player2"
                            }
                            onClick={() => {
                                setPlayerTwoDone(true);
                                setActivePlayer("player1");
                            }}
                        >
                            Stand
                        </button>
                    </>
                )
            }

            {
                // If both players are done, then display reset button
            }
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
