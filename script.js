const songs = [
    { title: "Identity", artist: "Burning Spear", src: "songs/song-1.mp3" },
    { title: "Larger Than Life", artist: "Cina Soul ft. Stonebwoy", src: "songs/song-2.mp3" },
    { title: "Inna Song (Gin & Lime)", artist: "Darkovibes ft. King Promise", src: "songs/song-3.mp3" },
    { title: "Enam Modzi", artist: "Enam", src: "songs/song-4.mp3" },
    { title: "Aflao Border Boy", artist: "Keeny Ice", src: "songs/song-5.mp3" },
    { title: "One Voice", artist: "Glorious", src: "songs/song-6.mp3" },
    { title: "Want Me", artist: "OV ft. Stonebwoy", src: "songs/song-7.mp3" }
];

// 2. Grab the elements
const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentTimeEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist");

let currentSong = 0;
let isPlaying = false;

// 3. Load a song into the player
function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  updateActive();
}

// 4. Play / pause toggle
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = "▶";
  } else {
    audio.play();
    playBtn.textContent = "⏸";
  }
  isPlaying = !isPlaying;
}

playBtn.addEventListener("click", togglePlay);

// Next / previous
function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  if (isPlaying) audio.play();
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  if (isPlaying) audio.play();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// 6. Time formatting (seconds -> m:ss)
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// 7. Show duration once the song's data has loaded
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

// 8. Update progress bar and current time as the song plays
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// 9. Seek when the user drags the progress bar
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// 10. Volume control
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

// 11. Autoplay: when a song ends, play the next one 
audio.addEventListener("ended", () => {
    isPlaying = true;
    playBtn.textContent = "⏸";
    nextSong()
});

// 12. Build the playlist from the songs array
function buildPlaylist() {
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener("click", () => {
      currentSong = index;
      loadSong(currentSong);
      isPlaying = true;
      playBtn.textContent = "⏸";
      audio.play();
    });
    playlistEl.appendChild(li);
  });
}

// 13. Highlight the song that's currently loaded
function updateActive() {
  document.querySelectorAll("#playlist li").forEach((li, index) => {
    li.classList.toggle("active", index === currentSong);
  });
}

buildPlaylist();

// 5. Load the first song when the page opens
loadSong(currentSong);
