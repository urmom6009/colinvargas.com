export const systemsSections = {
  website: {
    title: "website",
    eyebrow: "edge and uptime",
    headline: "portfolio edge, watched from the outside.",
    summary: "reachability, response shape, and deploy status for the main site.",
    metric: "online",
    detail: "portfolio edge is answering",
    signal: "100",
    sourceKey: "Website",
    notes: [
      "vercel remains the public website edge.",
      "the readout can show reachability and broad response health.",
      "restart controls and provider internals stay off this domain."
    ]
  },
  minecraft: {
    title: "minecraft",
    eyebrow: "relay and players",
    headline: "game server status without exposing the backend.",
    summary: "player-facing status for the minecraft relay, without backend routing details.",
    metric: "online",
    detail: "relay status without backend details",
    signal: "92",
    sourceKey: "Minecraft",
    notes: [
      "the public card shows status and player count only.",
      "wireguard, peer names, and host routing stay private.",
      "server actions belong on the private admin endpoint."
    ]
  },
  deployments: {
    title: "deployments",
    eyebrow: "build trail",
    headline: "recent builds with enough context to trust the surface.",
    summary: "latest visible refs for the portfolio and the read-only systems api.",
    metric: "tracked",
    detail: "recent builds summarized",
    signal: "86",
    sourceKey: "Services",
    notes: [
      "the timeline favors readable refs over raw logs.",
      "failed checks should appear here without leaking secrets.",
      "deploy controls stay behind the private admin endpoint."
    ]
  },
  storage: {
    title: "storage",
    eyebrow: "pool health",
    headline: "storage health, summarized without raw host internals.",
    summary: "pool state, integrity, and broad capacity signal without raw paths.",
    metric: "healthy",
    detail: "pool health without raw paths",
    signal: "98",
    sourceKey: "Storage",
    notes: [
      "public storage details stay coarse on purpose.",
      "pool status is useful; filesystem internals are not.",
      "deeper zfs output belongs on the private admin endpoint."
    ]
  }
};
