import { useEffect, useState } from "react";

const DisplayGame = () => {
	// Variables to store Pokemon that can evolve for both users
	const [userOneRandom, setUserOneRandom] = useState({});
	const [userTwoRandom, setUserTwoRandom] = useState({});

	// const [userOnePokemon, setUserOnePokemon] = useState({});
	// const [userTwoPokemon, setUserTwoPokemon] = useState({});

	// RNG
	const getRandomInt = (max) => {
		return Math.floor(Math.random() * max + 1);
	};

	// Highest evolution chain index
	const maxEvoChains = 476;

	// Set Pokemon based on which user
	const setRandomChoice = (res, user) => {
		if (user === "first") {
			setUserOneRandom({
				name: res.chain.species.name,
				url: res.chain.species.url.replace("-species", ""),
			});
			return userOneRandom.url;
		} else if (user === "second") {
			setUserTwoRandom({
				name: res.chain.species.name,
				url: res.chain.species.url.replace("-species", ""),
			});
			return userTwoRandom.url;
		}
	};

	// Make API calls until an evolution chain is found where the Pokemon can evolve
	const pickAPokemon = async (user) => {
		const pokeIndex = getRandomInt(maxEvoChains);

		await fetch(
			`https://pokeapi.co/api/v2/evolution-chain/${pokeIndex}`
		)
			.then((res) => {
				// If response is OK - proceed to parse JSON, else throw error
				if (res.ok) {
					return res.json();
				} else {
					throw new Error();
				}
			})
			.then((res) => {
				// If array is empty, make a recursive API call again
				if (res.chain["evolves_to"].length === 0) {
					return pickAPokemon(user);
				} else {
					// set Pokemon depending on which user we are generating it for
					const nextRequest = setRandomChoice(res, user);
					// make another request

					return;
				}
			})
			.catch((err) => {
				return pickAPokemon(user);
			});
	};

	// On component mount - determine the Pokemon to be assigned to the players
	useEffect(() => {
		// Pick a Pokemon for the first and the second users
		pickAPokemon("first");
		pickAPokemon("second");
	}, []);

	return <>{`${userOneRandom.name} vs ${userTwoRandom.name}`}</>;
};

export default DisplayGame;

// Pseudocode for getting a Pokemon
// Fetch a Pokemon, then check if it can evolve
// Fetch at this endpoint https://pokeapi.co/api/v2/evolution-chain/{endpoint}/
// Evolution check can be performed by seeing if res.chain.evolves_to is an empty array
// ! ----> If empty, we recursively make a call to the function so it can do the above again
// ! ----> If res.chain.evolves_to has anything in it:
// -----------> we change the firstCanEvolve boolean variable = true
// -----------> we can use response.chain.species.url which will look something like this - https://pokeapi.co/api/v2/pokemon-species/58/ and do response.chain.species.url.replace('-species', '') which will give us a URL to make another axios call to
