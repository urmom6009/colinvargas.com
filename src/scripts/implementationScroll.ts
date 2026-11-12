import {
  createTransportFrames,
  referenceCase,
  type TransportFrame,
} from "../lib/advection";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ramp = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export function enhanceImplementationStudies() {
  document
    .querySelectorAll<HTMLElement>("[data-implementation-track]")
    .forEach((track) => {
      const figure = track.querySelector<HTMLElement>(
        ".implementation-feature",
      );
      const canvas = track.querySelector<HTMLCanvasElement>(
        "[data-advection-canvas]",
      );
      const context = canvas?.getContext("2d");
      if (!figure || !canvas || !context) return;
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const header = document.querySelector<HTMLElement>(".site-header");
      const timeLabel = track.querySelector<HTMLElement>(
        "[data-reference-time]",
      );
      const code = track.querySelector<HTMLElement>(".source-fragment pre");
      let frames: TransportFrame[] | undefined;
      let start = 0;
      let distance = 0;
      let progress = 0;
      let queued = false;
      let currentTime = -1;
      let color = [50, 97, 77];

      const readColor = () => {
        const components = getComputedStyle(canvas).color.match(/[\d.]+/g);
        if (components) color = components.slice(0, 3).map(Number);
        currentTime = -1;
      };
      const draw = (fraction: number) => {
        if (!frames) return;
        const time = clamp(fraction) * referenceCase.duration;
        if (time === currentTime) return;
        currentTime = time;
        // Interpolate only between computed finite-volume states, never between invented shapes.
        let next = frames.findIndex((frame) => frame.time >= time);
        if (next < 0) next = frames.length - 1;
        const a = frames[Math.max(0, next - 1)];
        const b = frames[next];
        const mix = b.time > a.time ? (time - a.time) / (b.time - a.time) : 0;
        const n = referenceCase.resolution;
        const image = context.createImageData(n, n);
        for (let j = 0; j < n; j++) {
          for (let i = 0; i < n; i++) {
            const cell = j * n + i;
            const value = a.field[cell] * (1 - mix) + b.field[cell] * mix;
            const pixel = ((n - 1 - j) * n + i) * 4;
            image.data[pixel] = color[0];
            image.data[pixel + 1] = color[1];
            image.data[pixel + 2] = color[2];
            image.data[pixel + 3] = Math.round(clamp(value) * 255);
          }
        }
        context.putImageData(image, 0, 0);
        canvas.dataset.ready = "true";
        if (timeLabel) timeLabel.textContent = time.toFixed(3);
      };

      const update = () => {
        queued = false;
        if (track.dataset.motion !== "scroll") return;
        progress = clamp((window.scrollY - start) / distance);
        const reveal = ramp(0.15, 0.42, progress);
        figure.style.setProperty(
          "--source-opacity",
          String(1 - ramp(0.06, 0.35, progress)),
        );
        figure.style.setProperty("--field-opacity", String(reveal));
        figure.style.setProperty("--source-offset", `${-14 * reveal}px`);
        figure.style.setProperty("--field-offset", `${18 * (1 - reveal)}px`);
        track.dataset.phase =
          progress < 0.18 ? "code" : progress < 0.42 ? "transition" : "field";
        draw(ramp(0.35, 0.97, progress));
      };
      const requestUpdate = () => {
        if (queued || track.dataset.motion !== "scroll") return;
        queued = true;
        window.requestAnimationFrame(update);
      };

      const measure = () => {
        const top = (header?.getBoundingClientRect().height || 84) + 20;
        track.style.setProperty("--study-top", `${top}px`);
        const showStatic = () => {
          track.dataset.motion = "static";
          delete track.dataset.phase;
          delete figure.dataset.sourceFocused;
          track.style.removeProperty("--study-height");
          if (frames) draw(1);
        };
        // Short viewports and reduced motion get both complete views in document flow.
        if (motion.matches || window.innerHeight < 700) {
          showStatic();
          return;
        }
        track.dataset.motion = "scroll";
        const height = figure.getBoundingClientRect().height;
        if (height + top + 24 > window.innerHeight) {
          showStatic();
          return;
        }
        frames ??= createTransportFrames();
        distance = Math.max(320, Math.min(620, window.innerHeight * 0.65));
        track.style.setProperty("--study-height", `${height + distance}px`);
        start = track.getBoundingClientRect().top + window.scrollY - top;
        readColor();
        update();
        if (document.activeElement === code)
          figure.dataset.sourceFocused = "true";
      };

      // Keep the source readable when tabbing to it, even after the field is revealed.
      code?.addEventListener("focus", () => {
        if (track.dataset.motion === "scroll")
          figure.dataset.sourceFocused = "true";
      });
      code?.addEventListener("blur", () => {
        delete figure.dataset.sourceFocused;
      });
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", measure, { passive: true });
      motion.addEventListener("change", measure);
      const observer = new MutationObserver(() => {
        readColor();
        if (track.dataset.motion === "scroll") draw(ramp(0.35, 0.97, progress));
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      measure();
      document.fonts.ready.then(measure);
    });
}
