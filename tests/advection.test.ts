import assert from "node:assert/strict";
import test from "node:test";
import {
  createTransportFrames,
  gaussianField,
  referenceCase,
  upwindStep,
} from "../src/lib/advection.ts";

test("the finite-volume update preserves a uniform scalar for either velocity sign", () => {
  const field = new Float64Array(64).fill(0.7);
  for (const velocity of [
    [1, 0.5],
    [-1, -0.5],
  ] as const) {
    assert.deepEqual(upwindStep(field, 8, velocity, 0.04), field);
  }
});

test("a full-cell CFL shift wraps the field at both periodic boundaries", () => {
  const field = Float64Array.from({ length: 16 }, (_, i) => i);
  for (const [velocity, dx, dy] of [
    [[1, 0], -1, 0],
    [[-1, 0], 1, 0],
    [[0, 1], 0, -1],
    [[0, -1], 0, 1],
  ] as const) {
    const shifted = upwindStep(field, 4, velocity, 0.25);
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        assert.equal(
          shifted[j * 4 + i],
          field[((j + dy + 4) % 4) * 4 + ((i + dx + 4) % 4)],
        );
      }
    }
  }
});

test("both face-flux differences contribute with the source excerpt's sign", () => {
  const field = Float64Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const next = upwindStep(field, 3, [-0.5, 0.75], 0.1);
  // Center: Fx_hi-Fx_lo=-0.5*6-(-0.5*5); Fy_hi-Fy_lo=0.75*5-0.75*2.
  assert.ok(Math.abs(next[4] - (5 - 0.3 * (-0.5 + 2.25))) < 1e-14);
  assert.equal(
    field[4],
    5,
    "the old state must remain available to neighboring cells",
  );
});

test("the reference case transports the peak, conserves mass, and stays bounded", () => {
  const frames = createTransportFrames();
  const initial = frames[0].field;
  const sum = (field: Float64Array) =>
    field.reduce((total, value) => total + value, 0);
  const mass = sum(initial);
  const maximum = Math.max(...initial);
  for (const { field } of frames) {
    assert.ok(Math.abs(sum(field) - mass) / mass < 1e-12);
    assert.ok(field.every((value) => value >= 0 && value <= maximum + 1e-12));
  }
  const last = frames.at(-1)!;
  assert.ok(Math.abs(last.time - referenceCase.duration) < 1e-12);
  let peak = 0;
  last.field.forEach((value, index) => {
    if (value > last.field[peak]) peak = index;
  });
  assert.ok(
    Math.abs(
      ((peak % referenceCase.resolution) + 0.5) / referenceCase.resolution -
        0.75,
    ) < 0.04,
  );
  assert.ok(
    Math.max(...last.field) < maximum,
    "first-order upwind should show numerical diffusion",
  );
  assert.deepEqual(initial, gaussianField(referenceCase.resolution));
});

test("invalid grids and unstable timesteps are rejected", () => {
  assert.throws(() => upwindStep(new Float64Array(16), 4, [1, 1], 0.2), /CFL/);
  assert.throws(() => upwindStep(new Float64Array(15), 4, [1, 0], 0.1), /grid/);
  assert.throws(
    () => createTransportFrames({ ...referenceCase, cfl: 0 }),
    /CFL/,
  );
  assert.throws(
    () => createTransportFrames({ ...referenceCase, duration: Infinity }),
    /duration/,
  );
});
