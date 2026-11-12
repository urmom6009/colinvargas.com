// Transcribed from the actual thesis implementation, not a simulated run.
// Whitespace is dedented; the statements are unchanged.
// Reviewed source: code/advect_noAMR/src/advance.cpp at this immutable revision.
export const solverImplementation = {
  repository: "urmom6009/thesis-updated",
  revision: "8f1f6c867c39197c2146b21efce41b947fde296d",
  file: "code/advect_noAMR/src/advance.cpp",
  sourceUrl:
    "https://raw.githubusercontent.com/urmom6009/thesis-updated/8f1f6c867c39197c2146b21efce41b947fde296d/code/advect_noAMR/src/advance.cpp",
  code: `// compute the fluxes at faces
Real Fx_lo = velx * phi_x_lo;
Real Fx_hi = velx * phi_x_hi;

Real Fy_lo = vely * phi_y_lo;
Real Fy_hi = vely * phi_y_hi;

// calculate and update cell averages
Real dtdivF = idx * (Fx_hi - Fx_lo) + idy * (Fy_hi - Fy_lo);
new_fab(i, j, 0) = phiC - dtdivF;`,
};
