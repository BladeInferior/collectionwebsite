import os

folder = "pokemon_sprites"  # change if needed

matches = []

for file in os.listdir(folder):
    if "-" in file:
        matches.append(file)

print(f"\nFound {len(matches)} files containing '-':\n")

for name in sorted(matches):
    print(name)