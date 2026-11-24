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
    lead: "i wanted to see where the heat would go if you put a hot paddle and a cold paddle in the same flow. once i had the plots, i checked what changed when i refined the grid.",
    role: "i wrote the MATLAB model, ran the cases, and wrote the report.",
    question: "where does the heat go, and how much does the answer change when i refine the grid?",
    contribution: "i wrote a two-dimensional incompressible solver in MATLAB and used its velocity field to move heat through the chamber. the paddles rotate through the grid, so i had to impose their motion and temperature through immersed-boundary forcing.",
    method: [
      { label: "01 / setup", title: "define the chamber", detail: "two inlets with oscillating temperatures feed a 4 × 3 nondimensional domain. the upper paddle is cooled, the lower paddle is heated, and the outlet is centered on the right wall." },
      { label: "02 / solver", title: "advance flow and temperature", detail: "i used staggered finite differences and immersed-boundary forcing. a fractional-step pressure projection enforced incompressibility, and a separate transport equation advanced temperature." },
      { label: "03 / outputs", title: "track energy and heat flow", detail: "i tracked kinetic energy in the chamber and convective heat flow out of it. the temperature snapshots show where the hot and cold fluid went between nondimensional times 1 and 3." },
      { label: "04 / verification", title: "refine the grid", detail: "i ran the same case on five grids, then used Richardson extrapolation and the grid convergence index (GCI) to check the time averages." }
    ],
    evidence: {
      title: "temperature fields and grid convergence",
      lead: "at Re = 100 and Pr = 2, mean kinetic energy went from 5.4703 on my coarsest grid (M = 32) to 5.8802 on my finest (M = 512). the temperature panels are from the M = 128 run.",
      source: "mixing-chamber course report, tables 2–3 and figure 3, pp. 21–23",
      observations: [
        { value: "0.645", label: "observed order", detail: "kinetic energy for the M = 32, 64, 128 grid triplet" },
        { value: "5.07%", label: "kinetic-energy GCI", detail: "reported for the M = 128 comparison" },
        { value: "1.08%", label: "outlet heat-flow GCI", detail: "reported for the same comparison" }
      ],
      interpretation: "the asymptotic checks were close to one at M = 128. what stuck out to me was how slowly kinetic energy converged compared with the order i expected. the way i imposed the paddle boundary is one thing i’d check next."
    },
    technical: {
      title: "pressure projection",
      expression: "tentative velocity → pressure projection → ∇ · u ≈ 0",
      explanation: "the first velocity update can leave some divergence. i solve for pressure and use it to correct the velocity before that field carries the temperature forward.",
      note: "i first looked at where the warm and cold fluid went. the grid checks told me something else i cared about. at M = 128, averaged kinetic energy was more sensitive to resolution than averaged outlet heat flow.",
      source: "adapted from the course report, methods and verification, pp. 6, 20–22"
    },
    lessons: [
      { title: "check the numbers behind the plot", detail: "the warm and cold structures looked plausible. i still needed the grid runs to see whether the values had settled." },
      { title: "check the whole solver", detail: "i can use a second-order method in one part of the code and still see a lower order for the full problem." },
      { title: "pick the quantity that matters", detail: "i’d care about a different error estimate if i were using this to predict outlet heating instead of the motion in the chamber." }
    ],
    boundary: "i checked how this model behaves as the grid gets finer. to check that it matches a real chamber, i’d need measurements or an independent benchmark."
  },
  "scramjet-analysis-tool": {
    kind: "scramjet",
    lead: "i wrote a MATLAB tool to find out how much thrust and efficiency change when you change where the engine flies or how the flow enters the combustor.",
    role: "i wrote the MATLAB tool and ran the sweeps and checks.",
    question: "how much can the answer change with a small change at the diffuser exit?",
    contribution: "i took the station equations from class and put them into MATLAB. the tool carries the flow state through the diffuser, combustor, and nozzle so i can change one input and see where the answer starts to change.",
    method: [
      { label: "01 / input", title: "set flight conditions", detail: "the design sweep used Mach 5 at 27,400 m, a fuel heating value of 43.2 MJ/kg, 92% diffuser efficiency, and 94% nozzle efficiency." },
      { label: "02 / flow", title: "follow the flow station by station", detail: "i tracked pressure, temperature, velocity, and Mach through each component and checked when heat addition drove the flow to thermal choking." },
      { label: "03 / compare", title: "run the design sweep", detail: "i varied diffuser-exit Mach from 0.10 to 3.00 and combustor-exit total temperature from 1,500 to 2,400 K to compare thrust and overall efficiency." },
      { label: "04 / checks", title: "check the atmosphere and odd results", detail: "i looked at where my atmosphere model differed from tabulated values and where the station calculations gave results that didn’t make physical sense." }
    ],
    evidence: {
      title: "modeled thrust and efficiency tradeoff",
      lead: "both points hit the 2,400 K combustor-exit temperature limit. the part i found interesting was that the best modeled thrust and the best overall efficiency were only 0.01 Mach apart at the diffuser exit.",
      source: "MAE 563 course report, table 2, p. 27",
      observations: [
        { value: "1,970 N", label: "maximum modeled thrust", detail: "M₂ = 0.41; overall efficiency = 12%" },
        { value: "13%", label: "maximum modeled efficiency", detail: "M₂ = 0.40; thrust = 1,876 N" },
        { value: "2,400 K", label: "temperature cap", detail: "combustor exit in both compared cases" }
      ],
      interpretation: "i rounded the efficiencies to whole percentage points in the report. these are the best points on the grid i ran, with the flight conditions and component efficiencies held fixed."
    },
    technical: {
      title: "net thrust calculation",
      expression: "net thrust = momentum contribution + exit-pressure contribution",
      explanation: "i keep the momentum and nozzle pressure terms separate in MATLAB so i can see which one moved when i change an input.",
      note: "checking the atmosphere was worth doing before reading too much into the sweep. even a decent-looking result depends on the conditions i handed the model at the inlet.",
      source: "adapted from the course report, parts B and E and appendix A, pp. 8, 15–16, 32"
    },
    lessons: [
      { title: "pick what i’m optimizing", detail: "i’d choose a different point in the same sweep depending on whether i cared more about thrust or overall efficiency." },
      { title: "keep the flight conditions attached", detail: "the altitude and flight Mach belong next to the result. they determine what enters the diffuser." },
      { title: "look for an outside check", detail: "the course cases helped me check the code. a documented engine case would give me something independent to compare it with." }
    ],
    boundary: "i used the one-dimensional relations from class and an approximate atmosphere. the results are useful for comparing inputs inside that model. i’d need an independent benchmark or test data to say how it predicts a real engine."
  },
  "winglet-wind-tunnel": {
    kind: "winglet",
    lead: "my lab group tested a bare wing and nine winglet setups. i worked through the measurements afterward, and some of the drag numbers made me go back and look at how we’d collected them.",
    role: "i analyzed the data and wrote the report. we collected the measurements as a group.",
    question: "what actually changes when we move, angle, or resize the winglet?",
    contribution: "i took the normal and axial force readings and turned them into lift and drag. then i compared the lift curves and drag polars and checked how much uncertainty came from the instruments.",
    method: [
      { label: "01 / vary", title: "change one wingtip feature", detail: "the study compared a bare Eppler 212 finite wing with nine configurations varying winglet angle, length, or position." },
      { label: "02 / measure", title: "run the tunnel", detail: "we recorded forces and flow over angles of attack from −15° to 25° at nominal Reynolds numbers near 100,000 and 200,000." },
      { label: "03 / reduce", title: "turn the readings into coefficients", detail: "i used angle of attack to rotate the measured forces into lift and drag, then normalized them and accounted for instrument uncertainty." },
      { label: "04 / checks", title: "look at the drag readings again", detail: "some drag values bounced around, and a few were negative. i flagged those cases in the report because they made the drag comparison hard to interpret." }
    ],
    evidence: {
      title: "what i could say about lift and drag",
      lead: "this is the comparison i could trace back to the group’s original force files. at Re = 101,800, the 20° winglet came out with higher lift coefficients at these two angles.",
      source: "group-lab CSV and bias files, checked against the appendix workbook; report methods, pp. 5–6",
      observations: [
        { value: "0.5003 → 0.6671", label: "lift coefficient at 10°", detail: "bare wing → 20° winglet; nominal angle" },
        { value: "0.8495 → 0.9684", label: "lift coefficient at 20°", detail: "bare wing → 20° winglet; nominal angle" },
        { value: "41", label: "angles processed", detail: "−15° to 25° at about one-degree increments" }
      ],
      interpretation: "i’d want repeat runs and uncertainty bounds before generalizing from those two points. the erratic drag values and a duplicated appendix table also make me cautious about the broader comparison."
    },
    technical: {
      title: "force-balance data reduction",
      expression: "L = N cos α − A sin α     D = N sin α + A cos α",
      explanation: "the force balance records normal (N) and axial (A) components. rotating those measurements by angle of attack (α) gives lift and drag before coefficient normalization.",
      note: "the negative drag values were a good reason to go back through the setup. even the hardware holding the wing could have affected the force we measured.",
      source: "adapted from the course report, equations 6–11 and conclusion, pp. 8–9, 18–20"
    },
    lessons: [
      { title: "check the fixture too", detail: "mounting hardware stuck out into the flow. i’d account for that before making another drag comparison." },
      { title: "go back to the readings", detail: "the force and bias files gave us enough to reconstruct the lift comparison later." },
      { title: "know what we can repeat", detail: "i’d run the bare wing again between configurations so i had a baseline for drift and scatter." }
    ],
    boundary: "the lift points shown here come from the earlier check of the group’s force and bias files. i’d call the drag comparison inconclusive given the readings and possible fixture effects."
  }
};
