const fs = require("fs");
const path = require("path");

const folder = "./collection-hub/popfigures"; // change if needed
const outputFile = "./popfigures-generated.json";

const files = fs.readdirSync(folder);

// only image files
const imageFiles = files.filter(f =>
    /\.(png|jpg|jpeg|webp)$/i.test(f)
);

// helper: strip extension
function stripExt(name) {
    return name.replace(/\.(png|jpg|jpeg|webp)$/i, "");
}

// helper: extract prefix number
function getNumber(name) {
    const match = name.match(/^(\d+)/);
    return match ? match[1] : null;
}

// helper: build title "01. Batman"
function buildTitle(number, base) {
    const cleaned = base
        .replace(/^\d+/, "")       // remove leading number
        .replace(/box|out|alt/gi, "") // remove suffix types
        .replace(/[^a-zA-Z]/g, " ")   // clean symbols
        .trim();

    const titleCase = cleaned
        .split(" ")
        .filter(Boolean)
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(" ");

    return `${number}. ${titleCase}`;
}

// group items
const groups = {};

for (const file of imageFiles) {
    const name = stripExt(file);
    const number = getNumber(name);

    if (!number) continue;

    const base = name.replace(/box|out|alt/gi, "");

    if (!groups[number]) {
        groups[number] = [];
    }

    groups[number].push(name);
}

// build JSON
const output = [];

for (const number of Object.keys(groups).sort()) {
    let items = groups[number];

    // order: box first
    items.sort((a, b) => {
        if (a.includes("box")) return -1;
        if (b.includes("box")) return 1;
        return a.localeCompare(b);
    });

    const title = buildTitle(number, items[0]);

    output.push({
        title,
        images: items,
        variant: "",
        franchise: "",
        tags: []
    });
}

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

console.log(`Generated ${output.length} items → ${outputFile}`);