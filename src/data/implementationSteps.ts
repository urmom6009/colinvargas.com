import type { CellBudget } from "../lib/advection";

export const implementationSteps = [
  {
    key: "Fx_lo",
    title: "left face · x flux in",
    explanation: "the left neighbour supplies scalar to this cell.",
    face: "Fx_lo",
  },
  {
    key: "Fx_hi",
    title: "right face · x flux out",
    explanation: "the current cell supplies scalar to its right neighbour.",
    face: "Fx_hi",
  },
  {
    key: "Fy_lo",
    title: "bottom face · y flux in",
    explanation: "the lower neighbour supplies scalar through the bottom face.",
    face: "Fy_lo",
  },
  {
    key: "Fy_hi",
    title: "top face · y flux out",
    explanation: "the current cell supplies scalar through its top face.",
    face: "Fy_hi",
  },
  {
    key: "dtdivF",
    title: "balance the four faces",
    explanation:
      "more scalar enters than leaves, so the net outward contribution is negative.",
    face: "all",
  },
  {
    key: "new_fab",
    title: "update the cell average",
    explanation:
      "subtracting the negative balance increases the scalar in this cell.",
    face: "all",
  },
] as const;

export type ImplementationStep = (typeof implementationSteps)[number]["key"];

export function codeStep(line: string): ImplementationStep | undefined {
  return implementationSteps.find(({ key }) =>
    line.startsWith(key === "new_fab" ? "new_fab(" : `Real ${key} `),
  )?.key;
}

export function stepValue(key: ImplementationStep, budget: CellBudget): number {
  return key === "new_fab" ? budget.nextPhi : budget[key];
}

export function scalarLabel(value: number): string {
  return (Math.abs(value) < 0.00005 ? 0 : value).toFixed(4);
}
