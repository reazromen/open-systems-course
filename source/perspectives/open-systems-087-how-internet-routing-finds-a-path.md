---
title: "How Internet Routing Finds a Path"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-087-how-internet-routing-finds-a-path.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "BGP exchanges reachability information between autonomous systems. The resulting Internet path is shaped by policy and routing state, not simply by physical distance."
eyebrow: "Open Systems Course · Lesson 87 of 180"
---

Your laptop has a default route.

That gets a packet to a nearby router.

It does not explain how thousands of independently operated networks decide where an Internet prefix should be reached.

The global Internet is not one centrally controlled router.

It is an interconnection of networks with separate administration and policy. At the boundaries between those networks, the Border Gateway Protocol, or BGP, is the dominant mechanism for exchanging inter-domain reachability information.

RFC 4271 specifies BGP-4.

## Start with autonomous systems

An **Autonomous System**, or AS, is a routing domain identified by an AS number for inter-domain routing purposes.

A simplified Internet path can look like:

```text
your host
   ↓
access router
   ↓
ISP AS
   ↓
transit or peer AS
   ↓
destination AS
   ↓
service network
```

The arrows do not imply one router per AS.

Each AS can contain a large internal network with its own routing protocols, topology, and policies.

BGP operates at the boundary where networks exchange reachability.

## BGP advertises prefixes, not application services

A BGP speaker can advertise reachability to IP prefixes.

Conceptually:

```text
203.0.113.0/24 reachable through this BGP path
```

The example prefix is documentation space.

That route does not say:

- the web server is healthy;
- DNS points to the prefix;
- TCP port 443 is listening;
- the TLS certificate is valid;
- the application returned correct data.

BGP's claim is narrower: routing information about network reachability.

Again, protocol success at one layer is not end-to-end application success.

## AS_PATH records inter-domain path information

One important BGP attribute is AS_PATH.

As an advertisement crosses external BGP boundaries, AS path information records the autonomous systems through which the route advertisement has passed under the protocol's rules.

A conceptual advertisement might contain:

```text
prefix: 198.51.100.0/24
AS_PATH: 64496 64497 64498
```

The AS numbers shown are from the range reserved for documentation in RFC 5398.

AS_PATH supports loop detection and participates in routing policy.

But do not translate it into "physical routers the packet will cross."

An AS path is inter-domain control-plane information. Inside each AS, the actual data-plane path can include many routers.

## NEXT_HOP connects BGP to forwarding

RFC 4271 defines NEXT_HOP as a mandatory path attribute that identifies the IP address to use as a next hop toward advertised destinations under the relevant rules.

BGP information eventually contributes to a router's selected route and forwarding state.

The distinction is:

```text
control plane:
learn and select reachability information

data plane:
forward actual packets using installed forwarding state
```

A BGP session can be healthy while a forwarding problem exists elsewhere.

A forwarding path can also continue temporarily based on installed state while a routing-control event is changing.

Troubleshooting should know which plane it is observing.

## "Shortest path" is an incomplete mental model

BGP policy is not equivalent to geographic shortest path.

Networks make routing decisions based on attributes, policy, commercial relationships, local preference, engineering goals, and implementation configuration.

AS_PATH length can matter in route selection, but it is not a physical-distance meter and is not the only decision input.

A path with fewer AS numbers can be physically longer.

A route selected for policy reasons can differ from what a map suggests.

The Internet is an economic and administrative system implemented with routing protocols, not only a geometry problem.

## Forward and return paths can differ

IP routing decisions are made independently along the path.

The route from A to B does not have to be the exact reverse of the route from B to A.

This is called asymmetric routing.

Conceptually:

```text
A → B:
AS 64496 → 64497 → 64498

B → A:
AS 64498 → 64499 → 64496
```

Asymmetry can be completely normal.

It becomes important when debugging:

- stateful firewalls;
- packet captures taken at only one boundary;
- latency;
- path-specific loss;
- source-address policy.

Never infer the return path solely from the forward path.

## Routing state changes over time

Prefixes can be announced, withdrawn, or learned through different peers.

Routers then process those changes and update selected routes according to protocol state and policy.

This means Internet reachability has a temporal dimension.

A routing incident can affect some networks before others.

Different observers can select different paths to the same prefix.

"Works from my network" and "fails from another region" can both be true because the observers are not attached to the same routing state or data path.

## BGP policy needs protection

Because BGP exchanges routing information between administrative domains, incorrect advertisements can cause large effects.

RFC 7454 documents BGP operational and security practices including prefix filtering, AS-path filtering, session protection, and other controls.

RFC 8212 recommends that external BGP speakers require explicit import and export policy so routes are not accidentally propagated merely because a session exists.

The broad systems lesson is familiar:

**a protocol session is not the same thing as authorization to accept every state update it carries.**

Connectivity and policy are different contracts.

## traceroute is not a BGP decoder

A tool such as `traceroute` or `tracepath` can provide useful data-plane observations.

For example:

```bash
tracepath example.com
```

or:

```bash
traceroute example.com
```

depending on the system.

The output may reveal responding routers along one path for that probe.

It does not directly print the BGP AS_PATH that produced the forwarding state.

Some routers do not answer probes. Load balancing can change which hops are observed. ICMP handling can differ from application traffic.

Use traceroute as evidence about probe behavior, not as perfect topology truth.

## Inspect the local decision first

Before thinking globally, ask what your own machine will do:

```bash
ip route get 1.1.1.1
```

Replace the destination with an address you are intentionally testing.

This can show the selected local next hop, interface, and source-address decision on Linux.

Then move outward.

The first route lookup is local. BGP may not exist anywhere on the endpoint itself.

## Build a local BGP model safely

If you want to observe BGP mechanics directly, do not experiment with public Internet announcements.

Use an isolated virtual lab with open-source routing software such as FRRouting or BIRD.

Create three virtual routers with private or documentation prefixes and private-use AS numbers. RFC 6996 reserves AS-number ranges for private use; use those inside an isolated lab rather than announcing them to the public Internet.

Then:

1. establish BGP sessions;
2. advertise one test prefix;
3. inspect the learned AS path;
4. change import policy;
5. withdraw the prefix;
6. watch the selected route disappear or change.

This exposes the control plane without touching real Internet routing.

## Build a failure ladder

For an Internet-path problem:

```text
Does the endpoint have a local route?
        ↓
Can it reach the first-hop router?
        ↓
Does the provider have forwarding state?
        ↓
Is the destination prefix being advertised?
        ↓
Are policies accepting and propagating it?
        ↓
Does forwarding follow the selected route?
        ↓
Does the transport succeed?
        ↓
Does TLS/application behavior succeed?
```

Not every operator can observe every rung.

That is why cross-network incidents require evidence from multiple administrative domains.

## The lesson to carry forward

The Internet is not one route table.

BGP lets autonomous systems exchange reachability information under policy. Routers turn selected control-plane state into forwarding behavior.

The path can be asymmetric, dynamic, and administratively shaped.

The next lesson adds another kind of intermediary: proxies, reverse proxies, caches, and CDN edges. They can change where a connection terminates even when DNS and routing are working exactly as designed.

## Interactive companion exercise

Follow next-hop selection, longest-prefix route lookup, and hop-by-hop forwarding in the [routing timeline](../prototypes/interactive-system-design.html#protocol-title). The model separates precomputed control-plane routes from per-packet forwarding.
