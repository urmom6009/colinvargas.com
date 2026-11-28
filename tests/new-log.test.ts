import assert from "node:assert/strict";
import test from "node:test";
import { canonicalRemoteIdentity } from "../scripts/log-metadata.mjs";

test("canonical repository identities preserve common HTTPS and SSH remotes", () => {
  assert.equal(
    canonicalRemoteIdentity("https://github.com/example/project.git"),
    "github.com/example/project",
  );
  assert.equal(
    canonicalRemoteIdentity("ssh://git@example.com/team/project.git"),
    "example.com/team/project",
  );
  assert.equal(
    canonicalRemoteIdentity("git@example.com:team/project.git"),
    "example.com/team/project",
  );
});

test("remote credentials and unsupported locations cannot reach frontmatter", () => {
  assert.equal(
    canonicalRemoteIdentity(
      "https://oauth2:synthetic-token@example.com/team/project.git",
    ),
    null,
  );
  assert.equal(
    canonicalRemoteIdentity(
      "https://synthetic-token@example.com/team/project.git",
    ),
    null,
  );
  assert.equal(
    canonicalRemoteIdentity(
      "ssh://git:synthetic-token@example.com/team/project.git",
    ),
    null,
  );
  assert.equal(canonicalRemoteIdentity("file:///private/project.git"), null);
  assert.equal(canonicalRemoteIdentity("../private/project.git"), null);
});

test("non-identity URL fields are removed from supported remotes", () => {
  assert.equal(
    canonicalRemoteIdentity(
      "https://example.com/team/project.git?token=synthetic-token#private",
    ),
    "example.com/team/project",
  );
  assert.equal(
    canonicalRemoteIdentity(
      "synthetic-user@example.com:team/project.git?token=synthetic-token#private",
    ),
    "example.com/team/project",
  );
});
