---
title: "NAT: Rewriting Addresses and Remembering Flows"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-084-nat-rewriting-addresses-remembering-flows.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "IPv4 NAT often rewrites addresses and ports while maintaining mapping state. That state explains why outbound connections can work while unsolicited inbound connections fail."
eyebrow: "Open Systems Course · Lesson 84 of 180"
---

A laptop on a private IPv4 network can open a connection to a public service even though its private address is not globally routed.

Somewhere between the laptop and the public Internet, a translator may rewrite the packet.

That mechanism is commonly called NAT.

For everyday home and enterprise IPv4 networks, the form learners encounter most often is address-and-port translation, where many internal connections share one external address by using different transport-port mappings.

The key mental model is not simply "private IP becomes public IP."

It is:

**the translator rewrites packet fields and maintains state that connects the inside representation of a flow to the outside representation.**

## Follow one constructed flow

Assume an internal host starts a TCP connection.

Inside:

```text
source      192.168.1.20:50000
destination 198.51.100.40:443
```

At the NAT, the outbound packet might become:

```text
source      203.0.113.10:62001
destination 198.51.100.40:443
```

These are documentation addresses.

The translator records a mapping conceptually similar to:

```text
192.168.1.20:50000
        ↔
203.0.113.10:62001
```

When the reply returns to `203.0.113.10:62001`, the device can use its translation state to rewrite the destination back toward the internal host.

Traditional NAT and Network Address Port Translation are described in RFC 3022, while RFC 2663 provides broader NAT terminology.

## Translation is stateful in the common case

The mapping cannot normally live forever.

A NAT has finite state and behavior for creating, refreshing, and removing mappings. Details differ by transport and implementation.

For UDP, RFC 4787 defines behavioral terminology and requirements for NAT mappings and filtering. RFC 5382 addresses TCP NAT behavior.

The systems consequence is important:

```text
packet sent earlier
        ↓
mapping exists now
        ↓
return traffic can match state
```

If the state expires, the same inbound packet later may no longer have a mapping that tells the translator where to send it.

Time is part of NAT behavior.

## Outbound success does not imply inbound reachability

When an internal client initiates a connection, the NAT has an event from which it can create mapping state.

An unsolicited inbound connection has a different problem.

Suppose a public host sends:

```text
203.0.113.10:9000
```

Which internal machine should receive it?

Without an existing mapping, static mapping, port-forwarding rule, or another traversal/control mechanism, the translator may have no answer.

This is why:

```text
internal host can browse outward
```

does not prove:

```text
the same host can accept arbitrary inbound connections
```

The direction in which state was created matters.

## NAT and firewall are not synonyms

Consumer routers often perform NAT and stateful firewalling in the same device.

That packaging encourages a conceptual mistake.

Network address translation changes addressing representation. Firewall policy decides which traffic is permitted or denied.

The two functions can interact, and one device can implement both, but they are not the same mechanism.

A security policy should therefore not be described merely as "we have NAT."

If inbound traffic is blocked, identify the actual control:

- absence of translation state;
- NAT filtering behavior;
- explicit firewall policy;
- host firewall;
- application listener state;
- upstream filtering.

Different causes can produce the same symptom.

## NAT changes what endpoints can infer

Before translation, an internal host sees its local address and port.

A remote server sees the translated external source.

Those are two views of one communication path.

That becomes important for protocols that place addresses or ports inside application messages. Rewriting only the IP and transport headers may be insufficient when a protocol advertises endpoint information in its payload.

This is one reason real-time communication systems need explicit NAT-traversal mechanisms and why application-layer gateways historically appeared around some protocols.

We will return to this problem in the telephony and real-time-media module. For now, remember the general rule:

**a middlebox that changes addressing can break assumptions made above the network layer.**

## Carrier-grade NAT adds another administrative boundary

Your local router might not be the only translator.

An ISP can place many subscribers behind a Carrier-Grade NAT, or CGN. RFC 6888 describes common requirements for IPv4 CGNs and defines the CGN as a NAT function in the provider network that shares IPv4 address space among subscribers.

A path can therefore look like:

```text
device
  ↓
home NAT
  ↓
ISP CGN
  ↓
public Internet
```

Port forwarding on the home router cannot create a mapping on an ISP-controlled CGN.

That is an ownership boundary as much as a protocol boundary.

When diagnosing inbound reachability, ask who controls every translator on the path.

## A public-IP website is only one observation

If a browser reports a public address, it tells you the source address observed by that remote service for that request.

It does not reveal the entire translation chain.

The value can also differ across IPv4 and IPv6 or across different egress paths.

Useful evidence combines several views:

```text
host address
local route
gateway address
translator state, if you control it
remote observed source
```

Do not infer topology from one value when the path can contain multiple boundaries.

## Inspect a Linux NAT you control

On a Linux router or namespace lab that you own, start with configuration.

Depending on the firewall stack, commands can include:

```bash
sudo nft list ruleset
ip address
ip route
```

If conntrack tooling is installed and authorized:

```bash
sudo conntrack -L
```

The exact output is implementation-specific. Your goal is to find evidence connecting an inside flow to translation or connection-tracking state.

On an endpoint, compare:

```bash
ip address
ip route
```

with the source address observed by a remote test service you intentionally contact.

Do not scan or manipulate networks you do not administer.

## Build a safe namespace experiment

A stronger exercise is to create a small Linux network-namespace lab.

Use:

- one namespace as an inside client;
- one namespace as a translator/router;
- one namespace as an outside service;
- private or documentation-style addressing inside the isolated lab;
- an `nftables` masquerade/SNAT rule on the translator.

Then capture on both sides of the translator.

The same logical connection will have different packet headers on the two interfaces.

That is the mechanism made visible.

Next, wait for state to expire or deliberately remove the lab's state, then observe why an inbound packet no longer maps in the same way.

## Build a failure ladder

For a connection crossing NAT:

```text
Did the internal packet reach the translator?
        ↓
Was a mapping created?
        ↓
What external tuple was used?
        ↓
Did the remote reply reach the translator?
        ↓
Did it match translation/filtering state?
        ↓
Was it rewritten toward the internal host?
        ↓
Did host firewall and application state accept it?
```

That sequence is much more precise than "NAT problem."

## The lesson to carry forward

NAT creates two representations of a communication flow and maintains state that connects them.

That state has ownership, lifetime, transport-specific behavior, and failure modes.

Once the path is translated correctly, another question remains: if a client reaches a remote service, how can it protect the conversation and authenticate the service it intended to contact?

That is the next boundary: TLS.
