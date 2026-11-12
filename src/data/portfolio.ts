// Public summaries only. Draft logs and unverified numerical results stay private.
export const profile = {
  name: "colin vargas",
  email: "me@colinvargas.com",
  github: "https://github.com/urmom6009",
  linkedin: "https://www.linkedin.com/in/colinvargas",
  source: "https://github.com/urmom6009/colinvargas.com",
};

export const projects = [
  {
    slug: "adaptive-cfd-solver",
    number: "01",
    title: "adaptive cfd solver",
    category: "numerics",
    discipline: "computational fluid dynamics",
    context: "master's thesis project",
    status: "in development",
    record: "project overview · results forthcoming",
    diagram: "mesh",
    summary:
      "from scalar advection to adaptive meshes. a thesis project exploring how numerical methods and software architecture shape a flow solver.",
    question:
      "how can a small, inspectable advection solver become a foundation for more complex flow problems?",
    scope:
      "the starting point is scalar advection with a prescribed velocity field. the work centers on finite-volume updates, boundary conditions, and keeping mesh, state, flux, and output responsibilities understandable.",
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
      "this overview describes the research scope. source releases, convergence plots, benchmark timings, and a completed validation study are not yet part of the public portfolio.",
    next: "a documented baseline case with its inputs, boundary conditions, and grid-refinement results.",
    source: null,
  },
  {
    slug: "scramjet-analysis-tool",
    number: "02",
    title: "scramjet analysis tool",
    category: "propulsion",
    discipline: "propulsion & thermodynamics",
    context: "engineering analysis project",
    status: "writeup in progress",
    record: "project overview · report forthcoming",
    diagram: "engine",
    summary:
      "a parametric approach to propulsion analysis, with the assumptions kept alongside the trends they produce.",
    question:
      "what can a propulsion model reveal about a design trade when its assumptions remain visible?",
    scope:
      "a computational analysis tool for examining scramjet performance trends across a parameter space. the public overview focuses on the modeling problem; the underlying report and plots are still being prepared.",
    tools: ["matlab", "propulsion", "parametric analysis"],
    approach: [
      {
        title: "define the model",
        detail:
          "make the operating conditions and thermodynamic assumptions explicit before interpreting a performance trend.",
      },
      {
        title: "explore the trade space",
        detail:
          "vary selected inputs and compare trends within the model's stated limits.",
      },
      {
        title: "document the interpretation",
        detail:
          "pair future sweep plots with equations, units, assumptions, and the limits of the comparison.",
      },
    ],
    evidence:
      "the methodology and performance plots have not yet been published here. no thrust, efficiency, or design-improvement figures are claimed in this overview.",
    next: "a model description and representative parameter sweep, with assumptions and units attached.",
    source: null,
  },
  {
    slug: "compressible-flow-project",
    number: "03",
    title: "mixing chamber analysis",
    category: "numerics",
    discipline: "numerical flow modeling",
    context: "engineering analysis project",
    status: "writeup in progress",
    record: "project overview · figures forthcoming",
    diagram: "mixing",
    summary:
      "a flow-modeling study examining numerical methods, immersed boundaries, and the context needed to interpret a simulation.",
    question:
      "how do the numerical method and the treatment of a boundary affect the flow behavior a model can represent?",
    scope:
      "mixing-chamber modeling with a focus on finite-difference methods and immersed-boundary treatment. the report, numerical setup, and visual outputs are not yet available on this site.",
    tools: [
      "finite differences",
      "immersed boundaries",
      "verification & validation",
    ],
    approach: [
      {
        title: "describe the physical problem",
        detail:
          "record the geometry, boundary conditions, and assumptions needed to understand the model.",
      },
      {
        title: "inspect the discretization",
        detail:
          "examine how the numerical method and boundary representation influence the computed behavior.",
      },
      {
        title: "give each figure context",
        detail:
          "prepare visual results with their setup and numerical limitations, rather than presenting an unexplained flow image.",
      },
    ],
    evidence:
      "this is a scope overview, not a published validation result. the archived report and simulation figures will be needed to assess the numerical findings.",
    next: "the model setup, representative flow figures, and a description of the verification approach.",
    source: null,
  },
  {
    slug: "portfolio-and-technical-logs",
    number: "04",
    title: "the engineering record",
    category: "software",
    discipline: "software & documentation",
    context: "independent project",
    status: "source available",
    record: "live site · public source",
    diagram: "record",
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
