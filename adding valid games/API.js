const fs = require("fs");

// -----------------------------
// LOAD MASTER POKÉMON LIST
// -----------------------------
const pokemon = JSON.parse(
    fs.readFileSync("./pokemonGenned.json", "utf-8")
);

// -----------------------------
// LOAD GAME DEX FILES
// -----------------------------
const gameDex = {
    swsh: JSON.parse(fs.readFileSync("./swsh.json", "utf-8")),
    pla: JSON.parse(fs.readFileSync("./pla.json", "utf-8")),
    scvi: JSON.parse(fs.readFileSync("./scvi.json", "utf-8")),
    plza: JSON.parse(fs.readFileSync("./plza.json", "utf-8"))
};

// -----------------------------
// NORMALISE FUNCTION
// -----------------------------
function normalize(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// -----------------------------
// BUILD LOOKUP SETS
// -----------------------------
const gameSets = {};
for (const [game, list] of Object.entries(gameDex)) {
    gameSets[game] = new Set(list.map(normalize));
}

// -----------------------------
// TRACKING MISSING ENTRIES
// -----------------------------
const missingReport = {
    swsh: [],
    pla: [],
    scvi: [],
    plza: []
};

// reverse lookup set for quick validation
const masterSet = new Set(pokemon.map(p => normalize(p.name)));

// -----------------------------
// MERGE LOGIC
// -----------------------------
const updated = pokemon.map(p => {

    const key = normalize(p.name);
    const games = [];

    for (const [game, set] of Object.entries(gameSets)) {

        if (set.has(key)) {
            games.push(game);
        } else {
            // only report if it exists in the game list but NOT in master
            if (set.has(key) === false && masterSet.has(key) === false) {
                missingReport[game].push(key);
            }
        }
    }

    return {
        ...p,
        games
    };
});

const output = updated
    .map(p => {
        return `{ "name": "${p.name}", "dex": "${p.dex}", "games": ${JSON.stringify(p.games)} },`;
    })
    .join("\n");

fs.writeFileSync("./pokemonWithGames.json", output);

// -----------------------------
// CONSOLE SUMMARY
// -----------------------------
console.log("DONE ✔ pokemonWithGames.json created");

for (const [game, missing] of Object.entries(missingReport)) {
    console.log(`\n${game.toUpperCase()} missing matches: ${missing.length}`);
    if (missing.length > 0) {
        console.log(missing.slice(0, 10).join(", ") + (missing.length > 10 ? " ..." : ""));
    }
}

console.log("\nFull report saved to missingPokemonReport.json");