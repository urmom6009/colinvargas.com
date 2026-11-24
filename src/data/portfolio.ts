// Public summaries only. Draft logs and unverified numerical results stay private.
export const profile = {
  name: "colin vargas",
  email: "me@colinvargas.com",
  github: "https://github.com/urmom6009",
  linkedin: "https://www.linkedin.com/in/colin-vargas",
  source: "https://github.com/urmom6009/colinvargas.com",
};

export const projects = [
  {
    slug: "hydrogen-isooctane-equilibrium",
    number: "01",
    title: "hydrogen–isooctane combustion",
    category: "propulsion",
    discipline: "combustion thermochemistry",
    context: "coauthored MAE 536 course project · fall 2025",
    status: "case study available",
    record: "team study · NASA CEA equilibrium analysis",
    method: "constant-enthalpy, constant-pressure equilibrium",
    material: "case study",
    brief: [
      { label: "fuel", value: "isooctane–hydrogen blends in air" },
      { label: "reactant temperature", value: "298.15 K" },
      { label: "outputs", value: "adiabatic temperature and equilibrium gas composition" },
    ],
    summary:
      "my group used NASA CEA to see what changes when you add hydrogen to isooctane and vary the fuel–air ratio.",
    question:
      "how much of the change comes from the hydrogen, and how much comes from the fuel–air ratio?",
    scope:
      "we wanted to see how hydrogen changes the equilibrium products and flame temperature. in NASA CEA, we ran a stoichiometric pressure sweep from 0.01 to 100 atm, then swept equivalence ratio from 0.2 to 1.8 at 1 and 100 atm. both calculations held enthalpy and pressure constant within each case.",
    tools: ["NASA CEA", "MATLAB", "chemical equilibrium"],
    approach: [
      {
        title: "pick the blends",
        detail:
          "we started the reactants at 298.15 K and ran 14 compositions from pure isooctane to pure hydrogen.",
      },
      {
        title: "compare what comes out",
        detail:
          "we compared adiabatic flame temperature and equilibrium product mole fractions in MATLAB.",
      },
      {
        title: "keep the equilibrium assumption in view",
        detail:
          "equilibrium tells us where the chemistry ends up. i’m interested in how it gets there, which takes a model for things like ignition, NOₓ formation over time, or spray evaporation.",
      },
    ],
    evidence:
      "one thing that stood out in our December 2025 report was the 100 atm sweep. across the cases we ran, changing equivalence ratio had a bigger effect on the equilibrium CO₂ mole fraction than changing how much hydrogen was in the fuel.",
    next: "i’d like to rerun one sweep with the input files alongside the plot, then see what a finite-rate model predicts under the same conditions.",
    source: null,
  },
  {
    slug: "adaptive-cfd-solver",
    number: "02",
    title: "building an AMReX solver",
    category: "numerics",
    discipline: "computational fluid dynamics",
    context: "master's thesis project",
    status: "in development",
    record: "C++ update and reference calculation",
    method: "first-order upwind",
    material: "C++ excerpt",
    brief: [
      { label: "problem", value: "2d scalar transport" },
      { label: "discretization", value: "finite volume / first-order upwind" },
      { label: "boundaries", value: "periodic in x and y" },
    ],
    summary:
      "i’m building a C++ solver in AMReX. so far it moves a scalar around a periodic grid, which gives me a small case to check before adding refinement.",
    question:
      "can i move a Gaussian across the grid and account for every bit of scalar along the way?",
    scope:
      "i started with a Gaussian on a 2D periodic grid, a constant velocity, and first-order upwind fluxes. i set the timestep from the CFL condition and write AMReX plotfiles so i can look at the field in ParaView.",
    tools: ["C++", "AMReX", "finite volume", "ParaView"],
    approach: [
      {
        title: "start on one grid",
        detail:
          "first-order upwind is simple enough that i can trace the update face by face and see where the profile starts to smear.",
      },
      {
        title: "see what changes with grid size",
        detail:
          "the exact periodic solution is the original field translated by the prescribed velocity. that gives me a reference for the grid and timestep checks i want to publish.",
      },
      {
        title: "add refinement after the checks",
        detail:
          "once i have a baseline i can rerun, i can compare refinement and higher-order methods against it.",
      },
    ],
    evidence:
      "the C++ excerpt is from my solver. on the homepage, you can click through the same update in a separate reference calculation and see how much scalar enters or leaves one cell.",
    next: "i want to share one AMReX run with the input file, boundary conditions, mass error, and a grid-convergence plot.",
    source: null,
  },
  {
    slug: "compressible-flow-project",
    number: "03",
    title: "mixing chamber analysis",
    category: "numerics",
    discipline: "numerical flow modeling",
    context: "computational fluid dynamics course project · spring 2025",
    status: "case study available",
    record: "simulation figures and five-grid verification",
    method: "finite differences",
    material: "illustrated case study",
    brief: [
      { label: "problem", value: "2d incompressible thermal mixing" },
      { label: "discretization", value: "finite differences" },
      { label: "boundary treatment", value: "immersed boundaries" },
    ],
    summary:
      "i put a hot paddle and a cold paddle in a MATLAB flow model. then i checked how much the results changed on five different grids.",
    question:
      "how do rotating immersed boundaries change the flow, thermal mixing, and heat leaving the chamber?",
    scope:
      "the matlab study uses a staggered finite-difference grid and immersed boundaries to model transient, two-dimensional incompressible flow. it evaluates velocity and temperature fields, time-averaged kinetic energy, and convective heat flow through the outlet across reynolds and prandtl number cases.",
    tools: [
      "MATLAB",
      "finite differences",
      "immersed boundaries",
      "grid convergence",
    ],
    approach: [
      {
        title: "set the chamber",
        detail:
          "define two inlets, one outlet, temperature conditions, and the motion and heating of the paddles.",
      },
      {
        title: "advance the fields",
        detail:
          "combine staggered finite differences, immersed-boundary forcing, and a pressure projection with explicit and implicit time integration.",
      },
      {
        title: "check grid behavior",
        detail:
          "assess grid convergence with richardson extrapolation and the grid convergence index, then inspect velocity and thermal fields over time.",
      },
    ],
    evidence:
      "the case study includes the simulated temperature sequence and the grid-convergence results from the spring 2025 course report.",
    next: "i’d rerun the test with a smaller timestep and check how much of the grid error comes from the way i enforce the paddle boundaries.",
    source: null,
  },
  {
    slug: "scramjet-analysis-tool",
    number: "04",
    title: "ramjet and scramjet analysis",
    category: "propulsion",
    discipline: "propulsion & thermodynamics",
    context: "aircraft propulsion course project · fall 2024",
    status: "case study available",
    record: "station model and operating-point comparison",
    method: "parametric analysis",
    material: "illustrated case study",
    brief: [
      { label: "problem", value: "ramjet / scramjet performance" },
      { label: "approach", value: "station model / flight-condition sweeps" },
      { label: "tools", value: "matlab" },
    ],
    summary:
      "i wrote a MATLAB tool to see how flight conditions and engine settings trade thrust against efficiency.",
    question:
      "where does thermal choking change the trade between thrust, efficiency, and fuel use?",
    scope:
      "the model follows flow through the freestream, diffuser, combustor, and nozzle. it varies flight mach number and altitude, diffuser and nozzle behavior, and combustor limits to compare thrust, efficiencies, and thrust-specific fuel consumption.",
    tools: ["MATLAB", "propulsion", "parametric analysis"],
    approach: [
      {
        title: "follow the stations",
        detail:
          "calculate pressure, temperature, velocity, and mach number through the diffuser, combustor, and nozzle from stated flight and component inputs.",
      },
      {
        title: "check choking cases",
        detail:
          "compare thermally choked and unchoked test cases with expected values, then plot their temperature-entropy paths.",
      },
      {
        title: "sweep flight conditions",
        detail:
          "track thrust, overall efficiency, and thrust-specific fuel consumption as flight mach number and altitude vary.",
      },
    ],
    evidence:
      "the case study compares two operating points from the fall 2024 course report and documents the assumptions behind them.",
    next: "i’d like to run the same station model on a benchmark with published inputs and results.",
    source: null,
  },
  {
    slug: "winglet-wind-tunnel",
    number: "05",
    title: "winglet wind-tunnel analysis",
    category: "aerodynamics",
    discipline: "experimental aerodynamics",
    context: "aerodynamics course report · group lab measurements",
    status: "case study available",
    record: "lift comparison and measurement checks",
    method: "wind-tunnel force reduction",
    material: "illustrated case study",
    brief: [
      { label: "test article", value: "finite Eppler 212 wing" },
      { label: "design comparison", value: "bare wing and nine winglet configurations" },
      { label: "measurement", value: "normal and axial balance forces" },
    ],
    summary:
      "i worked through the force-balance data from our winglet lab. the lift comparison was useful, and some of the drag readings sent me back to the setup.",
    question:
      "how do winglet angle, length, and mounting position change the measured response of a finite wing?",
    scope:
      "the group measured the bare wing and winglet configurations through an angle-of-attack sweep at two tunnel speeds. i analyzed the force data and wrote the report.",
    tools: ["wind tunnel", "force balance", "MATLAB"],
    approach: [
      { title: "compare configurations", detail: "vary winglet angle, length, or mounting position against the bare-wing baseline." },
      { title: "reduce balance forces", detail: "rotate normal and axial force into lift and drag, then normalize by dynamic pressure and reference area." },
      { title: "check the data", detail: "review bias and inspect the lift and drag trends for inconsistent readings." },
    ],
    evidence:
      "the case study compares processed lift coefficients for the bare wing and 20° winglet at two angles. the drag readings limit the conclusions.",
    next: "i’d repeat the drag measurements with a fixture tare and enough repeat runs to put uncertainty bounds on the comparison.",
    source: null,
  },
  {
    slug: "portfolio-and-technical-logs",
    number: "06",
    title: "how i built this site",
    category: "software",
    discipline: "software & documentation",
    context: "independent project",
    status: "source available",
    record: "live site · public source",
    method: "static site and Git-linked notes",
    material: "source repository",
    brief: [
      { label: "site", value: "astro / static pages" },
      { label: "notes", value: "git context / markdown / attachments" },
      { label: "publication", value: "drafts by default" },
    ],
    summary:
      "i built this site so i’d have somewhere to put the setup and code next to the plots.",
    question:
      "how do i come back to a plot six months later and know which version of the code made it?",
    scope:
      "the site is built with Astro. i have a Node.js script that starts a Markdown note and records the repo, branch, and commit so i can find the code again.",
    tools: ["Astro", "TypeScript", "Node.js", "Git", "Vercel"],
    approach: [
      {
        title: "start the note in the repo",
        detail:
          "the script grabs Git metadata from the folder i’m working in and puts it at the top of the note.",
      },
      {
        title: "give myself room to work things out",
        detail:
          "notes start as drafts, so i can get the setup and figures in order before sharing them.",
      },
      {
        title: "keep the pages simple",
        detail:
          "the project list and detail pages use the same data, so i only have to update the description in one place.",
      },
    ],
    evidence:
      "the source repo has the Astro pages, the note script, and the fields i save for each note.",
    next: "i want to use the notes setup for the single-grid advection run.",
    source: "https://github.com/urmom6009/colinvargas.com",
  },
] as const;

export type Project = (typeof projects)[number];
