import { useEffect, useState } from "react";

const PokemonDisplay = (props) => {
    // Destructure props object
    const {
        currentPoke,
        opponent,
        currentHealth,
        opponentHealth,
        currentPlayer,
    } = props;

    // This useEffect gets a random decimal and assigns it as a key to the elements we need the animation to run on again. Since its value changes, React will re-render it along with the animation on player change.
    const [newKey, setNewKey] = useState(0);

    useEffect(() => {
        setNewKey(Math.random());
        // Only change the key value when currentPlayer changes
    }, [currentPlayer]);

    // Only render if the data is available
    if (opponent.sprites && currentPoke.sprites) {
        return (
            <div className="pokemon-display">
                <div className="opponent-display">
                    <div className="details-container box-in" key={newKey}>
                        <p className="poke-name">
                            {opponent.name}
                            {opponent.shiny ? (
                                <span className="shiny-status">
                                    {` `}(Shiny)
                                </span>
                            ) : null}
                        </p>

                        <p className="hit-points">HP: {opponentHealth} / 21</p>
                    </div>

                    <div className="img-container">
                        <img
                            src={opponent.sprites.front}
                            alt={`Your opponent's pokemon, ${opponent.name}`}
                            className="opponent-in"
                            key={newKey}
                        />
                    </div>
                </div>

                <div className="poke-display">
                    <div className="img-container">
                        <img
                            src={currentPoke.sprites.back}
                            alt={`Your pokemon, ${currentPoke.name}`}
                            className="current-in"
                            key={newKey}
                        />
                    </div>

                    <div className="details-container box-in" key={newKey}>
                        <p className="poke-name">
                            {currentPoke.name}
                            {currentPoke.shiny ? (
                                <span className="shiny-status">
                                    {` `}(Shiny)
                                </span>
                            ) : null}
                        </p>

                        <p className="hit-points">HP: {currentHealth} / 21</p>
                    </div>
                </div>
            </div>
        );
    } else {
        return <h2>Loading...</h2>;
    }
};

export default PokemonDisplay;
