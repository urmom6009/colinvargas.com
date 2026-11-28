const supportedProtocols = new Set(["http:", "https:", "ssh:", "git:"]);

function canonicalPath(value) {
  let decoded;

  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }

  const repositoryPath = decoded
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.git$/i, "");
  const segments = repositoryPath.split("/");

  if (
    !repositoryPath ||
    !/^[a-z0-9._~+/-]+$/i.test(repositoryPath) ||
    segments.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    return null;
  }

  return repositoryPath;
}

function canonicalHost(value) {
  return /^(?:\[[a-f0-9:.]+\]|[a-z0-9.-]+)$/i.test(value) ? value : null;
}

export function canonicalRemoteIdentity(remoteUrl) {
  if (typeof remoteUrl !== "string" || !remoteUrl.trim()) return null;

  const remote = remoteUrl.trim();
  let host;
  let port = "";
  let repositoryPath;

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(remote)) {
    let parsed;

    try {
      parsed = new URL(remote);
    } catch {
      return null;
    }

    if (!supportedProtocols.has(parsed.protocol)) return null;
    if (parsed.password) return null;
    if (["http:", "https:", "git:"].includes(parsed.protocol) && parsed.username) {
      return null;
    }

    host = canonicalHost(parsed.hostname);
    port = parsed.port ? `:${parsed.port}` : "";
    repositoryPath = canonicalPath(parsed.pathname);
  } else {
    const scpRemote = /^(?:[^@\s/:]+@)?([^@\s/:]+):([^\s]+)$/.exec(remote);
    if (!scpRemote) return null;

    host = canonicalHost(scpRemote[1]);
    repositoryPath = canonicalPath(scpRemote[2].split(/[?#]/, 1)[0]);
  }

  if (!host || !repositoryPath) return null;
  return `${host}${port}/${repositoryPath}`;
}
