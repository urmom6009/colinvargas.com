import { gaussianField, inspectCell, referenceCase, referenceCell } from "../lib/advection";
import {
  implementationSteps,
  scalarLabel,
  stepValue,
  type ImplementationStep,
} from "../data/implementationSteps";

// Keep the source and the computed views still. A reader chooses the relationship
// to inspect instead of having scroll position choose it for them.
export function enhanceImplementationStudies() {
  document
    .querySelectorAll<HTMLElement>("[data-implementation-track]")
    .forEach((track) => {
      if (track.dataset.codeControls === "ready") return;

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
      const write = (selector: string, value: string) => {
        const node = track.querySelector<HTMLElement>(selector);
        if (node) node.textContent = value;
      };

      const showStep = (key: ImplementationStep) => {
        const index = implementationSteps.findIndex((step) => step.key === key);
        const step = implementationSteps[index];
        track.dataset.activeLine = key;
        track.querySelectorAll<SVGGElement>("[data-face]").forEach((face) => {
          face.dataset.current = String(
            face.dataset.face === step.face || key === "dtdivF",
          );
        });
        lineButtons.forEach(({ key: lineKey, button }) =>
          button.setAttribute("aria-pressed", String(lineKey === key)),
        );
        write("[data-step-number]", `${String(index + 1).padStart(2, "0")} / 06`);
        write("[data-step-title]", step.title);
        write("[data-step-description]", step.explanation);
        write(
          "[data-step-value]",
          `${key === "new_fab" ? "φ new" : key} ≈ ${scalarLabel(stepValue(key, budget))}`,
        );
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
        button.setAttribute("aria-describedby", "implementation-step-description");
        const inspect = () => {
          showStep(key);
        };
        button.addEventListener("focus", inspect);
        button.addEventListener("click", inspect);
        line.replaceChildren(button);
        lineButtons.push({ key, button });
      });

      track.dataset.codeControls = "ready";
      showStep("new_fab");
    });
}
