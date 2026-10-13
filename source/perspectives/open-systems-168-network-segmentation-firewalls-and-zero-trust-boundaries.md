---
title: "Network Segmentation, Firewalls, and Zero-Trust Boundaries"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-168-network-segmentation-firewalls-and-zero-trust-boundaries.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Networks can reduce reachability, but network location is not identity. Strong architectures combine segmentation with authenticated workloads, explicit authorization, narrow ingress/egress, and observable policy."
eyebrow: "Open Systems Course · Lesson 168 of 180"
---

A server is on a private network.

Is it trusted?

Not automatically.

Private addressing reduces direct reachability from some networks.

It does not prove which process is calling or whether that process is compromised.

## Firewalls control reachability

A firewall can allow or deny traffic based on fields such as:

source/destination;
protocol;
port;
connection state;
interface;
application identity in richer systems.

Reducing unnecessary reachability lowers attack surface.

A database that only the application needs should not listen to the public Internet.

## Segmentation limits lateral movement

Place systems into zones or security groups based on function and trust.

Examples:

public edge;
application tier;
database tier;
management;
CI;
IoT management;
telephony trunks.

If one web server is compromised, segmentation can prevent direct access to unrelated infrastructure.

The boundary should follow required communication, not historical subnet layout.

## Network location is a weak identity signal

Source IP can be NATed, spoofed in some contexts, reassigned, or shared.

“Request came from 10.0.0.0/8” is not strong user/service authentication.

Use workload identity or mTLS for sensitive service-to-service authorization.

Network policy then becomes an additional control.

## Zero trust means explicit verification, not no networks

NIST Zero Trust Architecture emphasizes that trust is not granted solely based on network location.

Access decisions use identity, device/workload context, resource policy, and continuous risk signals.

This does not eliminate firewalls or VPNs.

It changes what they prove.

## Egress policy matters too

Most firewall diagrams focus on inbound traffic.

A compromised service can exfiltrate data or reach dangerous internal resources through unrestricted outbound access.

Control egress where practical:

allowed services;
DNS;
package mirrors;
external APIs;
management destinations.

Record denied attempts.

## Administrative planes deserve stricter boundaries

SSH, database admin ports, Kubernetes APIs, hypervisor consoles, and secret managers are high-value targets.

Separate management access from normal application traffic.

Use strong identity, MFA, short-lived credentials, and audit.

Do not expose administration merely because the application itself is public.

## Service meshes move policy into proxies

A service mesh can provide workload identity, mTLS, and policy between services.

This creates operational dependencies:

certificate issuance;
sidecar/proxy availability;
policy distribution;
traffic interception.

A mesh is not automatically more secure if its control plane is misconfigured.

Understand which component enforces the policy.

## Practical exercise

Draw one network architecture.

For every service, list:

required inbound peers;
required outbound peers;
administrative access;
authentication method.

Then compare with actual firewall/security-group rules.

Every rule broader than the communication requirement should have an explanation.

## The lesson to carry forward

Network controls reduce reachable attack surface, while identity and authorization define who may use that reachability.

The next lesson expands trust beyond runtime into the software supply chain: source, dependencies, builds, artifacts, and updates.
