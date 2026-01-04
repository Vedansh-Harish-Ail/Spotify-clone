
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

    // Load the first song if available
    if (songs.length > 0) {
        loadSong(0);
        // Note: Browsers block autoplay without interaction, so we just load it
    } else {
        songTitle.textContent = "Drag & Drop MP3 files here!";
        songArtist.textContent = "to add them to your library";
    }
}



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

    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }

    loadSong(currentSongIndex);
    audio.play();
    playBtn.textContent = '⏸️';
}

// Previous song
function prevSong() {
    if (songs.length === 0) return;

    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }

    loadSong(currentSongIndex);
    audio.play();
    playBtn.textContent = '⏸️';
}

// Remix & Shuffle Logic
let isShuffle = false;
const shuffleBtn = document.getElementById('shuffle-btn');
const remixToggle = document.getElementById('remix-toggle');
const remixPanel = document.getElementById('remix-controls');
const speedSlider = document.getElementById('speed-slider');
const speedVal = document.getElementById('speed-val');

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

remixToggle.addEventListener('click', () => {
    const isHidden = remixPanel.style.display === 'none';
    remixPanel.style.display = isHidden ? 'block' : 'none';
    remixToggle.classList.toggle('active', isHidden);
});

speedSlider.addEventListener('input', (e) => {
    const speed = e.target.value;
    audio.playbackRate = speed;
    speedVal.textContent = speed + 'x';
});

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

// Mobile Mini-Player Logic
const playerSection = document.querySelector('.player-section');
const playerContent = document.querySelector('.player-section'); // Refers to same main container

// Expand on click (Mobile only)
playerSection.addEventListener('click', (e) => {
    // Only expand if screen is mobile size
    if (window.innerWidth <= 480) {
        // Prevent closing/opening if clicking actual control buttons (propagate but don't toggle if logic requires)
        // Actually, better UX: Clicking anywhere opens it, but clicking controls performs action naturally.

        // Check if we didn't click a button directly (buttons handle their own events)
        const isButton = e.target.closest('button') || e.target.closest('input');

        if (!isButton) {
            playerSection.classList.toggle('expanded');
        }

        // Also allow closing by clicking a "down" arrow if we added one, 
        // or just toggle for now. 
        // If it's already expanded and we click non-interactive area, close it?
        // Let's stick to toggle behavior on the 'handle' area.
    }
});

