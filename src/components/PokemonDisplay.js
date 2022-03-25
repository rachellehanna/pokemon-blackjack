// Using props, create a variable that tracks when a round finishes and begins
// Assign the sliding-in classes when a round is beginning
// Assign the sliding-out classes when a round is ending

const PokemonDisplay = (props) => {
    // Destructure props object
    const { currentPoke, opponent, currentHealth, opponentHealth } = props;

    // Only render if the data is available
    if (opponent.sprites && currentPoke.sprites) {
        return (
            <>
                <div className="opponent-display">
                    <div className="details-container opponent-box-in">
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
                        />
                    </div>
                </div>

                <div className="poke-display">
                    <div className="img-container">
                        <img
                            src={currentPoke.sprites.back}
                            alt={`Your pokemon, ${currentPoke.name}`}
                            className="current-in"
                        />
                    </div>
                    <div className="details-container current-box-in">
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
