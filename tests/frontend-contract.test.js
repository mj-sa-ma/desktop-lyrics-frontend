const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("desktop lyrics frontend exposes the expected application regions", () => {
  const html = readProjectFile("index.html");

  assert.match(html, /<main[^>]+class="[^"]*\bshell\b/);
  assert.match(html, /data-role="track-context"/);
  assert.match(html, /data-role="lyrics-stage"/);
  assert.match(html, /data-role="player-controls"/);
  assert.match(html, /data-role="queue-panel"/);
  assert.match(html, /src="src\/app\.js"/);
  assert.match(html, /href="src\/styles\.css"/);
});

test("styles define responsive desktop lyrics layout tokens", () => {
  const css = readProjectFile("src/styles.css");

  assert.match(css, /:root\s*{/);
  assert.match(css, /--surface:/);
  assert.match(css, /--accent:/);
  assert.match(css, /\.lyrics-stage/);
  assert.match(css, /@media\s*\(max-width:\s*860px\)/);
  assert.match(css, /grid-template-columns/);
});

test("application script wires lyric timing and controls", () => {
  const js = readProjectFile("src/app.js");

  assert.match(js, /const\s+lyrics\s*=\s*\[/);
  assert.match(js, /function\s+renderLyrics/);
  assert.match(js, /function\s+setActiveLyric/);
  assert.match(js, /playToggle\.addEventListener/);
  assert.match(js, /progress\.addEventListener/);
});
