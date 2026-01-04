import os
import json

# Configuration
SONG_FOLDER = 'song_mp3'
MANIFEST_FILE = 'songs.json'

def generate_manifest():
    # Check if folder exists
    if not os.path.exists(SONG_FOLDER):
        print(f"Error: Folder '{SONG_FOLDER}' not found!")
        return

    # Valid extensions
    valid_extensions = ('.mp3', '.wav', '.ogg')

    # Get list of files
    songs = []
    try:
        files = os.listdir(SONG_FOLDER)
        for file in files:
            if file.lower().endswith(valid_extensions):
                songs.append(file)
        
        # Sort alphabetically
        songs.sort()

        # Write to JSON
        with open(MANIFEST_FILE, 'w', encoding='utf-8') as f:
            json.dump(songs, f, indent=4, ensure_ascii=False)
        
        print(f"✅ Success! Found {len(songs)} songs.")
        print(f"📄 Updated '{MANIFEST_FILE}' automatically.")
        print("🚀 You can now push your code to GitHub!")

    except Exception as e:
        print(f"❌ Error generating manifest: {e}")

if __name__ == "__main__":
    print("🎵 Scanning for songs...")
    generate_manifest()
    input("\nPress Enter to exit...")
