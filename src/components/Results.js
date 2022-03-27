import { useEffect, useState } from "react";
import { getGameOverMessage, determineWinner } from "../helpers/blackjack";

const Results = (props) => {
    // Uses helper function to determine which user has won, returns
    const determinedWinner = determineWinner(
        props.playerOneTotal,
        props.playerTwoTotal
    );
    const resultMessage = getGameOverMessage(determinedWinner);
    // State that tracks who has won using the helper function
    const [gameWinner, setGameWinner] = useState({});

    // On component mount, check who has won the game.
    useEffect(() => {
        if (determinedWinner === "player1") {
            const dummy = props.userOnePokemon;
            setGameWinner(dummy);
        } else if (determinedWinner === "player2") {
            const dummy = props.userTwoPokemon;
            setGameWinner(dummy);
        } else {
            setGameWinner({});
        }
    }, [determinedWinner, props.userOnePokemon, props.userTwoPokemon]);

    if (gameWinner.evoSprites) {
        return (
            <>
                <div className="results-message">
                    <h2>Good game!</h2>
                    <p>{resultMessage}</p>
                </div>
                <div className="evolution-display">
                    {
                        // If determined winner is not player1, player2, or there is no tie
                        determinedWinner === "player1" ||
                        determinedWinner === "player2" ? (
                            <div className="winner-display">
                                <p>
                                    Your{" "}
                                    {`${gameWinner.name} has evolved into ${gameWinner.evoName}!`}
                                </p>
                                <img
                                    src={`${gameWinner.sprites.front}`}
                                    alt=""
                                    className="pre-evolution"
                                />
                                <img
                                    src={`${gameWinner.evoSprites.front}`}
                                    alt=""
                                    className="post-evolution"
                                />
                            </div>
                        ) : null
                    }
                </div>
            </>
        );
    } else if (Object.keys(gameWinner).length === 0) {
        return (
            <p>
                It appears you have both tied. Win the game to evolve your
                Pokemon!
            </p>
        );
    } else {
        return <h2>Loading...</h2>;
    }
};

export default Results;
