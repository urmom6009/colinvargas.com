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
      "a team study of how hydrogen fraction, pressure, and equivalence ratio affect equilibrium temperature and gas composition.",
    question:
      "how sensitive are equilibrium predictions to hydrogen addition and the fuel–air ratio?",
    scope:
      "our team used NASA CEA to calculate adiabatic, constant-pressure equilibrium for isooctane–hydrogen blends in air. we compared a stoichiometric pressure sweep from 0.01 to 100 atm with equivalence-ratio sweeps from 0.2 to 1.8 at 1 and 100 atm.",
    tools: ["NASA CEA", "MATLAB", "chemical equilibrium"],
    approach: [
      {
        title: "set the comparison",
        detail:
          "hold the reactant temperature at 298.15 K and vary hydrogen from 0 to 100 mole percent of the fuel across 14 blend compositions.",
      },
      {
        title: "compare sensitivities",
        detail:
          "use MATLAB to compare trends in adiabatic flame temperature and equilibrium product mole fractions across the sweeps.",
      },
      {
        title: "identify the model limits",
        detail:
          "equilibrium gives the thermochemical end state. ignition timing, transient NOₓ formation, and spray evaporation require separate models.",
      },
    ],
    evidence:
      "in the team’s 100 atm sweep, changing equivalence ratio had a greater effect on the equilibrium CO₂ mole fraction than changing hydrogen fraction over the cases studied. this is a qualitative finding from the December 2025 MAE 536 team report, within the stated equilibrium assumptions.",
    next: "reproduce a representative sweep with versioned inputs, then compare the equilibrium baseline with a finite-rate model under matched conditions.",
    source: null,
  },
  {
    slug: "adaptive-cfd-solver",
    number: "02",
    title: "adaptive cfd solver",
    category: "numerics",
    discipline: "computational fluid dynamics",
    context: "master's thesis project",
    status: "in development",
    record: "implementation excerpt · results forthcoming",
    method: "first-order upwind",
    material: "implementation excerpt",
    brief: [
      { label: "problem", value: "2d scalar transport" },
      { label: "discretization", value: "finite volume / first-order upwind" },
      { label: "boundaries", value: "periodic in x and y" },
    ],
    summary:
      "a C++/AMReX finite-volume solver for 2D scalar advection, with an inspectable flux update and a computed reference case. adaptive refinement is planned.",
    question:
      "how can a small, inspectable advection solver become a foundation for more complex flow problems?",
    scope:
      "the current implementation advances a gaussian scalar field on a 2d, single-level periodic grid using constant velocity, first-order upwind fluxes, and a cfl-controlled timestep. it writes amrex plotfiles for inspection. adaptive refinement remains a planned extension.",
    tools: ["c++", "amrex", "finite volume", "paraview"],
    approach: [
      {
        title: "establish the baseline",
        detail:
          "start with first-order upwind advection on a uniform mesh so the update and its numerical diffusion can be examined.",
      },
      {
        title: "check the numerical behavior",
        detail:
          "use controlled cases and grid studies to investigate stability and convergence. verification figures are not yet published here.",
      },
      {
        title: "extend with a reference in hand",
        detail:
          "adaptive refinement and higher-order methods form the research direction. they are planned extensions, not claimed capabilities of the current public record.",
      },
    ],
    evidence:
      "the upwind implementation excerpt shows how face fluxes update the cell averages. its source revision is recorded alongside it. convergence plots, benchmark timings, and a completed validation study are not yet part of the public portfolio.",
    next: "a documented baseline case with its inputs, boundary conditions, and grid-refinement results.",
    source: null,
  },
  {
    slug: "compressible-flow-project",
    number: "03",
    title: "mixing chamber analysis",
    category: "numerics",
    discipline: "numerical flow modeling",
    context: "computational fluid dynamics course project · spring 2025",
    status: "writeup in progress",
    record: "course report · figures not yet published here",
    method: "finite differences",
    material: "project overview",
    brief: [
      { label: "problem", value: "2d incompressible thermal mixing" },
      { label: "discretization", value: "finite differences" },
      { label: "boundary treatment", value: "immersed boundaries" },
    ],
    summary:
      "a transient mixing-chamber model of velocity and temperature around two rotating paddles, one heated and one cooled.",
    question:
      "how do rotating immersed boundaries change the flow, thermal mixing, and heat leaving the chamber?",
    scope:
      "the matlab study uses a staggered finite-difference grid and immersed boundaries to model transient, two-dimensional incompressible flow. it evaluates velocity and temperature fields, time-averaged kinetic energy, and convective heat flow through the outlet across reynolds and prandtl number cases.",
    tools: [
      "matlab",
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
      "the spring 2025 course report describes the model, numerical methods, grid-convergence assessment, and flow and thermal visualizations. the report and figures are not yet published on this site, so this overview does not present a verified numerical result.",
    next: "publish the model setup and selected figures with their convergence context.",
    source: null,
  },
  {
    slug: "scramjet-analysis-tool",
    number: "04",
    title: "scramjet analysis tool",
    category: "propulsion",
    discipline: "propulsion & thermodynamics",
    context: "aircraft propulsion course project · fall 2024",
    status: "writeup in progress",
    record: "course report · not yet published here",
    method: "parametric analysis",
    material: "project overview",
    brief: [
      { label: "problem", value: "ramjet / scramjet performance" },
      { label: "approach", value: "station model / flight-condition sweeps" },
      { label: "tools", value: "matlab" },
    ],
    summary:
      "a matlab model comparing ramjet and scramjet performance as flight and component conditions change.",
    question:
      "where does thermal choking change the trade between thrust, efficiency, and fuel use?",
    scope:
      "the model follows flow through the freestream, diffuser, combustor, and nozzle. it varies flight mach number and altitude, diffuser and nozzle behavior, and combustor limits to compare thrust, efficiencies, and thrust-specific fuel consumption.",
    tools: ["matlab", "propulsion", "parametric analysis"],
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
      "the fall 2024 course report documents the matlab model, two choking test cases, temperature-entropy diagrams, and flight-condition sweeps. the report and plots are not yet published on this site; this overview makes no numerical performance claim.",
    next: "publish a representative sweep with its inputs, units, and model limitations.",
    source: null,
  },
  {
    slug: "portfolio-and-technical-logs",
    number: "05",
    title: "the engineering record",
    category: "software",
    discipline: "software & documentation",
    context: "independent project",
    status: "source available",
    record: "live site · public source",
    method: "git-aware publishing",
    material: "source repository",
    brief: [
      { label: "site", value: "astro / static pages" },
      { label: "notes", value: "git context / markdown / attachments" },
      { label: "publication", value: "drafts by default" },
    ],
    summary:
      "this portfolio and its repository-aware logging workflow: a place to connect engineering work with the decisions behind it.",
    question:
      "how can engineering notes retain the context of the code and experiments they describe?",
    scope:
      "an astro portfolio with a node.js log generator. the script records repository, branch, and commit context, creates a markdown note and attachment directory, and keeps new entries in draft until they are ready to share.",
    tools: ["astro", "typescript", "node.js", "git", "vercel"],
    approach: [
      {
        title: "capture context at the source",
        detail:
          "the log generator reads git metadata from the working repository and includes it in the note's frontmatter.",
      },
      {
        title: "keep a deliberate publication step",
        detail:
          "new notes default to draft. internal paths and unfinished material are kept out of the public pages.",
      },
      {
        title: "make the site easy to inspect",
        detail:
          "static pages, shared project data, local fonts, accessible interactions, and a source repository keep the portfolio straightforward to maintain.",
      },
    ],
    evidence:
      "the site and source are public. the repository includes the astro application, the log-generation script, and the content schema. draft entries are not public case studies.",
    next: "publish a technical note when its setup, artifacts, and conclusions are ready to share.",
    source: "https://github.com/urmom6009/colinvargas.com",
  },
] as const;

export type Project = (typeof projects)[number];
