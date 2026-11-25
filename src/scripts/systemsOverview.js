import { metric, numeric, plain, present, sectionReading, snapshotTime, watchPublicSnapshot } from "../lib/publicSystems.js";

const query = (selector) => document.querySelector(selector);
const show = (selector, visible) => {
  const node = query(selector);
  if (node) node.hidden = !visible;
};
const textAll = (selector, value) => {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = String(value);
  });
};
const make = (tag, className = "", value) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = String(value);
  return node;
};
const renderRadar = (items) => {
  const target = query("[data-radar]");
  if (!target) return;
  const rows = items.map((item) => {
    const value = metric(item.value);
    const row = make("div", "systems-radar-row");
    row.append(make("span", "", plain(item.label)));
    const track = make("div", "systems-radar-track");
    track.setAttribute("aria-hidden", "true");
    const fill = make("span", "systems-radar-fill");
    fill.style.setProperty("--value", `${value}%`);
    track.append(fill);
    row.append(track, make("strong", "", `${value}%`));
    return row;
  });
  target.replaceChildren(...rows);
  target.hidden = rows.length === 0;
};
const renderHealthReasons = (items) => {
  const target = query("[data-health-reasons]");
  target.hidden = !items.length;
  target.replaceChildren(...items.map((item) => {
    const row = make("div");
    const value = make("dd", "", plain(item.value));
    if (present(item.detail)) value.append(make("p", "", plain(item.detail)));
    row.append(make("dt", "", plain(item.label)), value);
    return row;
  }));
};
const renderServices = (items) => {
  show("[data-services-panel]", items.length > 0);
  const target = query("[data-services]");
  if (!target || !items.length) return;
  const online = items.filter((item) =>
    ["online", "running", "active"].includes(plain(item.status).toLowerCase()),
  ).length;
  textAll("[data-service-count]", `${online}/${items.length} reported online`);
  target.replaceChildren(...items.map((service) => {
    const status = plain(service.status).toLowerCase();
    const stateClass = ["online", "running", "active", "offline", "failed"].includes(status)
      ? ` is-${status}`
      : "";
    const row = make("article", "systems-service-row");
    const dot = make("span", `systems-status-dot${stateClass}`);
    dot.setAttribute("aria-hidden", "true");
    const copy = make("div");
    copy.append(make("strong", "", plain(service.name)));
    const state = make("span", "", status);
    row.append(dot, copy, state);
    return row;
  }));
};
const renderDeployments = (items) => {
  show("[data-deploy-panel]", items.length > 0);
  const target = query("[data-deployments]");
  if (!target || !items.length) return;
  target.replaceChildren(...items.map((deployment) => {
    const row = make("article");
    const copy = make("div");
    copy.append(make("strong", "", plain(deployment.name)));
    const context = [deployment.when, deployment.duration].filter(present).map((value) => plain(value));
    if (context.length) copy.append(make("p", "", context.join(" / ")));
    row.append(make("span", "", plain(deployment.status, "reported")), copy);
    if (present(deployment.ref)) row.append(make("small", "", plain(deployment.ref)));
    return row;
  }));
};
const renderStorage = (storage, pools, overall) => {
  const redundancy = present(storage.redundancy) ? plain(storage.redundancy) : "";
  const integrity = present(storage.integrity) ? plain(storage.integrity) : "";
  const hasStorage = overall !== null || pools.length > 0 || Boolean(redundancy || integrity);
  show("[data-storage-panel]", hasStorage);
  show("[data-storage-score]", overall !== null);
  if (!hasStorage) return;
  textAll("[data-storage-summary]", overall === null ? [redundancy, integrity].filter(Boolean).join(" / ") : integrity || "public pool status");
  textAll("[data-storage-overall]", overall === null ? "" : overall);
  textAll("[data-storage-unit]", overall === null ? "" : "%");
  textAll("[data-storage-context]", [redundancy, integrity].filter(Boolean).join(" / "));
  const target = query("[data-storage-pools]");
  if (!target) return;
  target.replaceChildren(...pools.map((pool) => {
    const row = make("article");
    const copy = make("div");
    copy.append(make("strong", "", plain(pool.name)));
    const readings = [
      present(pool.state) ? plain(pool.state) : "",
      present(pool.used) ? `${plain(pool.used)} used` : "",
      present(pool.capacity) ? `${plain(pool.capacity)} capacity` : "",
    ].filter(Boolean);
    if (readings.length) copy.append(make("span", "", readings.join(" · ")));
    const health = metric(pool.health);
    row.append(copy);
    if (health !== null) {
      copy.append(make("span", "", `${health}% health`));
      const meter = make("i");
      meter.setAttribute("aria-hidden", "true");
      meter.style.setProperty("--health", `${health}%`);
      row.append(meter);
    }
    return row;
  }));
};
const renderEnvironment = (weather, air, bars, aqi) => {
  const hasWeather = present(weather.temp);
  show("[data-environment]", hasWeather || aqi !== null);
  show("[data-weather]", hasWeather);
  show("[data-air]", aqi !== null);
  if (hasWeather) {
    textAll("[data-weather-temp]", plain(weather.temp));
    textAll("[data-weather-label]", plain(weather.label || weather.source, "public weather reading"));
  }
  if (aqi !== null) {
    textAll("[data-air-aqi]", aqi);
    textAll("[data-air-unit]", " aqi");
    textAll("[data-air-label]", plain(air.label, "public air reading"));
  }
  const target = query("[data-air-bars]");
  if (!target) return;
  target.hidden = bars.length === 0;
  target.replaceChildren(...bars.map((bar) => {
    const item = make("span");
    item.style.setProperty("--bar", `${Math.min(Math.max(bar * 7, 8), 100)}%`);
    return item;
  }));
};
const renderUnavailable = (message) => {
  const notice = query("[data-telemetry-notice]");
  if (notice) {
    notice.hidden = false;
    notice.textContent = message ||
      "i can’t get a status reading right now. you can still see what i track below.";
  }
  show("[data-health-panel]", false);
  show("[data-feed-meta]", false);
  show("[data-live-section]", false);
  for (const node of document.querySelectorAll("[data-index-status]")) {
    node.hidden = true;
    node.textContent = "";
  }
};
const render = (data) => {
  const score = metric(data.health_score);
  const { radar, services, deployments, storage } = data;
  const { pools, overall } = storage;
  const weather = data.environment.weather || {};
  const air = data.environment.air || {};
  const airReading = numeric(air.aqi);
  const aqi = airReading !== null && airReading >= 0 && airReading <= 500 ? airReading : null;
  const bars = (Array.isArray(air.bars) ? air.bars : [])
    .map(numeric)
    .filter((value) => value !== null && value >= 0);
  let hasIndexReading = false;
  for (const node of document.querySelectorAll("[data-index-status]")) {
    const { summary } = sectionReading(data, node.dataset.indexStatus);
    node.textContent = summary;
    node.hidden = !summary;
    if (summary) hasIndexReading = true;
  }
  const hasSummary = score !== null || present(data.health_label) || data.health_reasons.length > 0 || radar.length > 0 || present(weather.temp) || aqi !== null || bars.length > 0;
  const hasStorage = overall !== null || pools.length > 0 || present(storage.redundancy) || present(storage.integrity);
  const hasPanel = hasSummary || services.length > 0 || deployments.length > 0 || hasStorage;
  if (!hasIndexReading && !hasPanel) {
    renderUnavailable("the API answered without any readings to show.");
    return;
  }
  const { label: reported, iso, state } = snapshotTime(data.generated_at);
  textAll("[data-generated]", reported);
  textAll("[data-feed-label]", state === "historical" ? "older reading" : "last reading");
  const generatedNode = query("[data-generated]");
  if (generatedNode) {
    if (iso) generatedNode.setAttribute("datetime", iso);
    else generatedNode.removeAttribute("datetime");
  }
  show("[data-feed-meta]", true);
  show("[data-live-section]", hasPanel);
  const notice = query("[data-telemetry-notice]");
  if (notice) {
    notice.hidden = state === "recent";
    notice.textContent = state === "historical"
      ? "these readings are over 15 minutes old. check the timestamp before relying on them."
      : state === "future"
        ? "the feed time is ahead of your browser’s clock, so i can’t tell how fresh these readings are."
        : "the API sent readings without a timestamp, so i can’t tell when they were taken.";
  }
  show("[data-health-panel]", score !== null);
  if (score !== null) {
    textAll("[data-health-label]", state === "historical" ? "historical health score" : "reported health score");
    textAll("[data-health-score]", score);
    textAll("[data-health-unit]", "%");
    textAll("[data-status-line]", services.length
      ? `${services.filter((item) => ["online", "running", "active"].includes(plain(item.status).toLowerCase())).length} of ${services.length} services reported online.`
      : "overall score from the status API.");
  }
  show("[data-summary-panel]", hasSummary);
  show("[data-score-ring]", score !== null);
  query("[data-score-ring]")?.style.setProperty("--score-angle", `${(score ?? 0) * 3.6}deg`);
  textAll("[data-headline]", present(data.headline) ? plain(data.headline) : "public systems readout");
  textAll("[data-subtitle]", present(data.subtitle) ? plain(data.subtitle) : "these are the readings my status API last sent.");
  show("[data-health-classification]", present(data.health_label));
  textAll("[data-health-classification]", plain(data.health_label));
  renderHealthReasons(data.health_reasons);
  renderRadar(radar);
  renderServices(services);
  renderDeployments(deployments);
  renderStorage(storage, pools, overall);
  renderEnvironment(weather, air, bars, aqi);
};

watchPublicSnapshot(render, renderUnavailable);
