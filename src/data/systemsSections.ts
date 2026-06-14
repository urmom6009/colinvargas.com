export const systemsSections = {
  website: {
    title: "website",
    eyebrow: "edge and uptime",
    headline: "portfolio edge, watched from the outside.",
    summary: "public reachability, response time, and the deploy path for the main site.",
    metric: "online",
    detail: "colinvargas.com responding",
    signal: "100",
    sourceKey: "Website",
    notes: [
      "vercel remains the public website edge.",
      "the systems page reads only sanitized public telemetry.",
      "admin controls are intentionally absent from the portfolio domain."
    ]
  },
  minecraft: {
    title: "minecraft",
    eyebrow: "relay and players",
    headline: "game server status without exposing the backend.",
    summary: "public player-facing status for the minecraft relay and cozy backend path.",
    metric: "online",
    detail: "public relay monitored",
    signal: "92",
    sourceKey: "Minecraft",
    notes: [
      "the public card shows status and player count only.",
      "wireguard, peer, and host routing details stay private.",
      "deeper controls belong on the admin hostname."
    ]
  },
  deployments: {
    title: "deployments",
    eyebrow: "build trail",
    headline: "recent builds with enough context to trust the surface.",
    summary: "latest visible refs for the portfolio, mission-control, and adjacent projects.",
    metric: "tracked",
    detail: "local repos and staged builds",
    signal: "86",
    sourceKey: "Services",
    notes: [
      "the timeline favors readable refs over raw logs.",
      "failed checks should appear here without leaking secrets.",
      "private deploy controls stay behind the admin gate."
    ]
  },
  storage: {
    title: "storage",
    eyebrow: "pool health",
    headline: "storage health, summarized without raw host internals.",
    summary: "sanitized pool state, integrity, and broad capacity signal.",
    metric: "healthy",
    detail: "zfs integrity watched",
    signal: "98",
    sourceKey: "Storage",
    notes: [
      "public storage details stay intentionally coarse.",
      "pool status is useful; filesystem internals are not public.",
      "admin can carry deeper zfs output once access is settled."
    ]
  }
};
