const fs = require("fs");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const TOTAL = 1025;

async function generate() {

    const list = [];

    for (let i = 1; i <= TOTAL; i++) {

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
        const data = await res.json();

        const name = data.name;

        list.push({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            dex: String(i).padStart(4, "0")
        });

        console.log(`Fetched ${i}`);
    }

    // -----------------------------
    // CUSTOM JSON FORMAT OUTPUT
    // -----------------------------
    let output = "[\n";

    list.forEach((p, index) => {

        output += `  { "name": "${p.name}", "dex": "${p.dex}" }`;

        if (index < list.length - 1) output += ",";

        output += "\n";
    });

    output += "]";

    fs.writeFileSync("pokemonGenned.json", output);

    console.log("Done!");
}

generate();