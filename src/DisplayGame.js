import { useEffect, useState } from "react";
import axios from "axios";

const DisplayGame = () => {
	const [userOnePokemon, setUserOnePokemon] = useState({});
	const [userTwoPokemon, setUserTwoPokemon] = useState({});

	const getRandomInt = (max) => {
		return Math.floor(Math.random() * max) + 1;
	};

	// Pseudocode for getting a Pokemon
	// Fetch a Pokemon, then check if it can evolve
	// Fetch at this endpoint https://pokeapi.co/api/v2/evolution-chain/{endpoint}/
	// Evolution check can be performed by seeing if res.chain.evolves_to is an empty array
	// ! ----> If empty, we recursively make a call to the function so it can do the above again
	// ! ----> If res.chain.evolves_to has anything in it:
	// -----------> we change the firstCanEvolve boolean variable = true
	// -----------> we can use response.chain.species.url which will look something like this - https://pokeapi.co/api/v2/pokemon-species/58/ and do response.chain.species.url.replace('-species', '') which will give us a URL to make another axios call to

	// Logic below is wrong because while loops are synchronous meanwhile axios is async. Would not work
	/*// Keep generating numbers and trying them until an evolution chain is found where the Pokemon can evolve
		// Fetch a Pokemon, then check if it can evolve
		// Fetch at this endpoint https://pokeapi.co/api/v2/evolution-chain/{endpoint}/
		// Evolution check can be performed by seeing if res.chain.evolves_to is an empty array
		// If empty, we don't change the secondCanEvolve boolean variable
		// If res.chain.evolves_to has anything in it:
		// -- we change the secondCanEvolve boolean variable = true
		// -- we can use response.chain.species.url which will look something like this - https://pokeapi.co/api/v2/pokemon-species/58/
		// -- response.chain.species.url.replace('-species', '');
		// Make another API call to the above and save the response as an object userTwo*/

	// Make an API call to the PokemonAPI to determine the Pokemon assigned to the player
	useEffect(() => {
		// Randomly generate a number between 0 and 467 - the max number of unique Evo chains within the API
		const maxEvoChains = 468;

		// Make API calls with random generated numbers until an evolution chain is found where the Pokemon can evolve
		const getAPokemon = async (user) => {
			let pokeIndex = getRandomInt(maxEvoChains);

			await axios(
				`https://pokeapi.co/api/v2/evolution-chain/${pokeIndex}`
			)
				.then((res) => {
					// console.log(res.data)
					// If array is empty, make a recursive API call again
					if (res.data.chain["evolves_to"].length === 0) {
						return getAPokemon();
					} else {
						// Otherwise, if array is NOT empty, set that to user one's pokemon
						if (user === "first") {
							setUserOnePokemon({
								name: res.data.chain.species
									.name,
								url: res.data.chain.species.url.replace(
									"-species",
									""
								),
							});
						} else {
							setUserTwoPokemon({
								name: res.data.chain.species
									.name,
								url: res.data.chain.species.url.replace(
									"-species",
									""
								),
							});
						}
						return;
					}
				})
				.catch((err) => {
					console.log(
						"error! nothing exists at",
						pokeIndex
					);
					return getAPokemon(user);
				});
		};
		getAPokemon("first");
		getAPokemon("second");
	}, []);

	console.log("user two sends out", userTwoPokemon);
	console.log("user one sends out", userOnePokemon);

	return <></>;
};

export default DisplayGame;
