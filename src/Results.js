import { useEffect, useState } from "react";
import { getGameOverMessage, determineWinner } from "./helpers/blackjack";

const Results = (props) => {
    const determinedWinner = determineWinner(
        props.playerOneTotal,
        props.playerTwoTotal
    );
    const resultMessage = getGameOverMessage(determinedWinner);
    const [gameWinner, setGameWinner] = useState({});

    // On component mount, check who has won the game.
    useEffect(() => {
        if (determinedWinner === "player1") {
            setGameWinner(props.userOnePokemon);
        } else if (determinedWinner === "player2") {
            setGameWinner(props.userTwoPokemon);
        } else {
            setGameWinner({});
        }
    }, [determinedWinner, props.userOnePokemon, props.userTwoPokemon]);

    return (
        <section className="results">
            <div className="results-message">
                <h2>Good game!</h2>
                <p>{resultMessage}</p>
            </div>
            <div className="evolution-display">
                {
                    // If determined winner is null, then show tie message, otherwise show the game winner
                    determinedWinner ? (
                        <p>
                            Your{" "}
                            {`${gameWinner.name} has evolved into ${gameWinner.evoName}!`}
                        </p>
                    ) : (
                        <p>
                            It appears you have both tied. Win the game to
                            evolve your Pokemon!
                        </p>
                    )
                }
            </div>
        </section>
    );
};

export default Results;
