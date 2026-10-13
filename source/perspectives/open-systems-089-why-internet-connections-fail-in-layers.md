---
title: "Why Internet Connections Fail in Layers"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-089-why-internet-connections-fail-in-layers.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A failed Internet request can stop at name resolution, local routing, packet forwarding, transport, TLS, an intermediary, or the application. Diagnose the first contract that becomes false."
eyebrow: "Open Systems Course · Lesson 89 of 180"
---

"The Internet is not working" is a user-visible symptom.

It is not a failure domain.

An Internet request crosses several contracts:

```text
local link
  ↓
host configuration
  ↓
DNS
  ↓
route and packet forwarding
  ↓
transport
  ↓
TLS, if used
  ↓
proxy / edge, if present
  ↓
application protocol
  ↓
backend dependencies
```

A disciplined diagnosis finds the earliest contract that stops being true.

That is more powerful than collecting many commands without a model.

## Start with the exact target

Before testing anything, record:

```text
name:
protocol:
port:
client:
time:
network:
expected result:
actual result:
```

"Google works but my API does not" is different from "no host can reach any address."

Likewise:

```text
https://api.example.com:443
```

is a more useful target than:

```text
Internet
```

The more precise the target, the smaller the search space.

## Layer 1: does the host have local network state?

Inspect:

```bash
ip address
ip route
```

Ask:

- Is the expected interface up?
- Does it have the expected address?
- Is there a usable route for the destination?
- Which source address and next hop will Linux choose?

For a specific destination:

```bash
ip route get 198.51.100.40
```

Use an address you intentionally want to test.

If there is no route, DNS and TLS are not the first problem.

## Layer 2: can the name be resolved?

Test the application's hostname:

```bash
getent ahosts example.com
dig example.com A
dig example.com AAAA
```

These commands answer different questions.

`getent` uses the host's normal name-service path and can reflect system resolver policy.

`dig` speaks DNS more directly and is useful for inspecting DNS records and response details.

A DNS answer proves name resolution.

It does not prove that the returned address is reachable.

## Layer 3: what does packet forwarding do?

If an address exists, examine the local route first.

Then a path-observation tool can provide additional evidence:

```bash
tracepath example.com
```

or `traceroute` where available.

Do not require every router to answer.

Routers can forward application traffic while ignoring or rate-limiting probe traffic.

A missing traceroute hop therefore does not automatically mean the data path is broken.

Likewise, a successful ICMP echo is not proof that TCP port 443 is permitted.

Protocol-specific evidence is stronger.

## Layer 4: what happened at transport?

For TCP, distinguish several outcomes.

A connection can:

- establish;
- receive a reset/refusal;
- time out;
- fail locally before a SYN leaves;
- be rejected by policy.

A refused TCP connection often tells you that the target host or an intermediary actively rejected the attempt. A timeout is less specific: packets or replies may be dropped, routed incorrectly, filtered, or lost.

RFC 9293 defines current TCP behavior.

Use application-aware tools where possible.

For a simple authorized port test:

```bash
nc -vz example.com 443
```

For more detail, packet capture on your own system can reveal whether SYN, SYN-ACK, ACK, or RST packets appear.

Do not interpret "port open" as "application healthy."

It only moves the evidence ladder upward.

## Layer 5: did TLS succeed?

For a TLS service:

```bash
openssl s_client \
  -connect example.com:443 \
  -servername example.com
```

A failure here might involve:

- unsupported protocol parameters;
- certificate-path validation;
- service-name mismatch;
- expired certificate;
- TLS alert;
- middlebox interference.

RFC 8446 defines TLS 1.3.

Preserve the exact TLS error.

Do not bypass certificate verification and then report the incident solved.

Removing a security check changes the contract.

## Layer 6: is there an intermediary?

If the public endpoint is a reverse proxy or CDN edge, client-side success may end at that intermediary.

A client can complete:

```text
DNS
TCP
TLS
```

