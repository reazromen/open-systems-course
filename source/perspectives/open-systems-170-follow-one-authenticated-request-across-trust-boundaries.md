---
title: "Follow One Authenticated Request Across Trust Boundaries"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-170-follow-one-authenticated-request-across-trust-boundaries.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 16
excerpt: "One protected request crosses DNS, TLS, login/session state, gateway policy, service identity, authorization, secrets, database permissions, audit, and response handling. Security comes from the composition of those boundaries."
eyebrow: "Open Systems Course · Lesson 170 of 180"
---

Constructed example:

A tenant administrator changes one IoT device's configuration.

The request crosses a browser, identity provider, public API, internal service, database, and device command system.

No real deployment is described.

## 1. Browser authenticates the service

The browser resolves the application name.

TLS validates the service certificate for that name.

This protects the connection to the TLS endpoint.

It does not authenticate the human yet.

## 2. User authenticates through identity provider

The application redirects to an OpenID Connect provider.

The user completes authentication, possibly with a passkey or MFA.

The client receives protocol artifacts according to the OIDC flow.

The application validates issuer, audience, signature, nonce/state, and expiry as required.

Now the application has authenticated identity context.

## 3. Session preserves continuity

The application creates a secure session or uses appropriate tokens.

The browser does not resend the passkey secret on every request.

Session lifetime, cookie scope, revocation, and CSRF protections become part of the boundary.

## 4. API authorizes the specific object

Request:

PATCH /devices/abc123.

The API does not stop at “user is admin.”

It checks:

user tenant;
device tenant;
required role/permission;
operation allowed;
current device state.

This prevents object-level authorization failure.

## 5. Gateway and service identity are separate

The public gateway forwards the request to a device-management service.

Internal mTLS or workload identity authenticates the service path.

The downstream service does not trust a forged X-User header from any network client.

It trusts identity context only from an authenticated upstream under explicit policy.

## 6. Service obtains secrets through workload identity

The service needs database credentials or a short-lived database token.

It authenticates to secret/KMS infrastructure using workload identity.

No permanent production password is embedded in the container image.

Secret access is audited.

## 7. Database enforces its own boundary

The service account has only the required database privileges.

The transaction updates desired device configuration.

Tenant identifiers and constraints protect data integrity.

A database superuser credential is not required for a normal request.

## 8. Audit records the security-relevant change

Audit event records:

actor;
tenant;
device;
old configuration;
new configuration;
request/trace ID;
time;
result.

It excludes bearer tokens and secrets.

This lets incident responders later answer who changed the device.

## 9. Command service receives narrow authority

A separate component publishes the desired state to the device.

Its broker credentials permit only command namespaces it owns.

The device itself validates command identity, expiry, and local safety rules.

Cloud authorization does not bypass device safety.

## 10. Supply-chain trust sits underneath every process

Gateway, application, and command service all run signed/verified artifacts produced by controlled CI.

If the build pipeline is compromised, runtime identity can faithfully authenticate malicious code.

Runtime security depends on supply-chain security.

## 11. Observability must not leak credentials

Trace IDs and authorization decisions can be logged.

Raw session cookies, access tokens, private keys, and device secrets should not be.

Security observability and secret minimization must coexist.

## 12. Revocation changes future authorization

Suppose the administrator account is disabled.

Existing sessions may need revocation.

Cached authorization decisions need expiry.

Long-lived tokens can delay enforcement.

The revocation requirement influences session/token architecture.

## Failure drill

Test in a controlled environment:

expired certificate;
invalid OIDC audience;
revoked session;
wrong tenant;
missing role;
database permission denied;
broker authorization denied;
expired device command.

For each, verify that failure occurs at the intended boundary and is observable without exposing sensitive data.

## What Module 17 added

Security and Trust Boundaries connected:

threat modeling;
authentication;
authorization;
sessions/tokens;
secrets;
encryption;
PKI;
network segmentation;
software supply chain;
end-to-end security reasoning.

Security is not one perimeter.

It is a chain of explicit trust decisions.

## The module to carry forward

The final module applies the full systems method to AI: models, tokens, embeddings, inference, retrieval, tools, agents, memory, evaluation, safety, cost, and one complete production architecture.
