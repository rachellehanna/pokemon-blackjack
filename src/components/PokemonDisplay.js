// When re-rendering a component, React compares the new render with the old one and only updates what has changed - this is why the animation only runs on page load (player 1's turn)

const PokemonDisplay = (props) => {
    // Destructure props object
    const { currentPoke, opponent, currentHealth, opponentHealth } = props;

    const animationRunner = () => {
        let changeMe = Math.random();
        console.log(changeMe);
        return changeMe;
    }

    // Only render if the data is available
    if (opponent.sprites && currentPoke.sprites) {
        return (
            <>
                <div className="opponent-display">
                    <div
                        className="details-container box-in"
                        key={animationRunner()}
                    >
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
                            key={animationRunner()}
                        />
                    </div>
                </div>

                <div className="poke-display">
                    <div className="img-container">
                        <img
                            src={currentPoke.sprites.back}
                            alt={`Your pokemon, ${currentPoke.name}`}
                            className="current-in"
                            key={animationRunner()}
                        />
                    </div>
                    <div
                        className="details-container box-in"
                        key={animationRunner()}
                    >
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
