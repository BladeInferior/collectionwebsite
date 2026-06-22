const fs = require("fs");

// Read existing file
const pokemonList = JSON.parse(
    fs.readFileSync("fullPokemonList.json", "utf8")
);

const updated = pokemonList.map(pokemon => {

    const dexNum = parseInt(pokemon.dex, 10);

    let generation;

    if (dexNum >= 1 && dexNum <= 151) generation = 1;
    else if (dexNum >= 152 && dexNum <= 251) generation = 2;
    else if (dexNum >= 252 && dexNum <= 386) generation = 3;
    else if (dexNum >= 387 && dexNum <= 493) generation = 4;
    else if (dexNum >= 494 && dexNum <= 649) generation = 5;
    else if (dexNum >= 650 && dexNum <= 721) generation = 6;
    else if (dexNum >= 722 && dexNum <= 809) generation = 7;
    else if (dexNum >= 810 && dexNum <= 905) generation = 8;
    else if (dexNum >= 906 && dexNum <= 1025) generation = 9;
    else generation = null;

    return {
        name: pokemon.name,
        generation: generation,
        dex: pokemon.dex,
        type: pokemon.type,
        games: pokemon.games
    };
});

// Write new file
fs.writeFileSync(
    "fullPokemonList-with-generations.json",
    JSON.stringify(updated, null, 2),
    "utf8"
);

console.log(
    `Done! Added generations to ${updated.length} Pokémon.`
);