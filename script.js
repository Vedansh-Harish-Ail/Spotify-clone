// Simple HTML5 Audio Player for MP3 files

// INSTRUCTIONS: Put your MP3 files in a "songs" folder
// Update the songs array below with your MP3 filenames

const songs = [
    {
        title: "Song 1",
        artist: "Artist 1",
        file: "songs/song1.mp3",
        cover: "https://via.placeholder.com/300/667eea/ffffff?text=Song+1"
    },
    {
        title: "Song 2",
        artist: "Artist 2",
        file: "songs/song2.mp3",
        cover: "https://via.placeholder.com/300/764ba2/ffffff?text=Song+2"
    },
    {
        title: "Song 3",
        artist: "Artist 3",
        file: "songs/song3.mp3",
        cover: "https://via.placeholder.com/300/1ed760/ffffff?text=Song+3"
    }
    // Add more songs here following the same format
];

const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const volumeControl = document.getElementById('volume');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const albumImg = document.getElementById('album-img');
const songList = document.getElementById('song-list');
const songCount = document.getElementById('song-count');

let currentSongIndex = 0;

// Initialize
function init() {
    renderPlaylist();
    songCount.textContent = songs.length;
    audio.volume = 0.7;
}

// Load song
function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];

    audio.src = song.file;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumImg.src = song.cover;

    renderPlaylist();
}

// Play/Pause
function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸️';
    } else {
        audio.pause();
        playBtn.textContent = '▶️';
    }
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playBtn.textContent = '⏸️';
}

// Previous song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playBtn.textContent = '⏸️';
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update progress
function updateProgress() {
    const { currentTime, duration } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent || 0;

    currentTimeEl.textContent = formatTime(currentTime);
    if (duration) {
        durationEl.textContent = formatTime(duration);
    }
}

// Set progress
function setProgress(e) {
    const width = progressBar.offsetWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Render playlist
function renderPlaylist() {
    songList.innerHTML = '';

    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        if (index === currentSongIndex) {
            songItem.classList.add('active');
        }

        songItem.innerHTML = `
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
        `;

        songItem.addEventListener('click', () => {
            loadSong(index);
            audio.play();
            playBtn.textContent = '⏸️';
        });

        songList.appendChild(songItem);
    });
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
audio.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('click', setProgress);
volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});
audio.addEventListener('ended', nextSong);

// Initialize on load
init();
loadSong(0);
