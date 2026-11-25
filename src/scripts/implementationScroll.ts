import { implementationSteps, type ImplementationStep } from "../data/implementationSteps";

// Keep the source and the computed views still. A reader chooses the relationship
// to inspect instead of having scroll position choose it for them.
export function enhanceImplementationStudies() {
  document
    .querySelectorAll<HTMLElement>("[data-implementation-track]")
    .forEach((track) => {
      if (track.dataset.codeControls === "ready") return;

      const lineButtons: {
        key: ImplementationStep;
        button: HTMLButtonElement;
      }[] = [];
      const showStep = (key: ImplementationStep) => {
        const step = implementationSteps.find((item) => item.key === key)!;
        track.dataset.activeLine = key;
        track.querySelectorAll<HTMLElement>("[data-cell-step]").forEach((reading) => {
          reading.hidden = reading.dataset.cellStep !== key;
        });
        track.querySelectorAll<SVGGElement>("[data-face]").forEach((face) => {
          face.dataset.current = String(face.dataset.face === step.face || step.face === "all");
        });
        lineButtons.forEach(({ key: lineKey, button }) =>
          button.setAttribute("aria-pressed", String(lineKey === key)),
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
        button.setAttribute("aria-describedby", `cell-reading-${key}`);
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
