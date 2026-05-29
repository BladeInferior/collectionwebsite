import os

folder = "pokemon_sprites" 

deleted = 0

for file in os.listdir(folder):
    if file.endswith("-f.png"):
        path = os.path.join(folder, file)
        os.remove(path)
        print("Deleted:", file)
        deleted += 1

print(f"\nDone. Deleted {deleted} files.")