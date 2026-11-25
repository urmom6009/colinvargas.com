// Common to the dashboard and its four static detail routes.
export const plain = (value, backup = "") =>
  typeof value === "string" || Number.isFinite(value) ? String(value).trim() : backup;

export const present = (value) =>
  Boolean(plain(value)) && !["unavailable", "unknown", "—", "null"].includes(plain(value).toLowerCase());

export const numeric = (value) => {
  if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const metric = (value) => {
  const number = numeric(value);
  return number !== null && number >= 0 && number <= 100 ? number : null;
};

const publicRows = (value) =>
  Array.isArray(value) ? value.filter((row) => row && typeof row === "object" && row.public !== false) : [];

export function normalizeSnapshot(incoming) {
  const data = incoming && typeof incoming === "object" && !Array.isArray(incoming) ? incoming : {};
  const storage = data.storage && typeof data.storage === "object" ? data.storage : {};
  return {
    ...data,
    cards: publicRows(data.cards).filter((item) => present(item.label) && present(item.value)),
    health_reasons: publicRows(data.health_reasons).filter((item) => present(item.label) && present(item.value)),
    radar: publicRows(data.radar).filter((item) => present(item.label) && metric(item.value) !== null),
    services: publicRows(data.services).filter((item) => present(item.name) && present(item.status)),
    deployments: publicRows(data.deployments).filter((item) =>
      present(item.name) && [item.status, item.ref, item.when, item.duration].some(present)),
    storage: {
      ...storage,
      overall: metric(storage.overall),
      pools: publicRows(storage.pools).filter((pool) => present(pool.name) &&
        (metric(pool.health) !== null || [pool.state, pool.used, pool.capacity].some(present))),
    },
    environment: data.environment && typeof data.environment === "object" ? data.environment : {},
  };
}

function sectionKey(value) {
  const label = plain(value).toLowerCase();
  if (label.includes("minecraft")) return "minecraft";
  if (label.includes("deploy")) return "deployments";
  if (label.includes("storage")) return "storage";
  if (/\bweb(?:site)?\b|\bcolinvargas\.com\b/.test(label)) return "website";
  return null;
}

export function sectionReading(data, section) {
  const matches = (item) => sectionKey(item.label) === section;
  const card = data.cards.find(matches) ?? data.health_reasons.find(matches);
  // The existing builds page also reports the public Services radar signal.
  const signal = data.radar.find(matches) ?? (section === "deployments"
    ? data.radar.find((item) => plain(item.label).toLowerCase() === "services")
    : undefined);
  const rows = [];
  let summary = card ? plain(card.value) : "";
  const detail = present(card?.detail) ? plain(card.detail) : "";
  if (summary) rows.push(["status", summary]);
  if (detail) rows.push(["detail", detail]);

  if (section === "website" || section === "minecraft") {
    const services = data.services.filter((item) => sectionKey(item.name) === section);
    for (const service of services) rows.push([plain(service.name), plain(service.status)]);
    if (!summary && services.length === 1) summary = plain(services[0].status);
    if (!summary && services.length > 1) summary = `${services.length} services`;
  }

  if (section === "deployments") {
    for (const build of data.deployments) {
      const value = [build.status, build.ref, build.when, build.duration].filter(present).map((v) => plain(v));
      rows.push([plain(build.name), value.join(" · ")]);
    }
    if (!summary && data.deployments.length) {
      const count = data.deployments.length;
      summary = `${count} ${count === 1 ? "build" : "builds"}`;
    }
  }

  if (section === "storage") {
    const { overall, integrity, redundancy, pools } = data.storage;
    if (overall !== null) rows.push(["overall pool health", `${overall}%`]);
    if (present(integrity)) rows.push(["integrity", plain(integrity)]);
    if (present(redundancy)) rows.push(["redundancy", plain(redundancy)]);
    for (const pool of pools) {
      const health = metric(pool.health);
      const values = [pool.state, health !== null ? `${health}% health` : "",
        present(pool.used) ? `${plain(pool.used)} used` : "",
        present(pool.capacity) ? `${plain(pool.capacity)} capacity` : ""];
      rows.push([plain(pool.name), values.filter(present).join(" · ")]);
    }
    if (!summary && overall !== null) summary = `${overall}%`;
    if (!summary && present(integrity)) summary = plain(integrity);
    if (!summary && pools.length) summary = `${pools.length} ${pools.length === 1 ? "pool" : "pools"}`;
    if (!summary && present(redundancy)) summary = plain(redundancy);
  }

  if (signal) {
    const score = `${metric(signal.value)}%`;
    rows.push([plain(signal.label).toLowerCase() + " signal score", score]);
    if (!summary) summary = score;
  }
  return { summary, detail, rows };
}

const staleAfterMs = 15 * 60_000;
const dateFormat = new Intl.DateTimeFormat("en", {
  month: "short", day: "numeric", year: "numeric",
  hour: "2-digit", minute: "2-digit", timeZoneName: "short",
});

export function snapshotTime(value, now = Date.now()) {
  const time = typeof value === "string" && value.trim() ? Date.parse(value)
    : Number.isFinite(value) ? value : NaN;
  if (!Number.isFinite(time) || Number.isNaN(new Date(time).getTime())) {
    return { label: "time unreported", iso: "", state: "unreported" };
  }
  const date = new Date(time);
  const age = now - time;
  return {
    label: dateFormat.format(date).toLowerCase(),
    iso: date.toISOString(),
    state: age > staleAfterMs ? "historical" : age < -staleAfterMs ? "future" : "recent",
  };
}

export function watchPublicSnapshot(render, unavailable) {
  async function refresh() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch("/systems/api/public", {
        headers: { accept: "application/json" }, cache: "no-store", signal: controller.signal,
      });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid public snapshot");
      render(normalizeSnapshot(data));
    } catch {
      unavailable();
    } finally {
      window.clearTimeout(timeout);
    }
  }
  refresh();
  window.setInterval(refresh, 60_000);
}
