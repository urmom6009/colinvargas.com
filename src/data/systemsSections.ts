export const systemsSections = {
  website: {
    title: "website",
    eyebrow: "uptime",
    headline: "is my site responding?",
    summary: "i check whether the portfolio loads from outside my network.",
    sourceKey: "Website",
    notes: [
      "i host this portfolio on Vercel.",
      "i use this check to see whether the site responds from outside my network.",
      "the time on a reading tells you when the check last reported."
    ]
  },
  minecraft: {
    title: "minecraft",
    eyebrow: "relay and players",
    headline: "my Minecraft relay",
    summary: "whether my relay is up and how many people are on.",
    sourceKey: "Minecraft",
    notes: [
      "i publish online status and the player count when they’re available.",
      "i manage the relay from my private dashboard."
    ]
  },
  deployments: {
    title: "deployments",
    eyebrow: "builds",
    headline: "what i’ve deployed recently",
    summary: "recent builds for the portfolio and my status API.",
    sourceKey: "Services",
    notes: [
      "i keep the branch or commit with a build so i can tell what went out.",
      "this list shows the build status as the API reports it."
    ]
  },
  storage: {
    title: "storage",
    eyebrow: "pool health",
    headline: "how my storage is doing",
    summary: "ZFS pool health and a rough sense of how much space is in use.",
    sourceKey: "Storage",
    notes: [
      "i check ZFS pool status and storage use here.",
      "i use the private dashboard when i need the host or filesystem details."
    ]
  }
};
