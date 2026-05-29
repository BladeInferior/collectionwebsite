import os
import requests

url_base = "https://play.pokemonshowdown.com/sprites/home/"
out_dir = "pokemon_icons"

os.makedirs(out_dir, exist_ok=True)


# STEP 1: get file list from directory listing (simple scrape)
import requests
from bs4 import BeautifulSoup

html = requests.get(url_base).text
soup = BeautifulSoup(html, "html.parser")

files = [a['href'] for a in soup.find_all('a') if a['href'].endswith(".png")]

# Regional forms only
REGIONALS = ["-alola", "-galar", "-hisui", "-paldea"]

for filename in files:

    # Skip anything that is NOT a regional form
    if not any(region in filename for region in REGIONALS):
        continue

    r = requests.get(url_base + filename)

    if r.status_code == 200:

        with open(f"{out_dir}/{filename}", "wb") as out:
            out.write(r.content)

        print(f"Downloaded {filename}")

print("Done")