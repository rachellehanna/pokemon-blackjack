import { useEffect, useState } from "react";
import { getGameOverMessage, determineWinner } from "./helpers/blackjack";

const Results = (props) => {
    const determinedWinner = determineWinner(
        props.playerOneTotal,
        props.playerTwoTotal
    );
    const resultMessage = getGameOverMessage(determinedWinner);

    let gameWinner = {};
    if (determinedWinner === "player1") {
        gameWinner = props.userOnePokemon;
    } else if (determinedWinner === "player2") {
        gameWinner = props.userTwoPokemon;
    }

    if (gameWinner.evoSprites) {
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
                            <div className="winnerDisplay">
                                <p>
                                    Your{" "}
                                    {`${gameWinner.name} has evolved into ${gameWinner.evoName}!`}
                                </p>
                                <img
                                    src={`${gameWinner.evoSprites.front}`}
                                    alt=""
                                />
                            </div>
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
    } else {
        return <h2>Loading...</h2>;
    }
};

export default Results;
