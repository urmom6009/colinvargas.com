import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSnapshot, sectionReading, snapshotTime } from "../src/lib/publicSystems.js";

// Synthetic readings shaped like the public collector's response. Values are
// deliberately distinct so reading a neighboring service or score fails the test.
const snapshot = {
  generated_at: "2026-10-01T12:00:00Z",
  headline: "Public system status",
  subtitle: "Latest readings",
  health_score: 80,
  health_label: "watching",
  health_reasons: [
    { label: "website", value: "online", detail: "public status probe", tone: "good" },
    { label: "minecraft", value: "offline", detail: "relay stopped", tone: "warn" },
    { label: "storage", value: "75%", detail: "passed", tone: "good" },
    { label: "backups", value: "88%", detail: "latest public backup age", tone: "good" },
  ],
  radar: [
    { label: "Website", value: 95 }, { label: "Minecraft", value: 0 },
    { label: "Services", value: 63 }, { label: "Storage", value: 75 },
    { label: "Backups", value: 88 },
  ],
  cards: [
    { label: "Website", value: "Online", detail: "public site responded", tone: "good" },
    { label: "Minecraft Server", value: "Offline", detail: "no players", tone: "warn" },
    { label: "Deployments", value: "Tracked", detail: "public build status", tone: "good" },
    { label: "Storage Pools", value: "Healthy", detail: "passed", tone: "good" },
  ],
  services: [{ name: "web frontend", status: "active", public: true }, { name: "minecraft relay", status: "offline", public: true }],
  deployments: [{ name: "portfolio", status: "success", ref: "main", when: "today", duration: "12 s" }],
  storage: { overall: 0, pools: [{ name: "public pool", state: "ONLINE", used: "2 GiB", capacity: "8 GiB", health: 0 }], redundancy: "ZFS", integrity: "passed" },
  environment: { weather: { temp: "22 °C", label: "clear" }, air: { aqi: 0, label: "good", bars: [0, 3] } },
};

test("all four sections use collector card labels and keep the corresponding structured readings", () => {
  const data = normalizeSnapshot(snapshot);
  assert.deepEqual(["website", "minecraft", "deployments", "storage"].map((key) => sectionReading(data, key).summary),
    ["Online", "Offline", "Tracked", "Healthy"]);
  assert.deepEqual(sectionReading(data, "website").rows.at(-1), ["website signal score", "95%"]);
  assert.ok(sectionReading(data, "deployments").rows.some(([name, value]) => name === "portfolio" && value.includes("main")));
  assert.ok(sectionReading(data, "storage").rows.some(([name, value]) => name === "public pool" && value.includes("2 GiB used")));
});

test("partial snapshots use real service, build, pool and signal fields without inventing missing sections", () => {
  const from = (partial: object, section: string) => sectionReading(normalizeSnapshot(partial), section);
  assert.equal(from({ services: snapshot.services }, "website").summary, "active");
  assert.equal(from({ services: snapshot.services }, "minecraft").summary, "offline");
  assert.equal(from({ deployments: snapshot.deployments }, "deployments").summary, "1 build");
  assert.equal(from({ storage: snapshot.storage }, "storage").summary, "0%");
  assert.equal(from({ health_reasons: snapshot.health_reasons }, "website").summary, "online");
  assert.equal(from({ radar: snapshot.radar }, "minecraft").summary, "0%");
  assert.equal(from({ radar: snapshot.radar }, "deployments").summary, "63%");
  assert.equal(from({ services: snapshot.services }, "deployments").summary, "");
});

test("malformed, unknown and explicitly private readings are excluded", () => {
  const data = normalizeSnapshot({
    cards: [null, { label: "Website", value: "unavailable" }],
    services: [{ name: "web admin", status: "online", public: false }],
    radar: [{ label: "Website", value: false }, { label: "Minecraft", value: -1 }],
    deployments: [{ name: "no reading" }], storage: { pools: [{ name: "no reading" }], overall: false },
  });
  for (const section of ["website", "minecraft", "deployments", "storage"]) {
    assert.deepEqual(sectionReading(data, section), { summary: "", detail: "", rows: [] });
  }
});

test("report timestamps distinguish current, historical, future, and unreported values", () => {
  const now = Date.parse(snapshot.generated_at);
  assert.equal(snapshotTime(snapshot.generated_at, now).state, "recent");
  assert.equal(snapshotTime(snapshot.generated_at, now + 16 * 60_000).state, "historical");
  assert.equal(snapshotTime(snapshot.generated_at, now - 16 * 60_000).state, "future");
  for (const input of [null, true, {}, "", "invalid"]) {
    assert.deepEqual(snapshotTime(input, now), { label: "time unreported", iso: "", state: "unreported" });
  }
});
