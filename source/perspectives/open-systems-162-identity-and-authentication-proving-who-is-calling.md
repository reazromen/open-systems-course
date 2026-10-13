---
title: "Identity and Authentication: Proving Who Is Calling"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-162-identity-and-authentication-proving-who-is-calling.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Identity names an entity; authentication establishes evidence that the claimant controls an accepted authenticator. Passwords, passkeys, certificates, and device keys make different proof and recovery trade-offs."
eyebrow: "Open Systems Course · Lesson 162 of 180"
---

A username is not authentication.

An email address is not authentication.

A device serial number is not authentication.

They are identifiers.

Authentication is the process of establishing evidence that a claimant controls an accepted authenticator for an identity.

## Identity is a namespace problem

Examples:

user:42;
service:billing;
device:abc123;
sip:3005@example.com.

The system needs stable identifiers so policy and audit can refer to the same entity over time.

Display names can change.

Identity should remain stable.

## Passwords are shared secrets

A password proves knowledge of a secret.

Servers should not store plaintext passwords.

They should store password-verifier output from a password hashing function designed to be expensive for attackers.

Salts prevent identical passwords from sharing identical stored hashes.

Rate limiting and MFA reduce online guessing risk.

Password reset is part of the authentication system and can be weaker than login if designed badly.

## MFA combines independent factors

Factors are often grouped as:

something you know;
something you have;
something you are.

Two passwords are not two independent factors.

A password plus a hardware-backed authenticator is stronger because compromise paths differ.

The threat model determines whether MFA is needed.

## Passkeys use public-key cryptography

WebAuthn/FIDO credentials let an authenticator create a key pair scoped to a relying party.

The server stores public-key material.

The private key remains with the authenticator.

Phishing resistance is stronger than password-only systems because credentials are bound to the legitimate relying-party origin and protocol.

Recovery remains important: losing every authenticator cannot permanently destroy the account unless that is intended.

## Service authentication differs from human login

Services can authenticate using:

mTLS certificates;
workload identity;
signed tokens;
cloud identity;
short-lived credentials.

Embedding one permanent API key in every server is easy and risky.

Machine credentials should have lifecycle, scope, rotation, and revocation.

## Device authentication has physical threats

An IoT device can store a private key in flash, secure element, or hardware-protected key storage.

If an attacker can physically extract the key, they can impersonate the device.

The authentication design should match the device's physical exposure.

A sensor bolted to a public pole has a different threat model from a server in a locked data center.

## Authentication events need audit

Record:

identity;
authentication method;
success/failure;
time;
source/context;
risk-relevant changes.

Do not log passwords, private keys, or full tokens.

Audit data should support account-compromise investigation without becoming another credential store.

## Session creation follows authentication

After successful login, web systems usually create session state or issue tokens.

The user should not re-enter the password for every request.

That means the security boundary moves:

credential proves login;
session/token proves subsequent continuity.

Protect the session as carefully as the credential.

## Recovery is part of authentication

Account recovery can bypass strong login controls.

If a support agent can reset MFA after answering one weak question, the real authentication strength is the recovery process.

Design:

recovery proof;
cool-down;
notification;
audit;
revocation of old sessions.

## Practical exercise

For one system, list every identity type:

human user;
administrator;
service;
device;
CI job.

For each, write:

authenticator;
where secret/private key lives;
lifetime;
rotation;
recovery;
revocation.

Any identity with “never expires” should trigger a design review.

## The lesson to carry forward

Authentication proves identity under an explicit credential model.

The next lesson asks the more important question after authentication: what is that identity allowed to do?
