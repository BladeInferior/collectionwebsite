import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import fs from "fs";

const RSS_URL = "https://letterboxd.com/bladeinferior/rss/";

async function run() {
    const res = await fetch(RSS_URL);
    const xml = await res.text();

    const data = await parseStringPromise(xml);

    const latest = data.rss.channel[0].item[0];

    const title = latest.title[0];
    const link = latest.link[0];

    // Letterboxd puts image in media:content
    const description = latest.description?.[0] || "";
    const imgMatch = description.match(/src="(.*?)"/);
    const poster = imgMatch ? imgMatch[1] : "";

    const output = {
        title,
        link,
        poster,
        rating: "",
        date: new Date().toLocaleDateString("en-GB")
    };

    fs.writeFileSync("latest-film.json", JSON.stringify(output, null, 2));

    console.log("Updated latest-film.json");
}

run();