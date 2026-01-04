// Music Player with Drag & Drop Support
// Just drag MP3 files onto the page to add them!

let songs = [];
let currentSongIndex = 0;

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

// Initialize
function init() {
    audio.volume = 0.7;
    updateSongCount();

    // Show instructions if no songs
    if (songs.length === 0) {
        songTitle.textContent = "Drag & Drop MP3 files here!";
        songArtist.textContent = "Or click 'Add Songs' button below";
    }
}

// Add file input for selecting songs
const addSongsBtn = document.createElement('button');
addSongsBtn.textContent = '📁 Add Songs';
addSongsBtn.className = 'control-btn';
addSongsBtn.style.marginTop = '20px';
addSongsBtn.onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/mp3,audio/mpeg';
    input.multiple = true;
    input.onchange = (e) => handleFiles(e.target.files);
    input.click();
};
document.querySelector('.player-section').appendChild(addSongsBtn);

// Handle dropped/selected files
function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.name.endsWith('.mp3')) {
            const url = URL.createObjectURL(file);
            const songName = file.name.replace('.mp3', '').replace(/_/g, ' ');

            songs.push({
                title: songName,
                artist: 'Unknown Artist',
                file: url,
                cover: 'https://via.placeholder.com/300/667eea/ffffff?text=' + encodeURIComponent(songName.substring(0, 20))
            });
        }
    });

    updateSongCount();
    renderPlaylist();

    if (songs.length === 1) {
        loadSong(0);
    }
}

// Drag and drop handlers
document.body.addEventListener('dragover', (e) => {
    e.preventDefault();
    document.body.style.background = 'linear-gradient(135deg, #1ed760 0%, #667eea 100%)';
});

document.body.addEventListener('dragleave', (e) => {
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
});

document.body.addEventListener('drop', (e) => {
    e.preventDefault();
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    handleFiles(e.dataTransfer.files);
});

// Update song count
function updateSongCount() {
    songCount.textContent = songs.length;
}

// Load song
function loadSong(index) {
    if (songs.length === 0) return;

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
    if (songs.length === 0) {
        alert('Please add some MP3 files first!');
        return;
    }

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
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playBtn.textContent = '⏸️';
}

// Previous song
function prevSong() {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playBtn.textContent = '⏸️';
}

// Format time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
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

    if (songs.length === 0) {
        songList.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">No songs yet. Drag MP3 files here!</p>';
        return;
    }

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
renderPlaylist();
