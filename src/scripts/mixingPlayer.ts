import simulationTimes from "../data/mixingTimes.json";

const fps = 30;
const posterFrame = 75;
const lastFrame = simulationTimes.length - 1;

export function enhanceMixingPlayer(figure: HTMLElement) {
  const video = figure.querySelector("video")!;
  const controls = figure.querySelector<HTMLElement>("[data-controls]")!;
  const play = controls.querySelector("button")!;
  const playLabel = play.querySelector<HTMLElement>("[data-play-label]")!;
  const slider = controls.querySelector("input")!;
  const time = controls.querySelector<HTMLElement>("[data-time]")!;
  const status = figure.querySelector<HTMLElement>("[data-media-status]")!;
  const fallback = figure.querySelector<HTMLImageElement>("[data-poster-fallback]")!;
  let preview = true;
  let currentFrame = posterFrame;
  let pendingSeek: number | undefined;

  function showFrame(frame: number) {
    currentFrame = Math.min(lastFrame, Math.max(0, frame));
    const t = simulationTimes[currentFrame];
    time.textContent = "t = " + (video.paused ? String(t) : t.toFixed(2));
    slider.value = String(currentFrame);
    slider.style.setProperty("--played", (100 * currentFrame / lastFrame) + "%");
    slider.setAttribute("aria-valuetext", "simulation time " + t + " of 5");
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
    const restart = !preview && currentFrame === lastFrame && video.paused;
    playLabel.textContent = restart ? "replay" : video.paused ? "play" : "pause";
    play.toggleAttribute("data-playing", !video.paused);
    play.setAttribute("aria-label", playLabel.textContent + " simulation");
  }

  video.addEventListener("play", () => {
    if (video.paused || video.error) return;
    preview = false;
    video.hidden = false;
    fallback.hidden = true;
    showFrame(Math.floor(video.currentTime * fps));
    playbackLabel();
  });
  video.addEventListener("playing", () => statusMessage());
  video.addEventListener("pause", () => {
    showFrame(currentFrame);
    playbackLabel();
  });
  play.addEventListener("click", () => {
    if (!video.paused) { video.pause(); return; }
    if (currentFrame === lastFrame && !preview) {
      pendingSeek = 0;
      seekToSelection();
    }
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
    if (pendingSeek !== undefined || video.seeking || video.error) return;
    const frame = Math.floor(video.currentTime * fps);
    // Some hosts only allow a seek to zero. Retain the matched still in that case.
    if (preview && frame !== posterFrame) return;
    preview = false;
    video.removeAttribute("poster");
    video.hidden = false;
    fallback.hidden = true;
    showFrame(frame);
    playbackLabel();
  });
  slider.addEventListener("input", () => {
    preview = false;
    video.pause();
    pendingSeek = slider.valueAsNumber;
    showFrame(pendingSeek);
    playbackLabel();
    if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
      video.preload = "auto";
    } else {
      seekToSelection();
    }
  });

  function mediaError() {
    controls.hidden = true;
    video.hidden = true;
    fallback.hidden = false;
    statusMessage("the movie couldn’t load. this frame shows the chamber at t = 2.56.");
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
  preview = reducedMotion.matches || (video.paused && video.currentTime === 0);
  if (reducedMotion.matches) {
    // Interrupting native autoplay can expose the unheated first frame. Keep the
    // known still visible until its matching movie frame is ready to present.
    fallback.hidden = false;
    video.hidden = true;
    pendingSeek = posterFrame;
    seekToSelection();
  }
  showFrame(preview ? posterFrame : Math.floor(video.currentTime * fps));
  playbackLabel();
  video.controls = false;
  controls.hidden = false;
  if (video.error) mediaError();
}
