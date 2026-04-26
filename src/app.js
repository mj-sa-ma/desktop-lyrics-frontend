const lyrics = [
  { time: 0, text: "City lights are warming up the glass" },
  { time: 16, text: "I hear the station humming under every pass" },
  { time: 32, text: "You left a signal in the midnight air" },
  { time: 48, text: "I keep it close like a song we used to share" },
  { time: 66, text: "Turn the skyline into silver" },
  { time: 82, text: "Let the echo find the room" },
  { time: 98, text: "Every heartbeat pulls me nearer" },
  { time: 114, text: "To the neon edge of you" },
  { time: 132, text: "I was walking through the static on my own" },
  { time: 150, text: "Counting every window like a metronome" },
  { time: 168, text: "Then the chorus opened like a door" },
  { time: 186, text: "And I knew the night could carry more" },
  { time: 204, text: "Turn the skyline into silver" },
  { time: 220, text: "Let the echo find the room" },
  { time: 236, text: "Every heartbeat pulls me nearer" }
];

const queue = [
  { title: "Neon Skyline", artist: "Ari Vale", time: "4:04" },
  { title: "Low Tide Radio", artist: "Mira Coast", time: "3:28" },
  { title: "North Terminal", artist: "Hale Room", time: "3:52" },
  { title: "Soft Circuit", artist: "Kira Noon", time: "4:11" }
];

const durationSeconds = 244;
let currentSeconds = 52;
let activeLyricIndex = -1;
let isPlaying = false;
let playbackTimer = null;

const root = document.documentElement;
const lyricsStage = document.querySelector(".lyrics-stage");
const lyricsList = document.getElementById("lyricsList");
const queueList = document.getElementById("queueList");
const playToggle = document.getElementById("playToggle");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const fontSize = document.getElementById("fontSize");
const lineSpacing = document.getElementById("lineSpacing");
const focusMode = document.getElementById("focusMode");

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function renderLyrics() {
  lyricsList.innerHTML = lyrics
    .map((line, index) => `<li class="lyric-line" data-index="${index}">${line.text}</li>`)
    .join("");
}

function renderQueue() {
  queueList.innerHTML = queue
    .map(
      (track, index) => `
        <article class="queue-item">
          <span class="queue-index">${index + 1}</span>
          <div>
            <div class="queue-title">${track.title}</div>
            <div class="queue-artist">${track.artist}</div>
          </div>
          <span class="queue-time">${track.time}</span>
        </article>
      `
    )
    .join("");
}

function setActiveLyric(seconds = currentSeconds) {
  const nextIndex = lyrics.reduce((activeIndex, line, index) => {
    return seconds >= line.time ? index : activeIndex;
  }, 0);

  if (nextIndex === activeLyricIndex) {
    return;
  }

  activeLyricIndex = nextIndex;
  const lines = lyricsList.querySelectorAll(".lyric-line");

  lines.forEach((line, index) => {
    line.classList.toggle("is-active", index === activeLyricIndex);
    line.classList.toggle("is-next", index === activeLyricIndex + 1);
  });

  const activeLine = lines[activeLyricIndex];
  if (activeLine) {
    const offset = activeLine.offsetTop - lyricsList.clientHeight * 0.34;
    lyricsList.scrollTo({ top: Math.max(offset, 0), behavior: "smooth" });
  }
}

function syncTimeline() {
  progress.value = String(currentSeconds);
  currentTime.textContent = formatTime(currentSeconds);
  duration.textContent = formatTime(durationSeconds);
}

function setPlayIcon(iconName) {
  playToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function stopPlayback() {
  isPlaying = false;
  window.clearInterval(playbackTimer);
  playbackTimer = null;
  playToggle.title = "Play";
  setPlayIcon("play");
}

function startPlayback() {
  isPlaying = true;
  playToggle.title = "Pause";
  setPlayIcon("pause");

  playbackTimer = window.setInterval(() => {
    currentSeconds = Math.min(currentSeconds + 1, durationSeconds);
    syncTimeline();
    setActiveLyric();

    if (currentSeconds >= durationSeconds) {
      stopPlayback();
    }
  }, 1000);
}

playToggle.addEventListener("click", () => {
  if (isPlaying) {
    stopPlayback();
    return;
  }

  startPlayback();
});

progress.addEventListener("input", (event) => {
  currentSeconds = Number(event.target.value);
  syncTimeline();
  setActiveLyric();
});

fontSize.addEventListener("input", (event) => {
  root.style.setProperty("--lyric-font-size", `${event.target.value}px`);
});

lineSpacing.addEventListener("input", (event) => {
  root.style.setProperty("--lyric-line-height", event.target.value);
});

focusMode.addEventListener("change", (event) => {
  lyricsStage.classList.toggle("is-focused", event.target.checked);
});

document.querySelectorAll(".mode-switch button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".mode-switch .is-active")?.classList.remove("is-active");
    button.classList.add("is-active");
  });
});

document.querySelectorAll(".swatch").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".swatch.is-selected")?.classList.remove("is-selected");
    button.classList.add("is-selected");
    root.style.setProperty("--accent", button.style.getPropertyValue("--swatch"));
  });
});

renderLyrics();
renderQueue();
syncTimeline();
setActiveLyric();
lyricsStage.classList.toggle("is-focused", focusMode.checked);

if (window.lucide) {
  window.lucide.createIcons();
}
