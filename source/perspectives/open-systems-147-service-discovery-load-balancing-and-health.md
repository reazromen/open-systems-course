---
title: "Service Discovery, Load Balancing, and Health"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-147-service-discovery-load-balancing-and-health.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "Distributed applications need to map logical service names to changing instances and distribute work across them. Discovery, health checks, load balancing, connection pools, and draining turn ephemeral processes into stable services."
eyebrow: "Open Systems Course · Lesson 147 of 180"
---

A service name is stable.

Its processes are not.

Instances restart, autoscale, move hosts, change IP addresses, and become unhealthy.

Service discovery bridges stable identity to changing endpoints.

## DNS is one discovery mechanism

A service can publish A/AAAA records.

Clients resolve the name and choose an address.

TTL controls how long mappings can be cached.

This works well for many systems.

But DNS alone does not carry every property a sophisticated load balancer may want, such as live request load or per-endpoint health.

## Registries hold richer endpoint state

Systems such as Kubernetes, Consul, and service meshes maintain endpoint registries.

Instances register or are discovered from orchestration state.

Clients or proxies receive a current endpoint set.

The registry itself becomes control-plane infrastructure.

If discovery is unavailable, existing connections may continue while new routing decisions fail.

## Load balancing can happen at several layers

Examples:

DNS load distribution;
Layer 4 connection balancing;
Layer 7 HTTP proxying;
client-side balancing;
service-mesh sidecars.

Each sees different information.

A Layer 4 balancer sees connections.

An HTTP proxy can route by path/header.

A client-side balancer can incorporate application-specific endpoint metadata.

## Round robin is not equal load

Two requests can have very different cost.

One may take 5 ms.

Another may hold a connection for 30 seconds.

Round-robin request counts can therefore produce uneven resource use.

Policies such as least connections, weighted endpoints, or latency-aware selection can better match some workloads.

Measure actual cost.

## Health has several meanings

Liveness asks:

is the process alive?

Readiness asks:

should this instance receive new traffic?

Dependency health asks:

can it perform required operations?

Do not make one endpoint answer all three without thinking.

An application can be alive but not ready because its database migration is incomplete.

## Draining prevents abrupt termination

When removing an instance:

stop sending new requests;
allow in-flight requests to finish;
close or migrate long-lived connections;
then terminate.

Without draining, autoscaling and deployments become user-visible resets.

SIP registrations, WebSockets, and streaming connections make draining especially important.

## Connection pools can defeat naive balancing

If a client opens ten persistent HTTP/2 connections and keeps them for hours, changing DNS records may not redistribute existing traffic.

Load balancing happens when connections are created, unless the protocol/proxy supports finer-grained routing.

Long-lived transport state must be included in scaling plans.

## Practical experiment

Run three identical local HTTP services behind a reverse proxy.

Give each instance an identifier.

Send repeated requests and observe distribution.

Then make one instance slow but still “healthy.”

Compare round-robin behavior with a health check that marks the slow instance unavailable.

Finally, drain one instance before shutdown.

## The lesson to carry forward

Discovery maps service identity to current endpoints; load balancing maps work to those endpoints.

The next lesson asks what happens when one dataset becomes too large for one node: partitioning and sharding.

## Interactive exercise: compare load-balancing policies

Use the [load-balancing simulator](../prototypes/interactive-system-design.html#lb-title) to compare Round Robin with Least Connections, change server health, and observe active request counts. The sequence is deterministic and is not a benchmark.
