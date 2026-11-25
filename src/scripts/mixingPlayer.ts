import simulationTimes from "../data/mixingTimes.json";

const fps = 30;
const posterFrame = 75;
const lastFrame = simulationTimes.length - 1;

export function enhanceMixingPlayer(figure: HTMLElement) {
  const video = figure.querySelector("video")!;
  const controls = figure.querySelector<HTMLElement>("[data-controls]")!;
  const play = controls.querySelector("button")!;
  const slider = controls.querySelector("input")!;
  const time = controls.querySelector<HTMLElement>("[data-time]")!;
  const status = figure.querySelector<HTMLElement>("[data-media-status]")!;
  let preview = true;
  let currentFrame = posterFrame;
  let pendingSeek: number | undefined;

  function showFrame(frame: number) {
    currentFrame = Math.min(lastFrame, Math.max(0, frame));
    const t = simulationTimes[currentFrame];
    time.textContent = (preview ? "preview · " : "") + "t = " + t.toFixed(2);
    slider.value = String(currentFrame);
    slider.setAttribute("aria-valuetext", (preview ? "Preview, " : "") + "t = " + t.toFixed(3));
  }

  function fromVideo(seconds: number) {
    if (!preview && !video.seeking && pendingSeek === undefined) {
      const frame = Math.min(lastFrame, Math.floor(seconds * fps + 0.0001));
      if (frame !== currentFrame) showFrame(frame);
    }
  }

  // Read the simulation time for the frame the browser actually presents.
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
    if (!video.paused) tick();
  }

  function statusMessage(message = "") {
    status.textContent = message;
    status.hidden = !status.textContent;
  }

  function playbackLabel() {
    play.textContent = video.paused ? "play" : "pause";
    play.setAttribute("aria-label", preview ? "Play simulation from the start" : play.textContent + " simulation");
  }

  video.addEventListener("play", () => {
    preview = false;
    showFrame(Math.floor(video.currentTime * fps));
    playbackLabel();
  });
  video.addEventListener("playing", () => statusMessage());
  video.addEventListener("pause", playbackLabel);
  play.addEventListener("click", () => {
    if (!video.paused) { video.pause(); return; }
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

  function mediaError() {
    controls.hidden = true;
    video.controls = true;
    statusMessage("the simulation movie could not be loaded.");
  }
  video.addEventListener("error", mediaError);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  function pauseForReducedMotion() {
    if (reducedMotion.matches) {
      video.autoplay = false;
      video.pause();
    }
  }
  pauseForReducedMotion();
  reducedMotion.addEventListener("change", pauseForReducedMotion);

  slider.max = String(lastFrame);
  preview = video.paused && video.currentTime === 0;
  showFrame(preview ? posterFrame : Math.floor(video.currentTime * fps));
  playbackLabel();
  video.controls = false;
  controls.hidden = false;
  if (video.error) mediaError();
}
