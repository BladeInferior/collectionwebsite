const fs = require("fs");

// -----------------------------
// LOAD POKÉMON
// -----------------------------
const pokemon = JSON.parse(
    fs.readFileSync("./pokemonWithGames.json", "utf-8")
);

// -----------------------------
// HELPER: parse dex safely
// -----------------------------
function getDexNumber(dex) {
    return parseInt(dex, 10);
}

// -----------------------------
// UPDATE
// -----------------------------
const updated = pokemon.map(p => {

    const dexNum = getDexNumber(p.dex);

    const games = new Set(p.games || []);

    // BDSP = 0001 → 0493
    if (dexNum >= 1 && dexNum <= 493) {
        games.add("bdsp");
    }

    return {
        ...p,
        games: [...games]
    };
});

// -----------------------------
// SAVE OUTPUT
// -----------------------------
const output = updated
    .map(p => {
        return `{ "name": "${p.name}", "dex": "${p.dex}", "games": ${JSON.stringify(p.games)} },`;
    })
    .join("\n");

fs.writeFileSync("./addBDSP.json", output);

console.log("✔ BDSP added to Pokémon 0001–0493");
console.log("✔ Saved as addBDSP.json");