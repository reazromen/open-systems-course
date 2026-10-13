---
title: "Threat Models: Assets, Adversaries, and Trust Boundaries"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-161-threat-models-assets-adversaries-and-trust-boundaries.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Security begins by naming what matters, who might attack it, which boundaries are trusted, and how failure would occur. Controls without a threat model become expensive rituals."
eyebrow: "Open Systems Course · Lesson 161 of 180"
---

Security conversations often begin with products:

add a firewall;
encrypt it;
use MFA;
put it behind a VPN.

Those controls can be useful.

They are not a threat model.

A threat model starts with the system and asks what must be protected, from whom, and across which boundaries.

## Assets come first

Assets can include:

customer data;
credentials;
private keys;
money;
device control;
telephony identity;
firmware signing keys;
availability;
audit history.

Not every asset needs the same protection.

Losing a public cache entry is different from losing a signing key.

## Adversaries have capabilities

Possible adversaries include:

unauthenticated Internet user;
malicious tenant;
compromised employee account;
stolen device;
supply-chain attacker;
local network attacker;
malware on one host.

Threats depend on capability.

A control that blocks unauthenticated users may not stop a compromised administrator account.

## Trust boundaries are where assumptions change

A trust boundary can exist between:

browser and API;
public edge and private service;
application and database;
tenant A and tenant B;
device and cloud;
SIP trunk and internal PBX;
CI system and signing service.

Crossing a boundary should trigger explicit authentication, authorization, validation, or policy.

A private IP address is not automatically a trust boundary.

## Data flow diagrams expose the attack surface

Draw:

processes;
data stores;
external actors;
communication paths;
trust boundaries.

Then ask at every arrow:

Who can send this?
How is identity established?
What input is accepted?
What authority does the receiver grant?
What if the message is replayed or modified?
What sensitive data crosses?

The diagram turns vague security into inspectable interfaces.

## STRIDE is one useful checklist

STRIDE categories are often summarized as:

spoofing;
tampering;
repudiation;
information disclosure;
denial of service;
elevation of privilege.

It is not a complete methodology.

It is a prompt that helps teams avoid thinking only about confidentiality.

Availability and authorization failures matter too.

## Threat likelihood and impact differ

A highly damaging attack can be very hard to execute.

A small-impact attack can be trivial and frequent.

Prioritization needs both likelihood and impact, plus cost of mitigation and detectability.

Security work should not be driven only by dramatic scenarios.

## Assume components can fail

A strong architecture asks:

What if one service credential leaks?
What if one tenant escapes application validation?
What if one device is physically captured?
What if one CI runner is compromised?

Compartmentalization limits blast radius.

That is why least privilege, per-device credentials, network segmentation, and separate signing keys matter.

## Abuse cases are practical threat models

Take a normal use case:

user uploads profile image.

Now write abuse cases:

oversized file;
malformed image parser input;
path traversal;
stored script payload;
private image exposed publicly;
upload used for malware hosting.

The abuse cases reveal validation and isolation requirements.

## Security controls need evidence

A control should be testable.

Examples:

authorization unit/integration test;
certificate validation test;
secret scanning;
dependency signature verification;
audit log;
rate-limit metric;
penetration test finding.

“Protected by zero trust” is not evidence.

## Practical exercise

Choose one real system.

Draw five boxes and every trust boundary.

For each boundary write:

identity;
authentication;
authorization;
input validation;
encryption;
logging;
failure behavior.

Then choose one asset and one adversary.

Trace the shortest path the adversary would need to reach the asset.

That path is your first threat model.

## The lesson to carry forward

Security is architecture under adversarial conditions.

The next lesson separates identity from proof of identity: authentication.
