import { referenceCase, referenceCell } from "../lib/advection";
import {
  stepMotionWindows,
  type ImplementationStep,
} from "../data/implementationSteps";

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
const windows: Record<string, readonly [number, number]> = {
  ...stepMotionWindows,
  "comment-0": [0.18, 0.23],
  "comment-7": [0.61, 0.64],
};
interface LineObject {
  key: string;
  source: HTMLElement;
  element: HTMLSpanElement;
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
  length: number;
  angle: number;
}

/** Move actual source text to measured SVG faces, then zoom that cell into its grid location. */
export function createCodeMorph(track: HTMLElement, figure: HTMLElement) {
  const stage = track.querySelector<HTMLElement>(".implementation-stage");
  const pre = track.querySelector<HTMLElement>(".source-fragment pre");
  const sourcePanel = track.querySelector<HTMLElement>(".source-fragment");
  const cell = track.querySelector<HTMLElement>(".cell-flux-view");
  const field = track.querySelector<HTMLElement>(".advection-field");
  const center = track.querySelector<SVGRectElement>(".target-cell");
  if (!stage || !pre || !sourcePanel || !cell || !field || !center) return null;
  const layer = document.createElement("div");
  layer.className = "code-morph-layer";
  layer.setAttribute("aria-hidden", "true");
  layer.inert = true;
  stage.append(layer);
  const objects: LineObject[] = [];
  track.querySelectorAll<HTMLElement>("[data-code-line]").forEach((source) => {
    if (!source.textContent?.trim()) return;
    const key = source.dataset.codeKey || `comment-${source.dataset.codeLine}`;
    const element = document.createElement("span");
    element.className = "code-object";
    element.dataset.objectKey = key;
    element.textContent = source.textContent;
    layer.append(element);
    objects.push({
      key,
      source,
      element,
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      targetX: 0,
      targetY: 0,
      length: 1,
      angle: 0,
    });
  });
  let zoomX = 0,
    zoomY = 0,
    zoomScale = 0.03;

  const measure = () => {
    // Measurements always use the unmorphed geometry, including after resize/reverse scroll.
    const saved = cell.style.transform;
    cell.style.transform = "none";
    const bounds = stage.getBoundingClientRect();
    const sourceBounds = sourcePanel.getBoundingClientRect();
    const font = getComputedStyle(pre);
    objects.forEach((object) => {
      const source = object.source.getBoundingClientRect();
      const target =
        track.querySelector<SVGPathElement>(
          `[data-morph-target="${object.key}"]`,
        ) ||
        track.querySelector<HTMLElement>(
          object.key === "comment-0"
            ? ".cell-context > span"
            : ".cell-calculation > span",
        );
      if (!target) return;
      const destination = target.getBoundingClientRect();
      object.x = source.left - bounds.left;
      // Keep the canonical line in place; its traveling copy emerges below the panel.
      object.y = sourceBounds.bottom - bounds.top + 4;
      object.width = Math.max(1, source.width);
      object.height = Math.max(1, source.height);
      object.targetX = destination.left + destination.width / 2 - bounds.left;
      object.targetY = destination.top + destination.height / 2 - bounds.top;
      object.length = Math.max(destination.width, destination.height, 1);
      object.angle = destination.height > destination.width ? 90 : 0;
      Object.assign(object.element.style, {
        left: `${object.x}px`,
        top: `${object.y}px`,
        width: `${object.width}px`,
        height: `${object.height}px`,
        font: font.font,
        letterSpacing: font.letterSpacing,
        lineHeight: font.lineHeight,
      });
    });
    const cellBounds = center.getBoundingClientRect();
    const cellView = cell.getBoundingClientRect();
    const fieldBounds = field.getBoundingClientRect();
    const cx = cellBounds.left + cellBounds.width / 2;
    const cy = cellBounds.top + cellBounds.height / 2;
    zoomX =
      fieldBounds.left +
      (fieldBounds.width * (referenceCell.i + 0.5)) / referenceCase.resolution -
      cx;
    zoomY =
      fieldBounds.top +
      fieldBounds.height *
        (1 - (referenceCell.j + 0.5) / referenceCase.resolution) -
      cy;
    zoomScale =
      fieldBounds.width /
      referenceCase.resolution /
      Math.max(cellBounds.width, 1);
    cell.style.transformOrigin = `${cx - cellView.left}px ${cy - cellView.top}px`;
    cell.style.transform = saved;
    track.dataset.codeObjects = "ready";
  };

  const render = (progress: number, active: ImplementationStep) => {
    objects.forEach((object, index) => {
      const [start, end] = windows[object.key] || [0.1, 0.5];
      const t = ease(start, end, progress);
      const bend = Math.sin(Math.PI * t) * (index % 2 ? -18 : 18);
      const dx = (object.targetX - object.x - object.width / 2) * t + bend;
      const dy = (object.targetY - object.y - object.height / 2) * t;
      const compress = ease(0.28, 1, t);
      const sx = 1 + (object.length / object.width - 1) * compress;
      const sy = 1 - 0.92 * compress;
      const angle = object.angle * ease(0.25, 1, t);
      object.element.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle}deg) scale(${sx}, ${sy})`;
      // The source stays readable; only its visual copy travels to the cell.
      const lineStrength = ease(0, 0.12, t);
      object.element.style.opacity = String(
        (object.key.startsWith("comment") ? 0.65 : 1) *
          lineStrength *
          (1 - ease(0.82, 1, t)),
      );
      object.element.dataset.active = String(object.key === active);
      object.element.dataset.arrival = t.toFixed(4);
      const face = track.querySelector<SVGGElement>(
        `[data-face="${object.key}"]`,
      );
      face?.style.setProperty("--face-formed", String(ease(0.78, 1, t)));
    });
    const zoom = ease(0.88, 0.96, progress);
    cell.style.transform = `translate(${zoomX * zoom}px, ${zoomY * zoom}px) scale(${1 + (zoomScale - 1) * zoom})`;
    figure.style.setProperty(
      "--physical-reveal",
      String(ease(0.02, 0.12, progress)),
    );
    figure.style.setProperty(
      "--grid-reveal",
      String(ease(0.03, 0.17, progress)),
    );
    figure.style.setProperty(
      "--step-reveal",
      String(ease(0.18, 0.24, progress)),
    );
    figure.style.setProperty(
      "--context-reveal",
      String(ease(0.35, 0.42, progress)),
    );
    figure.style.setProperty(
      "--cell-details",
      String(ease(0.7, 0.84, progress)),
    );
    figure.style.setProperty(
      "--cell-opacity",
      String(1 - ease(0.88, 0.96, progress)),
    );
    figure.style.setProperty(
      "--field-opacity",
      String(ease(0.88, 0.96, progress)),
    );
    figure.style.setProperty(
      "--cell-dashes",
      zoom > 0 ? `${Math.max(0.2, 12 * (1 - zoom))} ${zoom * 8}` : "none",
    );
    track.dataset.morphPhase =
      progress < 0.22
        ? "grid"
        : progress < 0.78
          ? "assembling"
          : progress < 0.88
            ? "cell"
            : progress < 0.96
              ? "dissolving"
              : "field";
  };
  return { measure, render };
}
