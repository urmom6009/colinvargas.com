import simulationTimes from "../data/mixingTimes.json";

const fps = 30;
const columns = 16;
const rows = 12;
const bytesPerFrame = columns * rows * 2;
const posterFrame = 75;
const lastFrame = simulationTimes.length - 1;

// Component pairs are signed bytes. The source palette maps ±127 to ±1.5.
function drawVelocity(ctx: CanvasRenderingContext2D, samples: Int8Array, frame: number) {
  const { width, height } = ctx.canvas;
  const dx = width / columns;
  const dy = height / rows;
  // Thin the grid on phones so the arrowheads remain legible.
  const stride = ctx.canvas.clientWidth < 330 ? 2 : 1;
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  for (let row = 0; row < rows; row += stride) {
    for (let col = 0; col < columns; col += stride) {
      const offset = frame * bytesPerFrame + 2 * (row * columns + col);
      const u = samples[offset] / 127;
      const v = -samples[offset + 1] / 127; // Physical y increases upward.
      const speed = Math.hypot(u, v);
      const x = (col + 0.5) * dx;
      const y = (row + 0.5) * dy;
      const length = speed * 1.5 * 26 * stride;
      if (length < 2.4 * stride) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 0.01, y);
        continue;
      }
      const ux = u / speed, uy = v / speed;
      const tipX = x + ux * length / 2;
      const tipY = y + uy * length / 2;
      const head = Math.min(5.3 * stride, length * 0.46);
      ctx.moveTo(x - ux * length / 2, y - uy * length / 2);
      ctx.lineTo(tipX, tipY);
      ctx.moveTo(tipX - head * (ux + 0.54 * uy), tipY - head * (uy - 0.54 * ux));
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(tipX - head * (ux - 0.54 * uy), tipY - head * (uy + 0.54 * ux));
    }
  }
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 2.9 * stride;
  ctx.strokeStyle = "rgba(22, 26, 23, 0.80)";
  ctx.stroke();
  ctx.lineWidth = 1.15 * stride;
  ctx.strokeStyle = "rgba(248, 249, 241, 0.92)";
  ctx.stroke();
}

export function enhanceMixingPlayer(figure: HTMLElement) {
  const video = figure.querySelector("video")!;
  const canvas = figure.querySelector("canvas")!;
  const controls = figure.querySelector<HTMLElement>("[data-controls]")!;
  const play = controls.querySelector("button")!;
  const slider = controls.querySelector("input")!;
  const time = controls.querySelector<HTMLElement>("[data-time]")!;
  const toggle = figure.querySelector<HTMLInputElement>("input[type=checkbox]")!;
  const note = figure.querySelector<HTMLElement>("#velocity-note")!;
  const status = figure.querySelector<HTMLElement>("[data-media-status]")!;
  const ctx = canvas.getContext("2d");
  let samples: Int8Array | undefined;
  let preview = true;
  let velocityUnavailable = false;
  let currentFrame = posterFrame;
  let pendingSeek: number | undefined;

  function paintOverlay() {
    canvas.hidden = !samples || !toggle.checked || !!video.error;
    if (samples && ctx && !canvas.hidden) drawVelocity(ctx, samples, currentFrame);
  }

  function showFrame(frame: number) {
    currentFrame = Math.min(lastFrame, Math.max(0, frame));
    const t = simulationTimes[currentFrame];
    time.textContent = (preview ? "preview · " : "") + "t = " + t.toFixed(2);
    slider.value = String(currentFrame);
    slider.setAttribute("aria-valuetext", (preview ? "Preview, " : "") + "t = " + t.toFixed(3));
    paintOverlay();
  }

  function fromVideo(seconds: number) {
    if (!preview && !video.seeking && pendingSeek === undefined) {
      const frame = Math.min(lastFrame, Math.floor(seconds * fps + 0.0001));
      if (frame !== currentFrame) showFrame(frame);
    }
  }

  // Presented media time pairs each vector field with its displayed video frame.
  if (typeof video.requestVideoFrameCallback === "function") {
    const presented: VideoFrameRequestCallback = (_now, metadata) => {
      fromVideo(metadata.mediaTime);
      if (video.isConnected) video.requestVideoFrameCallback(presented);
    };
    video.requestVideoFrameCallback(presented);
  } else {
    const tick = () => {
      if (video.paused || video.ended) return;
      fromVideo(video.currentTime);
      requestAnimationFrame(tick);
    };
    video.addEventListener("playing", tick);
  }

  function statusMessage(message = "") {
    status.textContent = message || (velocityUnavailable ? "velocity arrows are unavailable." : "");
    status.hidden = !status.textContent;
  }

  function playbackLabel() {
    play.textContent = video.ended ? "replay" : video.paused ? "play" : "pause";
    play.setAttribute("aria-label", preview ? "Play simulation from the start" : play.textContent + " simulation");
  }

  video.addEventListener("play", () => {
    preview = false;
    showFrame(Math.floor(video.currentTime * fps));
    playbackLabel();
  });
  video.addEventListener("playing", () => statusMessage());
  video.addEventListener("pause", playbackLabel);
  video.addEventListener("ended", () => { showFrame(lastFrame); playbackLabel(); });
  play.addEventListener("click", () => {
    if (!video.paused) { video.pause(); return; }
    if (video.ended) video.currentTime = 0;
    video.play().catch((error: DOMException) => {
      if (!video.error && error.name !== "AbortError") statusMessage("playback paused. press play to try again.");
    });
  });

  function seekToSelection() {
    if (pendingSeek === undefined || video.readyState < HTMLMediaElement.HAVE_METADATA) return;
    // Seek inside the selected frame to avoid rounding onto the preceding sample.
    video.currentTime = (pendingSeek + 0.25) / fps;
    pendingSeek = undefined;
  }

  video.addEventListener("loadedmetadata", seekToSelection);
  video.addEventListener("seeked", () => {
    if (preview || pendingSeek !== undefined || video.seeking) return;
    video.removeAttribute("poster");
    showFrame(Math.floor(video.currentTime * fps));
    playbackLabel();
  });
  slider.addEventListener("input", () => {
    preview = false;
    video.pause();
    pendingSeek = slider.valueAsNumber;
    if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
      video.preload = "auto";
    } else {
      seekToSelection();
    }
  });

  toggle.addEventListener("change", paintOverlay);
  if (typeof ResizeObserver === "function") new ResizeObserver(paintOverlay).observe(video);
  if (ctx) {
    fetch(canvas.dataset.velocity!)
      .then(async response => {
        if (!response.ok) throw new Error("velocity asset unavailable");
        const bytes = new Int8Array(await response.arrayBuffer());
        if (bytes.length !== simulationTimes.length * bytesPerFrame) throw new Error("incomplete velocity data");
        samples = bytes;
        if (video.error) return;
        toggle.parentElement!.hidden = false;
        note.hidden = false;
        paintOverlay();
      })
      .catch(() => {
        velocityUnavailable = true;
        if (!video.error) statusMessage();
      });
  }
  video.addEventListener("error", () => {
    controls.hidden = true;
    canvas.hidden = true;
    toggle.parentElement!.hidden = true;
    note.hidden = true;
    video.controls = true;
    statusMessage("the simulation movie could not be loaded.");
  });

  slider.max = String(lastFrame);
  showFrame(posterFrame);
  video.controls = false;
  video.preload = "metadata";
  controls.hidden = false;
}