and then receive:

```text
HTTP 502
```

The edge was reachable.

The problem may be on the edge-to-origin path or in upstream selection.

Conversely, a cached response can succeed while the origin is unhealthy.

The architecture determines what a response proves.

RFC 9110 defines HTTP intermediary roles.

## Layer 7: did the application succeed?

A valid application response can still represent failure.

For HTTP:

```text
200
404
429
500
503
```

are application-layer outcomes with different meanings.

A TCP handshake does not tell you which one will arrive.

A TLS handshake does not tell you whether authorization will pass.

An HTTP 200 does not necessarily tell you whether the returned business data is correct.

The evidence ladder continues upward into application semantics.

Module 10 will study those contracts directly.

## Timeouts are symptoms, not causes

"Timeout" is one of the most dangerous diagnostic words because it describes elapsed time without explaining why progress stopped.

A timeout can be generated by:

- a DNS resolver;
- a TCP connect operation;
- a TLS handshake;
- a reverse proxy waiting for an origin;
- an application waiting for a database;
- a client-side overall deadline.

Always attach the timeout to the component and operation:

```text
DNS query timed out after ...
TCP connect timed out after ...
proxy upstream read timed out after ...
application request deadline exceeded ...
```

The clock belongs to a state machine.

Find which state was waiting.

## Compare a healthy and failing path

One of the strongest debugging techniques is differential observation.

If:

```text
client A works
client B fails
```

compare:

- DNS answer;
- source address;
- route;
- network;
- proxy settings;
- TLS trust store;
- request parameters;
- time.

If:

```text
service A works
service B fails
```

from the same client, compare the destination-specific path.

Do not change five variables at once.

A controlled difference is evidence.

## Use curl as a cross-layer timeline

For HTTPS, `curl` can expose several layers in one command:

```bash
curl -v --connect-timeout 5 https://example.com/
```

Depending on platform and build, verbose output can show:

- name resolution;
- selected address;
- connection attempt;
- TLS progress;
- certificate information;
- application request and response.

The output is not a substitute for packet capture or server logs.

It is a useful timeline.

If a public service is slow, avoid generating high request volume merely to test it.

## Observe sockets locally

On Linux:

```bash
ss -tnp
```

can reveal local TCP socket state when permissions allow.

Look for states such as:

```text
SYN-SENT
ESTAB
TIME-WAIT
```

The presence of `SYN-SENT` during a stalled connection tells a different story from an established socket waiting on an application response.

State names convert "hanging" into a narrower claim.

## Preserve evidence before restarting

Restarting NetworkManager, flushing DNS caches, rebooting the host, or restarting a proxy can make a symptom disappear.

That can restore service.

It can also destroy the state that would have explained the failure.

Before a disruptive action, capture:

```text
timestamp
resolver state
route state
socket state
relevant logs
packet evidence if justified
service configuration/version
```

Recovery and diagnosis are different goals.

Sometimes recovery must come first. Say so explicitly.

## A compact failure matrix

Use the earliest failing observation:

```text
no address
  → host configuration / DHCP / link

name does not resolve
  → resolver / DNS path

address resolves, no route
  → local routing

SYN leaves, no useful reply
  → path / filtering / remote reachability

TCP connects, TLS fails
  → TLS / identity / cryptographic policy

TLS succeeds, edge returns upstream error
  → intermediary / origin path

application response is wrong
  → application semantics or dependency state
```

This is not an exhaustive decision tree.

It is a way to prevent unrelated layers from being blamed too early.

## The lesson to carry forward

Internet failures become manageable when every success is treated as limited evidence.

DNS proves a naming result.

Routing proves a forwarding decision.

TCP proves transport state.

TLS proves a protected/authenticated channel under specific validation rules.

A proxy proves its own boundary.

The application proves only what its response semantics actually mean.

The final lesson of this module follows one constructed connection end to end and annotates exactly which fields and state change at each boundary.
