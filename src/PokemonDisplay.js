const PokemonDisplay = (props) => {
    // Destructure props object
    const { currentPoke, opponent } = props;

    // Only render if the data is available
    if (opponent.sprites && currentPoke.sprites) {
        return (
            <>
                <div className="opponent-display">
                    <div className="details-container">
                        <p className="poke-name">{opponent.name}</p>
                    </div>
                    <div className="img-container">
                        <img
                            src={opponent.sprites.front}
                            alt={`A picture of your opponent, ${opponent.name}`}
                        />
                    </div>
                </div>

                <div className="current-poke-display">
                    <div className="img-container">
                        <img
                            src={currentPoke.sprites.back}
                            alt={`A picture of your pokemon, ${currentPoke.name}`}
                        />
                    </div>
                    <div className="details-container">
                        <p className="poke-name">{currentPoke.name}</p>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <h2>Loading...</h2>
        );
    }
}

export default PokemonDisplay; 