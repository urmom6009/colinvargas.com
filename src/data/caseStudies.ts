import type { Project } from "./portfolio";

// Public case studies cite the underlying course evidence.
export type CaseStudy = {
  kind: "mixing" | "scramjet" | "winglet";
  lead: string;
  role: string;
  question: string;
  contribution: string;
  method: { label: string; title: string; detail: string }[];
  evidence: {
    title: string;
    lead: string;
    source: string;
    observations: { value: string; label: string; detail: string }[];
    interpretation: string;
  };
  technical: {
    title: string;
    expression: string;
    explanation: string;
    note: string;
    source: string;
  };
  lessons: { title: string; detail: string }[];
  boundary: string;
};

export const caseStudies: Partial<Record<Project["slug"], CaseStudy>> = {
  "compressible-flow-project": {
    kind: "mixing",
    lead: "i modeled heated and cooled rotating paddles inside a flow chamber, then checked whether the numerical result changed as the grid got finer.",
    role: "numerical model, MATLAB implementation, analysis, and report",
    question: "what does the flow carry through the chamber, and how much of that picture depends on the grid?",
    contribution: "i coupled a two-dimensional incompressible flow calculation to temperature transport. two inlets, a centered outlet, and rotating hot and cold paddles make the chamber a test of both the physical model and the numerical method.",
    method: [
      { label: "01 / setup", title: "define the chamber", detail: "two inlets with oscillating temperatures feed a 4 × 3 nondimensional domain. the upper paddle is cooled, the lower paddle is heated, and the outlet is centered on the right wall." },
      { label: "02 / solver", title: "advance flow and temperature", detail: "i used staggered finite differences and immersed-boundary forcing. a fractional-step pressure projection enforced incompressibility, and a separate transport equation advanced temperature." },
      { label: "03 / outputs", title: "track two quantities", detail: "i averaged kinetic energy over the chamber and convective heat flow through the outlet. the temperature snapshots show how warm and cool structures evolve between nondimensional times 1 and 3." },
      { label: "04 / verification", title: "refine the grid", detail: "i ran five grid resolutions and applied Richardson extrapolation and the grid convergence index (GCI) to the time-averaged quantities." }
    ],
    evidence: {
      title: "temperature fields and grid convergence",
      lead: "for the Re = 100, Pr = 2 case, the reported mean kinetic energy increased from 5.4703 at M = 32 to 5.8802 at M = 512. the temperature sequence shows the computed field at M = 128.",
      source: "mixing-chamber course report, tables 2–3 and figure 3, pp. 21–23",
      observations: [
        { value: "0.645", label: "observed order", detail: "kinetic energy for the M = 32, 64, 128 grid triplet" },
        { value: "5.07%", label: "kinetic-energy GCI", detail: "reported for the M = 128 comparison" },
        { value: "1.08%", label: "outlet heat-flow GCI", detail: "reported for the same comparison" }
      ],
      interpretation: "the reported asymptotic checks were close to one at M = 128. the kinetic-energy sequence converged more slowly than the nominal order of its discretization. immersed-boundary forcing was one possible contributor that the study left unresolved."
    },
    technical: {
      title: "pressure projection",
      expression: "tentative velocity → pressure projection → ∇ · u ≈ 0",
      explanation: "the flow is treated as incompressible. after updating velocity, the pressure solve projects it back toward a divergence-free field; temperature is then carried through that computed motion.",
      note: "the temperature field gave me a way to inspect transport. the grid study showed that averaged kinetic energy was more sensitive to resolution than averaged outlet heat flow in the comparison at M = 128.",
      source: "adapted from the course report, methods and verification, pp. 6, 20–22"
    },
    lessons: [
      { title: "separate appearance from accuracy", detail: "a coherent flow picture does not by itself establish that the solution is grid independent." },
      { title: "follow the coupled model", detail: "the observed order of a full simulation can differ from the nominal order of one numerical step." },
      { title: "keep the claim bounded", detail: "these are numerical results for a modeled, incompressible chamber; they are not experimental validation." }
    ],
    boundary: "the study verifies grid behavior for an incompressible numerical model. establishing physical accuracy would require an independent benchmark or measurements."
  },
  "scramjet-analysis-tool": {
    kind: "scramjet",
    lead: "i implemented a course-specified ramjet and scramjet station model in MATLAB to explore how operating choices change predicted thrust and efficiency.",
    role: "MATLAB implementation, parameter sweeps, checks, and interpretation",
    question: "how do flight conditions and internal flow choices affect the model's predicted performance?",
    contribution: "i translated the prescribed station equations into a tool that accepts operating conditions, carries the state through diffuser, combustor, and nozzle, and compares the resulting thrust and efficiency across parameter sweeps.",
    method: [
      { label: "01 / input", title: "set flight conditions", detail: "the design sweep used Mach 5 at 27,400 m, a fuel heating value of 43.2 MJ/kg, 92% diffuser efficiency, and 94% nozzle efficiency." },
      { label: "02 / propagate", title: "solve station states", detail: "carry the modeled flow through diffuser, combustor, and nozzle while checking the thermal-choking case." },
      { label: "03 / compare", title: "run the design sweep", detail: "i varied diffuser-exit Mach from 0.10 to 3.00 and combustor-exit total temperature from 1,500 to 2,400 K to compare thrust and overall efficiency." },
      { label: "04 / question", title: "check the boundaries", detail: "compare the atmosphere approximation with tabulated values and inspect regions where the simplified model gives implausible outputs." }
    ],
    evidence: {
      title: "modeled thrust and efficiency tradeoff",
      lead: "both selected operating points reached the 2,400 K combustor-exit total-temperature limit. the highest modeled thrust and overall efficiency occurred at different diffuser-exit Mach settings.",
      source: "MAE 563 course report, table 2, p. 27",
      observations: [
        { value: "1,970 N", label: "maximum modeled thrust", detail: "M₂ = 0.41; overall efficiency = 12%" },
        { value: "13%", label: "maximum modeled efficiency", detail: "M₂ = 0.40; thrust = 1,876 N" },
        { value: "2,400 K", label: "temperature cap", detail: "combustor exit in both compared cases" }
      ],
      interpretation: "the report rounds overall efficiency to whole percentage points. the differences describe this station model, its fixed assumptions, and its discrete sweep."
    },
    technical: {
      title: "net thrust calculation",
      expression: "net thrust = momentum contribution + exit-pressure contribution",
      explanation: "the MATLAB calculation keeps momentum and nozzle pressure terms separate before combining them. that separation makes it easier to inspect why an operating change alters the reported thrust.",
      note: "i used the station model to ask which assumptions were driving each trend. the atmosphere comparison was a useful check, but it also made me cautious about treating a tidy sweep as a physical prediction.",
      source: "adapted from the course report, parts B and E and appendix A, pp. 8, 15–16, 32"
    },
    lessons: [
      { title: "tradeoffs are model-specific", detail: "the highest thrust and highest efficiency appeared at different settings in the reported sweep." },
      { title: "check the approximations", detail: "the atmosphere model and prescribed component relations bound what these numbers can mean." },
      { title: "leave room for validation", detail: "the report checks selected cases; it does not compare the tool with experimental engine data." }
    ],
    boundary: "the analysis used prescribed one-dimensional station relations and an approximate atmosphere. selected model checks support the calculation workflow. engine performance validation would require an independent benchmark or test data."
  },
  "winglet-wind-tunnel": {
    kind: "winglet",
    lead: "i analyzed a baseline finite wing and nine winglet configurations in a group wind-tunnel lab, then followed the force measurements through lift, drag, and uncertainty calculations.",
    role: "sole report author and analyst; measurements collected in a group lab",
    question: "how do winglet angle, length, and position change the measured aerodynamic response?",
    contribution: "i organized the configuration comparison, converted measured normal and axial forces into lift and drag, and examined lift curves, drag polars, and uncertainty. the report also documents where the measurement quality limits the conclusion.",
    method: [
      { label: "01 / vary", title: "change one wingtip feature", detail: "the study compared a bare Eppler 212 finite wing with nine configurations varying winglet angle, length, or position." },
      { label: "02 / measure", title: "measure in the group lab", detail: "the group lab recorded force-balance and flow measurements over angles of attack from −15° to 25° at nominal Reynolds numbers near 100,000 and 200,000." },
      { label: "03 / reduce", title: "resolve forces", detail: "normal and axial forces were rotated into lift and drag, then normalized into aerodynamic coefficients with instrument uncertainty." },
      { label: "04 / audit", title: "inspect the limits", detail: "the report flagged erratic and even negative drag values in parts of the data, so those comparisons remain tentative." }
    ],
    evidence: {
      title: "processed lift and drag data quality",
      lead: "a source-data check reconstructed one comparison from the raw group-lab files. at Re = 101,800, the bare wing and 20° winglet had different processed lift coefficients at the selected angles below.",
      source: "group-lab CSV and bias files, checked against the appendix workbook; report methods, pp. 5–6",
      observations: [
        { value: "0.5003 → 0.6671", label: "lift coefficient at 10°", detail: "bare wing → 20° winglet; nominal angle" },
        { value: "0.8495 → 0.9684", label: "lift coefficient at 20°", detail: "bare wing → 20° winglet; nominal angle" },
        { value: "41", label: "angles processed", detail: "−15° to 25° at about one-degree increments" }
      ],
      interpretation: "the lift increase applies to these two selected points. assessing a general aerodynamic benefit would require repeat measurements and comparison against uncertainty. erratic drag coefficients and a duplicated appendix table further limit the record."
    },
    technical: {
      title: "force-balance data reduction",
      expression: "L = N cos α − A sin α     D = N sin α + A cos α",
      explanation: "the force balance records normal (N) and axial (A) components. rotating those measurements by angle of attack (α) gives lift and drag before coefficient normalization.",
      note: "i treated inconsistent drag values as a reason to revisit the measurement chain, not as proof of an aerodynamic benefit. the fixtures and the way data were collected mattered to the comparison.",
      source: "adapted from the course report, equations 6–11 and conclusion, pp. 8–9, 18–20"
    },
    lessons: [
      { title: "the fixture is part of the test", detail: "protruding mounting hardware could influence measured drag and should be considered in the comparison." },
      { title: "a trend needs a quality check", detail: "negative or erratic drag coefficients point to measurement or reduction problems, not a free performance gain." },
      { title: "credit the data source", detail: "the analysis and report are mine; the tunnel measurements came from a group lab." }
    ],
    boundary: "the selected lift comparison was checked against group-lab force and bias files during the original analysis. inconsistent drag readings and possible fixture effects leave the drag comparison inconclusive."
  }
};
