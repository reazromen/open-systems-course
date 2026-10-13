---
title: "PKI: Certificates, CAs, and Service Identity"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-167-pki-certificates-cas-and-service-identity.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "A certificate binds a public key to asserted identity under a signature chain. PKI security depends on trust anchors, name validation, private-key protection, revocation/lifetime, and automated renewal."
eyebrow: "Open Systems Course · Lesson 167 of 180"
---

A browser sees a certificate.

Why should it trust the public key inside?

Because certificate validation builds a chain from that leaf certificate to a configured trust anchor under PKI rules.

## A certificate carries signed assertions

X.509 certificates can contain:

subject information;
subject alternative names;
public key;
issuer;
validity interval;
key usage;
extensions.

The issuer signs the certificate.

The signature does not prove the service is currently safe.

It proves the certificate was issued under the issuer's policy and has not been modified.

## Service identity uses names

For HTTPS, the client validates that the certificate is acceptable for the service name it intended to reach.

Connecting to the correct IP address is not enough.

The name binds the user's intended service to the authenticated key.

RFC 9525 defines current service-identity verification guidance for TLS applications.

## The chain ends in local trust

A root CA is trusted because the client trust store says so.

That is a policy decision installed by the operating system, browser, organization, or application.

Private enterprise PKI can use its own roots.

The important question is:

which roots does this client trust?

## Intermediate CAs reduce root exposure

Root keys can be kept offline or highly protected.

Intermediate CAs issue operational certificates.

If an intermediate is compromised, the blast radius can be smaller than exposing the root.

PKI is a delegation hierarchy.

## Private keys are the actual authority

A certificate can be public.

The private key must remain controlled.

If an attacker steals a server's private key, they may impersonate the service under conditions allowed by the certificate/protocol.

Use HSMs, secure key stores, file permissions, and short-lived certificates as appropriate.

## Expiry creates operational incidents

Certificates expire intentionally.

That limits lifetime and forces renewal.

It also creates outages when renewal fails.

Automate:

issuance;
renewal;
deployment;
reload;
expiry monitoring.

Do not rely on a calendar reminder for thousands of certificates.

## Revocation is imperfect in practice

PKI includes mechanisms such as CRLs and OCSP.

Real client behavior varies, especially under network failure.

Short certificate lifetimes can reduce reliance on revocation for some systems.

Threat models should not assume instant universal revocation.

## mTLS authenticates both sides

Normal HTTPS commonly authenticates the server to the client.

Mutual TLS also presents a client certificate so the server can authenticate the client at TLS layer.

This works well for service or device identity.

Authorization is still separate.

A valid client certificate does not automatically grant every API permission.

## Practical exercise

Inspect one TLS service you own.

Record:

leaf SANs;
issuer;
intermediate chain;
valid-from/to;
key algorithm;
certificate usage;
renewal mechanism.

Then identify the trust anchor used by one client.

Finally, compare hostname verification with merely connecting to the server IP.

## The lesson to carry forward

PKI turns public keys into authenticated service identities through delegated trust.

The next lesson applies all these controls to network and application boundaries through segmentation and zero-trust-style policy.
