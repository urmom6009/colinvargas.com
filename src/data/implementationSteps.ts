import type { CellBudget } from "../lib/advection";

export const implementationSteps = [
  {
    key: "Fx_lo",
    title: "left face · x flux in",
    shortTitle: "left / in",
    explanation: "the left neighbour supplies scalar to this cell.",
    face: "Fx_lo",
  },
  {
    key: "Fx_hi",
    title: "right face · x flux out",
    shortTitle: "right / out",
    explanation: "the current cell supplies scalar to its right neighbour.",
    face: "Fx_hi",
  },
  {
    key: "Fy_lo",
    title: "bottom face · y flux in",
    shortTitle: "bottom / in",
    explanation: "the lower neighbour supplies scalar through the bottom face.",
    face: "Fy_lo",
  },
  {
    key: "Fy_hi",
    title: "top face · y flux out",
    shortTitle: "top / out",
    explanation: "the current cell supplies scalar through its top face.",
    face: "Fy_hi",
  },
  {
    key: "dtdivF",
    title: "balance the four faces",
    shortTitle: "net balance",
    explanation:
      "more scalar enters than leaves, so the net outward contribution is negative.",
    face: "all",
  },
  {
    key: "new_fab",
    title: "update the cell average",
    shortTitle: "cell update",
    explanation:
      "subtracting the negative balance increases the scalar in this cell.",
    face: "all",
  },
] as const;

export type ImplementationStep = (typeof implementationSteps)[number]["key"];

// The grid has finished fading in before any of these statement windows begin.
export const stepMotionWindows = {
  Fx_lo: [0.24, 0.36],
  Fx_hi: [0.34, 0.46],
  Fy_lo: [0.44, 0.56],
  Fy_hi: [0.54, 0.66],
  dtdivF: [0.64, 0.78],
  new_fab: [0.76, 0.88],
} as const satisfies Record<ImplementationStep, readonly [number, number]>;

export function codeStep(line: string): ImplementationStep | undefined {
  return implementationSteps.find(({ key }) =>
    line.startsWith(key === "new_fab" ? "new_fab(" : `Real ${key} `),
  )?.key;
}

export function stepForScroll(progress: number): ImplementationStep {
  return (
    implementationSteps.find(({ key }) => progress < stepMotionWindows[key][1])
      ?.key ?? "new_fab"
  );
}

export function stepValue(key: ImplementationStep, budget: CellBudget): number {
  return key === "new_fab" ? budget.nextPhi : budget[key];
}

export function scalarLabel(value: number): string {
  return (Math.abs(value) < 0.00005 ? 0 : value).toFixed(4);
}
