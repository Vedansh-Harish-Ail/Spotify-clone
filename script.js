// Popular Indian Songs with YouTube IDs
const songs = [
    {
        title: "Kesariya",
        artist: "Arijit Singh - Brahmastra",
        youtubeId: "QANQBrzUPB8"
    },
    {
        title: "Apna Bana Le",
        artist: "Arijit Singh - Bhediya",
        youtubeId: "qri7abitAu8"
    },
    {
        title: "Tum Hi Ho",
        artist: "Arijit Singh - Aashiqui 2",
        youtubeId: "IJq0yyWug1k"
    },
    {
        title: "Chaleya",
        artist: "Arijit Singh - Jawan",
        youtubeId: "OqzMeH_Ym1U"
    },
    {
        title: "Raataan Lambiyan",
        artist: "Jubin Nautiyal - Shershaah",
        youtubeId: "ixMVSPqMRbU"
    },
    {
        title: "Deva Deva",
        artist: "Arijit Singh - Brahmastra",
        youtubeId: "nCHP3PQqxSQ"
    },
    {
        title: "Pal Pal Dil Ke Paas",
        artist: "Kishore Kumar - Classic",
        youtubeId: "yzU_t0Xy-Ow"
    },
    {
        title: "Tere Hawaale",
        artist: "Arijit Singh - Laal Singh Chaddha",
        youtubeId: "Dz0QGW7kNkI"
    }
];

let player;
let currentSongIndex = 0;

// Load YouTube IFrame API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// YouTube API Ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '400',
        width: '100%',
        videoId: songs[0].youtubeId,
        playerVars: {
            'playsinline': 1,
            'controls': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('Player ready!');
    renderPlaylist();
    updateNowPlaying();

    // Set initial volume
    player.setVolume(50);
}

function onPlayerStateChange(event) {
    // Update play button when video ends
    if (event.data == YT.PlayerState.ENDED) {
        playNext();
    }

    // Update play button text
    const playBtn = document.getElementById('play-btn');
    if (event.data == YT.PlayerState.PLAYING) {
        playBtn.textContent = '⏸️ Pause';
    } else {
        playBtn.textContent = '▶️ Play';
    }
}

function renderPlaylist() {
    const songList = document.getElementById('song-list');
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
            playSong(index);
        });

        songList.appendChild(songItem);
    });
}

function playSong(index) {
    currentSongIndex = index;
    player.loadVideoById(songs[index].youtubeId);
    updateNowPlaying();
    renderPlaylist();
}

function updateNowPlaying() {
    const song = songs[currentSongIndex];
    document.getElementById('song-title').textContent = song.title;
    document.getElementById('song-artist').textContent = song.artist;
}

function playNext() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

function playPrevious() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

// Control Buttons
document.getElementById('play-btn').addEventListener('click', () => {
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

document.getElementById('next-btn').addEventListener('click', playNext);
document.getElementById('prev-btn').addEventListener('click', playPrevious);

// Volume Control
document.getElementById('volume').addEventListener('input', (e) => {
    player.setVolume(e.target.value);
});
