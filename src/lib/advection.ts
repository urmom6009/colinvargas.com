/** A small reference calculation of the flux/update shown in advance.cpp.
 * This is a separate TypeScript calculation, not output from the thesis binary.
 * Unit square, cell-centered averages, periodic boundaries, prescribed velocity.
 */
export interface TransportCase {
  resolution: number;
  velocity: readonly [number, number];
  cfl: number;
  duration: number;
}

export const referenceCase: TransportCase = {
  resolution: 64,
  velocity: [1, 0.5],
  cfl: 0.3,
  duration: 0.5,
};

export interface TransportFrame {
  time: number;
  field: Float64Array;
}

export interface CellBudget {
  phiC: number;
  Fx_lo: number;
  Fx_hi: number;
  Fy_lo: number;
  Fy_hi: number;
  xChange: number;
  yChange: number;
  dtdivF: number;
  nextPhi: number;
}

export const referenceCell = {
  i: 21,
  j: 35,
  dt:
    referenceCase.cfl /
    (referenceCase.resolution *
      referenceCase.velocity.reduce((sum, v) => sum + Math.abs(v), 0)),
};

/** Inspect one cell using the same old-state face selection as upwindStep. */
export function inspectCell(
  previous: Float64Array,
  resolution: number,
  velocity: readonly [number, number],
  dt: number,
  i: number,
  j: number,
): CellBudget {
  if (
    !Number.isInteger(resolution) ||
    resolution < 2 ||
    previous.length !== resolution * resolution ||
    !Number.isInteger(i) ||
    !Number.isInteger(j) ||
    i < 0 ||
    i >= resolution ||
    j < 0 ||
    j >= resolution
  ) {
    throw new RangeError("The inspected cell must be inside the square grid.");
  }
  const [velx, vely] = velocity;
  if (
    ![velx, vely, dt].every(Number.isFinite) ||
    dt < 0 ||
    dt * resolution * (Math.abs(velx) + Math.abs(vely)) > 1 + 1e-12
  ) {
    throw new RangeError("Use a finite, stable CFL timestep.");
  }
  const at = (x: number, y: number) =>
    previous[
      ((y + resolution) % resolution) * resolution +
        ((x + resolution) % resolution)
    ];
  const phiC = at(i, j);
  const Fx_lo = velx * (velx >= 0 ? at(i - 1, j) : phiC);
  const Fx_hi = velx * (velx >= 0 ? phiC : at(i + 1, j));
  const Fy_lo = vely * (vely >= 0 ? at(i, j - 1) : phiC);
  const Fy_hi = vely * (vely >= 0 ? phiC : at(i, j + 1));
  const xChange = dt * resolution * (Fx_hi - Fx_lo);
  const yChange = dt * resolution * (Fy_hi - Fy_lo);
  const dtdivF = xChange + yChange;
  return {
    phiC,
    Fx_lo,
    Fx_hi,
    Fy_lo,
    Fy_hi,
    xChange,
    yChange,
    dtdivF,
    nextPhi: phiC - dtdivF,
  };
}

export function gaussianField(resolution: number): Float64Array {
  if (!Number.isInteger(resolution) || resolution < 2) {
    throw new RangeError(
      "Resolution must be an integer of at least two cells.",
    );
  }
  const field = new Float64Array(resolution * resolution);
  const sigma = 0.075;
  for (let j = 0; j < resolution; j++) {
    for (let i = 0; i < resolution; i++) {
      const x = (i + 0.5) / resolution - 0.25;
      const y = (j + 0.5) / resolution - 0.5;
      field[j * resolution + i] = Math.exp(
        -(x * x + y * y) / (2 * sigma * sigma),
      );
    }
  }
  return field;
}

export function upwindStep(
  previous: Float64Array,
  resolution: number,
  velocity: readonly [number, number],
  dt: number,
): Float64Array {
  const [velx, vely] = velocity;
  if (
    !Number.isInteger(resolution) ||
    resolution < 2 ||
    previous.length !== resolution * resolution
  ) {
    throw new RangeError("The field must match the square grid.");
  }
  if (![dt, velx, vely].every(Number.isFinite) || dt < 0) {
    throw new RangeError(
      "Finite velocity and a non-negative timestep are required.",
    );
  }
  const idx = dt * resolution;
  const idy = idx;
  if (idx * (Math.abs(velx) + Math.abs(vely)) > 1 + 1e-12) {
    throw new RangeError("The upwind CFL condition is exceeded.");
  }
  const next = new Float64Array(previous.length);
  for (let j = 0; j < resolution; j++) {
    const below = ((j + resolution - 1) % resolution) * resolution;
    const above = ((j + 1) % resolution) * resolution;
    for (let i = 0; i < resolution; i++) {
      const cell = j * resolution + i;
      const phiC = previous[cell];
      const phixm =
        previous[j * resolution + ((i + resolution - 1) % resolution)];
      const phixp = previous[j * resolution + ((i + 1) % resolution)];
      const phiym = previous[below + i];
      const phiyp = previous[above + i];
      const phi_x_lo = velx >= 0 ? phixm : phiC;
      const phi_x_hi = velx >= 0 ? phiC : phixp;
      const phi_y_lo = vely >= 0 ? phiym : phiC;
      const phi_y_hi = vely >= 0 ? phiC : phiyp;

      const Fx_lo = velx * phi_x_lo;
      const Fx_hi = velx * phi_x_hi;
      const Fy_lo = vely * phi_y_lo;
      const Fy_hi = vely * phi_y_hi;
      const dtdivF = idx * (Fx_hi - Fx_lo) + idy * (Fy_hi - Fy_lo);
      next[cell] = phiC - dtdivF;
    }
  }
  return next;
}

export function createTransportFrames(
  config: TransportCase = referenceCase,
): TransportFrame[] {
  if (
    !(config.cfl > 0 && config.cfl <= 1) ||
    !Number.isFinite(config.duration) ||
    config.duration < 0
  ) {
    throw new RangeError(
      "Use a stable CFL number and a finite, non-negative duration.",
    );
  }
  if (!config.velocity.every(Number.isFinite))
    throw new RangeError("Velocity must be finite.");
  let field = gaussianField(config.resolution);
  const frames: TransportFrame[] = [{ time: 0, field }];
  const rate =
    config.resolution *
    config.velocity.reduce((sum, value) => sum + Math.abs(value), 0);
  const timestep = rate > 0 ? config.cfl / rate : config.duration;
  let time = 0;
  let step = 0;
  while (time < config.duration - 1e-12) {
    const dt = Math.min(timestep, config.duration - time);
    field = upwindStep(field, config.resolution, config.velocity, dt);
    time = Math.min(time + dt, config.duration);
    step++;
    if (step % 2 === 0 || time >= config.duration - 1e-12) {
      frames.push({ time, field });
    }
  }
  return frames;
}
