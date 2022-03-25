// import PokemonDisplay from "./PokemonDisplay";
// import Hand from "./Hand";

// const Player = (props) => {
//     const { currentPoke, opponent, cards, total } = props;

//     return (
//         <>
//             <h2>Test Player Component</h2>
//             <PokemonDisplay
//                 currentPoke={currentPoke}
//                 opponent={opponent}
//             />

//             <Hand cards={cards} />

//             {isPlayerOneBust && <p>BUST!</p>}

//             <p>Total: {total}</p>

//             <button
//                 disabled={playerOneDone || activePlayer !== "player1"}
//                 onClick={handlePlayerOneHit}
//             >
//                 Hit
//             </button>

//             <button
//                 disabled={playerOneDone || activePlayer !== "player1"}
//                 onClick={() => {
//                     setPlayerOneDone(true);
//                 }}
//             >
//                 Stand
//             </button>

//             {playerOneDone && !playerTwoDone ? (
//                 <button
//                     onClick={() => {
//                         setActivePlayer("player2");
//                     }}
//                 >
//                     Player Two's Turn!
//                 </button>
//             ) : null}
//         </>
//     );

    
// };

// export default Player;
