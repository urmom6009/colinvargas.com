import { sectionReading, snapshotTime, watchPublicSnapshot } from "../lib/publicSystems.js";

const section = document.querySelector("[data-systems-section]").dataset.systemsSection;
const notice = document.querySelector("[data-telemetry-notice]");
const card = document.querySelector("[data-detail-card]");
const panel = document.querySelector("[data-detail-live-panel]");
const list = document.querySelector("[data-detail-live]");

function unavailable(message = "i can’t get a status reading right now.") {
  notice.textContent = message;
  notice.hidden = false;
  card.hidden = true;
  panel.hidden = true;
}

function render(data) {
  const { summary, detail, rows } = sectionReading(data, section);
  if (!summary) {
    unavailable(`the API answered without a reading for ${section}.`);
    return;
  }

  const { label, iso, state } = snapshotTime(data.generated_at);
  notice.hidden = state === "recent";
  notice.textContent = state === "historical"
    ? "this reading is over 15 minutes old. check the timestamp before relying on it."
    : state === "future"
      ? "the feed time is ahead of your browser’s clock, so i can’t tell how fresh this reading is."
      : "the API sent this reading without a timestamp.";
  card.hidden = false;
  panel.hidden = false;
  document.querySelector("[data-detail-label]").textContent = state === "historical" ? "older reading" : "last reading";
  document.querySelector("[data-detail-metric]").textContent = summary;
  const copy = document.querySelector("[data-detail-copy]");
  copy.hidden = !detail;
  copy.textContent = detail;
  const updated = document.querySelector("[data-detail-updated]");
  updated.textContent = label;
  if (iso) updated.setAttribute("datetime", iso);
  else updated.removeAttribute("datetime");

  list.replaceChildren(...rows.map(([label, reading]) => {
    const row = document.createElement("div");
    const key = document.createElement("span");
    const value = document.createElement("strong");
    key.textContent = label;
    value.textContent = reading;
    row.append(key, value);
    return row;
  }));
}

watchPublicSnapshot(render, unavailable);
