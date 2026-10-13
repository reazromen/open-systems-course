---
title: "Encryption in Transit, at Rest, and Key Lifecycle"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-166-encryption-in-transit-at-rest-and-key-lifecycle.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Encryption protects data only under a key and threat model. TLS protects transport sessions; storage encryption protects media or files; application-layer encryption can narrow trust further. Key lifecycle determines whether any of it remains secure."
eyebrow: "Open Systems Course · Lesson 166 of 180"
---

“The data is encrypted” is incomplete.

Encrypted where?

Against whom?

With which key?

Who can decrypt it?

How is the key rotated?

Security comes from the complete cryptographic system.

## Encryption in transit protects a communication path

TLS can provide:

confidentiality;
integrity;
peer authentication.

It protects bytes between TLS endpoints.

If a reverse proxy terminates TLS, plaintext exists beyond that endpoint unless another protected connection begins.

End-to-end user expectations must match actual termination points.

## Encryption at rest protects stored media

Disk or volume encryption can protect data if a disk is stolen.

Once the system is running and the volume is unlocked, an application with filesystem access can still read plaintext.

Database column encryption or application-layer encryption can create narrower boundaries.

Each layer protects against different threats.

## Authenticated encryption protects integrity too

Modern encryption schemes often use authenticated encryption with associated data, such as AES-GCM or ChaCha20-Poly1305.

The receiver can detect tampering in addition to decrypting content.

Confidentiality without integrity can be dangerous because attackers may modify ciphertext in useful ways under some constructions.

Use well-reviewed libraries and protocols.

Do not design custom cryptography.

## Nonces must obey algorithm rules

Some authenticated encryption modes require nonces never to repeat under the same key.

Nonce reuse can catastrophically break security.

Randomness, counters, storage, and crash behavior can all affect nonce uniqueness.

This is why protocol libraries are preferable to ad-hoc encryption wrappers.

## Key hierarchy narrows exposure

A master key can wrap data keys.

Different datasets can use different data keys.

Rotation can replace wrapping keys without re-encrypting every byte immediately, depending on design.

Separate keys by purpose and environment.

Production and development should not share cryptographic root keys.

## Rotation needs decrypt-old/encrypt-new strategy

If old data remains encrypted with old keys, deleting those keys destroys the data.

Systems can:

keep old decrypt keys;
write new data with current key;
re-encrypt gradually;
track key version with ciphertext.

Key rotation is a data migration.

## Backups need keys too

An encrypted backup without its decryption key is unrecoverable.

A backup and its key stored together under the same failure domain may not add much protection against compromise.

Recovery planning must include key recovery, access control, and audit.

## Practical exercise

For one application, draw every encryption boundary:

browser TLS;
edge-to-origin TLS;
database volume encryption;
backup encryption;
application field encryption if any.

For each boundary write:

key owner;
key storage;
rotation;
who sees plaintext.

The resulting diagram often reveals that “encrypted everywhere” still contains several plaintext trust zones.

## The lesson to carry forward

Encryption protects a defined boundary under a key lifecycle.

The next lesson studies the identity system used by TLS and many other protocols: certificates, certificate authorities, and PKI.
