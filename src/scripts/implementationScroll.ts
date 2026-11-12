import {
  createTransportFrames,
  referenceCase,
  referenceCell,
  gaussianField,
  inspectCell,
  type TransportFrame,
} from "../lib/advection";

import {
  implementationSteps,
  scalarLabel,
  stepForScroll,
  stepMotionWindows,
  stepValue,
  type ImplementationStep,
} from "../data/implementationSteps";

import { createCodeMorph } from "./codeMorph";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ramp = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export function enhanceImplementationStudies() {
  document
    .querySelectorAll<HTMLElement>("[data-implementation-track]")
    .forEach((track) => {
      if (track.dataset.codeControls === "ready") return;
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
      const budget = inspectCell(
        gaussianField(referenceCase.resolution),
        referenceCase.resolution,
        referenceCase.velocity,
        referenceCell.dt,
        referenceCell.i,
        referenceCell.j,
      );
      const lineButtons: {
        key: ImplementationStep;
        button: HTMLButtonElement;
      }[] = [];
      let manualStep: ImplementationStep | undefined;
      const readToggle =
        track.querySelector<HTMLButtonElement>("[data-motion-read]");
      const setReading = (reading: boolean) => {
        if (reading && track.dataset.motion === "scroll")
          track.dataset.inspecting = "true";
        else delete track.dataset.inspecting;
        readToggle?.setAttribute("aria-pressed", String(reading));
        if (readToggle)
          readToggle.textContent = reading ? "return to motion" : "pause motion";
      };
      const write = (selector: string, text: string) => {
        const node = track.querySelector<HTMLElement>(selector);
        if (node) node.textContent = text;
      };
      const showStep = (key: ImplementationStep, running = false) => {
        const index = implementationSteps.findIndex((step) => step.key === key);
        const step = implementationSteps[index];
        track.dataset.activeLine = key;
        track.dataset.view = running ? "global" : "cell";
        track.querySelectorAll<SVGGElement>("[data-face]").forEach((face) => {
          const faceIndex = implementationSteps.findIndex(
            ({ face: stepFace }) => stepFace === face.dataset.face,
          );
          face.dataset.active = String(faceIndex <= index);
        });
        lineButtons.forEach(({ key: lineKey, button }) =>
          button.setAttribute("aria-pressed", String(lineKey === key)),
        );
        write(
          "[data-step-number]",
          `${String(running ? 7 : index + 1).padStart(2, "0")} / 07`,
        );
        write(
          "[data-step-title]",
          running ? "repeat the update across the grid" : step.title,
        );
        write(
          "[data-step-description]",
          running
            ? "the same six statements advance every cell, timestep after timestep."
            : step.explanation,
        );
        write(
          "[data-step-value]",
          running
            ? "64 × 64 cells"
            : `${key === "new_fab" ? "φ new" : key} ≈ ${scalarLabel(stepValue(key, budget))}`,
        );
      };
      const showLedger = (completed: number) => {
        track
          .querySelectorAll<HTMLElement>("[data-step-record]")
          .forEach((record, index) => {
            record.dataset.complete = String(index <= completed);
          });
      };
      const showLedgerThrough = (key: ImplementationStep) => {
        showLedger(implementationSteps.findIndex((step) => step.key === key));
      };
      track.querySelectorAll<HTMLElement>("[data-code-key]").forEach((line) => {
        const key = line.dataset.codeKey as ImplementationStep;
        const step = implementationSteps.find((item) => item.key === key);
        if (!step) return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "code-line-control";
        button.textContent = line.textContent;
        button.title = `inspect ${step.title}`;
        button.setAttribute("aria-controls", "upwind-cell-diagram");
        button.setAttribute(
          "aria-describedby",
          "implementation-step-description",
        );
        const inspect = () => {
          manualStep = key;
          setReading(true);
          showStep(key);
          showLedgerThrough(key);
        };
        button.addEventListener("focus", inspect);
        button.addEventListener("click", inspect);
        line.replaceChildren(button);
        lineButtons.push({ key, button });
      });
      track.dataset.codeControls = "ready";
      const morph = createCodeMorph(track, figure);
      const inspectCurrent = () => {
        manualStep =
          (track.dataset.activeLine as ImplementationStep) || "new_fab";
        setReading(true);
        showStep(manualStep);
        showLedgerThrough(manualStep);
      };
      track
        .querySelector(".source-fragment pre")
        ?.addEventListener("focus", inspectCurrent);
      readToggle?.addEventListener("click", () => {
        if (track.dataset.inspecting === "true") {
          manualStep = undefined;
          setReading(false);
          requestUpdate();
        } else inspectCurrent();
      });
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
        const time =
          referenceCell.dt +
          clamp(fraction) * (referenceCase.duration - referenceCell.dt);
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
        // Focusing an offscreen code line can scroll the browser automatically.
        // Keep that deliberate selection until the reader actually scrolls.
        if (manualStep) {
          showStep(manualStep);
          showLedgerThrough(manualStep);
          return;
        }
        const activeStep = stepForScroll(progress);
        const running = progress >= 0.9;
        showStep(activeStep, running);
        showLedger(
          implementationSteps.findLastIndex(
            ({ key }) => progress >= stepMotionWindows[key][1],
          ),
        );
        morph?.render(progress, activeStep);
        draw(ramp(0.94, 1, progress));
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
          manualStep = undefined;
          setReading(false);
          if (readToggle) readToggle.hidden = true;
          track.dataset.morphPhase = "static";
          showStep("new_fab");
          showLedger(implementationSteps.length - 1);
          write(".implementation-scroll-hint", "select a code line to inspect");
          track.style.removeProperty("--study-height");
          if (frames) draw(1);
        };
        const wrapsSource = Array.from(
          track.querySelectorAll<HTMLButtonElement>(".code-line-control"),
        ).some((button) => {
          const text = document.createRange();
          text.selectNodeContents(button);
          return text.getClientRects().length > 1;
        });
        // Wrapped source lines need normal flow; the animated copies track one line each.
        if (
          motion.matches ||
          window.innerWidth <= 900 ||
          window.innerHeight < 700 ||
          wrapsSource
        ) {
          showStatic();
          return;
        }
        const reading = track.dataset.inspecting === "true";
        setReading(false);
        track.dataset.motion = "scroll";
        if (readToggle) readToggle.hidden = false;
        write(".implementation-scroll-hint", "scroll to assemble the cell ↓");
        morph?.measure();
        const height = figure.getBoundingClientRect().height;
        if (height + top + 24 > window.innerHeight) {
          showStatic();
          return;
        }
        frames ??= createTransportFrames();
        distance = Math.max(580, Math.min(900, window.innerHeight * 0.9));
        track.style.setProperty("--study-height", `${height + distance}px`);
        start = track.getBoundingClientRect().top + window.scrollY - top;
        readColor();
        update();
        if (reading) setReading(true);
      };

      window.addEventListener("scroll", requestUpdate, { passive: true });
      const resumeScroll = () => {
        manualStep = undefined;
        setReading(false);
        requestUpdate();
      };
      window.addEventListener("wheel", resumeScroll, { passive: true });
      window.addEventListener("touchmove", resumeScroll, { passive: true });
      window.addEventListener("keydown", (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (
          [
            "PageUp",
            "PageDown",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End",
          ].includes(event.key) ||
          (event.key === " " && !target?.closest(".code-line-control"))
        )
          resumeScroll();
      });
      window.addEventListener("resize", measure, { passive: true });
      motion.addEventListener("change", measure);
      const observer = new MutationObserver(() => {
        readColor();
        if (track.dataset.motion === "scroll") draw(ramp(0.94, 1, progress));
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      measure();
      document.fonts.ready.then(measure);
    });
}
