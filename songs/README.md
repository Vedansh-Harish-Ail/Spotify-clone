# How to Add Your MP3 Songs

## Step 1: Put Your MP3 Files Here
Copy all your MP3 files into this `songs` folder.

## Step 2: Update script.js
Open `script.js` and update the songs array with your filenames:

```javascript
const songs = [
    {
        title: "Kesariya",
        artist: "Arijit Singh",
        file: "songs/kesariya.mp3",
        cover: "https://via.placeholder.com/300/667eea/ffffff?text=Kesariya"
    },
    {
        title: "Your Song Name",
        artist: "Artist Name",
        file: "songs/your-filename.mp3",
        cover: "https://via.placeholder.com/300/764ba2/ffffff?text=Song"
    }
];
```

## Step 3: Open index.html
That's it! Your songs will play.

## Optional: Add Album Covers
Replace the placeholder URLs with actual image URLs or local image paths.
