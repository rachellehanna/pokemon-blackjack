import { useEffect, useState } from "react";

const DisplayGame = () => {
	// Variables to store Pokemon that can evolve for both users
	const [userOnePokemon, setUserOnePokemon] = useState({});
	const [userTwoPokemon, setUserTwoPokemon] = useState({});

	const getRandomInt = (max) => {
		return Math.floor(Math.random() * max + 1);
	};

	// Highest evolution chain index
	const maxEvoChains = 476;

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
					setRandomChoice(res, user);
					return res;
				}
			})
			.catch((err) => {
				return pickAPokemon(user);
			});
	};

	// Set Pokemon based on which user we are generating it for
	const setRandomChoice = (res, user) => {
		// Make a request to the next endpoint where we want to save data from
		const nextRequestURL = res.chain.species.url.replace(
			"-species",
			""
		);

		fetch(nextRequestURL)
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				if (user === "first") {
					setUserOnePokemon(res);
				} else if (user === "second") {
					setUserTwoPokemon(res);
				}
			});

		return;
	};

	// On component mount - determine the Pokemon to be assigned to the players randomly
	useEffect(() => {
		pickAPokemon("first");
		pickAPokemon("second");
	}, []);

	return (
		<div>
			<p>{`${userOnePokemon.name} vs ${userTwoPokemon.name}`}</p>
		</div>
	);
};

export default DisplayGame;
