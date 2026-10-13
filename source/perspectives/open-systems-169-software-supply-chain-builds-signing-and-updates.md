---
title: "Software Supply Chain: Builds, Signing, and Updates"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-169-software-supply-chain-builds-signing-and-updates.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "Runtime security begins before deployment. Source provenance, dependencies, CI identity, reproducible or attestable builds, artifact signatures, SBOMs, and update policy determine whether you know what software you are actually running."
eyebrow: "Open Systems Course · Lesson 169 of 180"
---

A production binary did not appear from nowhere.

It came through:

source;
dependencies;
build tools;
CI workers;
artifact registry;
deployment;
update mechanism.

Every stage can change what finally runs.

That is the software supply chain.

## Source control is one trust boundary

Protect:

repository access;
branch protection;
review policy;
release tags;
CI configuration.

An attacker who changes the build workflow can bypass careful application review.

Configuration-as-code is executable security policy.

## Dependencies are executable inputs

A package dependency can run code at build or runtime.

Pin versions where appropriate.

Verify integrity.

Track known vulnerabilities.

Remove unused packages.

A vulnerability scanner is not a guarantee that a dependency is safe, but it adds evidence.

## Build identity matters

Who built the artifact?

Which source revision?

Which build environment?

Which dependencies?

Which command?

Provenance metadata makes these questions answerable.

SLSA defines levels and provenance concepts for improving supply-chain integrity.

## Sign artifacts, not just Git commits

A container image, firmware binary, package, or release archive can be signed.

Deployment systems can verify signatures before execution.

This protects the path between build output and runtime artifact selection.

Firmware signing from Module 13 is the same pattern.

## SBOMs describe components

A Software Bill of Materials lists components included in an artifact.

Formats such as SPDX and CycloneDX make inventories machine-readable.

An SBOM helps answer:

Which deployed products include library X?

It does not prove the library is safe or that the artifact was built from the listed components unless provenance and verification connect the claims.

## CI credentials should be short-lived

Build runners are attractive targets because they often can publish artifacts or deploy.

Use workload federation or short-lived credentials when possible.

A pull request from an untrusted fork should not automatically obtain production secrets.

Separate build, sign, and deploy privileges.

## Reproducibility is strong evidence

A reproducible build allows independent builders to produce identical or equivalently verifiable artifacts from the same source inputs.

Not every ecosystem achieves this easily.

Even without full reproducibility, deterministic build metadata and attestations improve traceability.

## Update channels need policy

Stable;
beta;
canary;
emergency.

A signed artifact can still be wrong for one hardware version.

Deployment policy should check:

artifact identity;
target environment;
version constraints;
approval;
rollout cohort;
rollback.

Signing proves origin/integrity, not compatibility.

## Practical exercise

Choose one deployed artifact.

Trace backward:

running process/container;
image digest;
registry artifact;
build job;
source commit;
dependency lock file;
review/approval.

If any step depends only on a mutable tag such as latest, identify how a different artifact could silently occupy that name.

## The lesson to carry forward

Supply-chain security preserves trust from source to running artifact.

The final security lesson follows one authenticated request across TLS, identity, authorization, secrets, database policy, audit, and response.
