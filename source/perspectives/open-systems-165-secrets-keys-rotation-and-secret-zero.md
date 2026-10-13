---
title: "Secrets, Keys, Rotation, and Secret Zero"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-165-secrets-keys-rotation-and-secret-zero.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Secrets grant authority. Secure systems minimize where secrets exist, use short-lived credentials where possible, rotate them, audit access, and solve the bootstrap problem of how a workload obtains its first trusted credential."
eyebrow: "Open Systems Course · Lesson 165 of 180"
---

A secret in an environment variable is still a secret.

A secret in Kubernetes is still a secret.

A secret inside an encrypted file is still a secret once the process decrypts it.

Secret management is about reducing exposure and managing lifecycle.

## Not every credential should be long-lived

Long-lived API keys are operationally convenient.

They are dangerous because compromise can remain useful for months or years.

Prefer short-lived credentials when infrastructure supports them.

Examples:

workload identity;
temporary cloud credentials;
short-lived certificates;
OIDC federation.

Short lifetime limits the useful window after theft.

## Secret zero is the bootstrap problem

How does an application authenticate to the secret manager that gives it secrets?

If the answer is “another static password in the config file,” the problem moved rather than disappeared.

Bootstrap can use:

machine identity;
cloud workload identity;
Kubernetes service-account federation;
hardware key;
mTLS certificate.

Every system needs some root trust.

The goal is to minimize and protect it.

## Rotation needs overlap

Changing a database password instantly can break every service still using the old credential.

Safe rotation often has stages:

create new credential;
distribute;
confirm usage;
remove old credential.

Certificate/key rotation similarly needs overlap or coordinated cutover.

Rotation is a distributed deployment.

## Separate encryption keys by purpose

One key for everything creates a huge blast radius.

Separate:

TLS private keys;
database encryption keys;
firmware signing keys;
JWT signing keys;
backup encryption keys.

Different lifetimes and access policies apply.

A web server should not need the firmware signing key.

## Envelope encryption limits master-key exposure

Data can be encrypted with a data-encryption key.

That key is wrapped by a key-encryption key stored in a KMS/HSM.

Large data is not sent through the HSM for every byte.

The master key protects smaller data keys.

This enables centralized rotation and audit.

## Secrets should not enter source control

Git history remembers deleted values.

Secret scanners can detect many accidental credentials, but prevention is better.

Use configuration references to secret stores rather than embedding raw secrets.

If a secret is committed, remove it from use first by rotating/revoking it.

Deleting the file is not enough.

## Logs and crash dumps can leak secrets

Authorization headers, environment dumps, heap snapshots, support bundles, and shell history can expose credentials.

Redaction must apply across operational tooling.

Do not make debugging artifacts more privileged than the production system.

## Access to secrets needs authorization

A secret manager should know:

which workload;
which secret;
which version;
what operation;
when.

Audit access.

A compromised service should obtain only the secrets it actually needs.

## Practical exercise

Inventory secrets for one application.

For each write:

owner;
storage;
consumer;
lifetime;
rotation method;
revocation method;
audit location.

Then identify secret zero.

If you cannot explain how the first credential is trusted, the secret-management design is incomplete.

## The lesson to carry forward

Secrets are authority encoded as data.

The next lesson uses keys and cryptography to protect data in transit and at rest—and shows why encryption without key lifecycle is incomplete.
