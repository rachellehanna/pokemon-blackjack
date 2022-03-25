import {useState} from 'react';

const PokemonDisplay = (props) => {
    // Destructure props object
    const { currentPoke, opponent, currentHealth, opponentHealth } = props;

    // Only render if the data is available
    if (opponent.sprites && currentPoke.sprites) {
        return (
            <>
                <div className="opponent-display">
                    <div className="details-container">
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
                        />
                    </div>
                </div>

                <div className="poke-display">
                    <div className="img-container">
                        <img
                            src={currentPoke.sprites.back}
                            alt={`Your pokemon, ${currentPoke.name}`}
                        />
                    </div>
                    <div className="details-container">
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
            </>
        );
    } else {
        return <h2>Loading...</h2>;
    }
};

export default PokemonDisplay;
