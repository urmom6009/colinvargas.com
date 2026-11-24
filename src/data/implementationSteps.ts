import type { CellBudget } from "../lib/advection";

export const implementationSteps = [
  {
    key: "Fx_lo",
    title: "left face · x flux in",
    explanation: "scalar comes in from the cell on the left.",
    face: "Fx_lo",
  },
  {
    key: "Fx_hi",
    title: "right face · x flux out",
    explanation: "some of this cell’s scalar moves into the cell on the right.",
    face: "Fx_hi",
  },
  {
    key: "Fy_lo",
    title: "bottom face · y flux in",
    explanation: "scalar comes in from the cell below.",
    face: "Fy_lo",
  },
  {
    key: "Fy_hi",
    title: "top face · y flux out",
    explanation: "scalar leaves through the top face.",
    face: "Fy_hi",
  },
  {
    key: "dtdivF",
    title: "balance the four faces",
    explanation:
      "more scalar comes in than goes out. that’s why the outward balance is negative.",
    face: "all",
  },
  {
    key: "new_fab",
    title: "update the cell average",
    explanation:
      "the update subtracts a negative number, so the cell average goes up.",
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
