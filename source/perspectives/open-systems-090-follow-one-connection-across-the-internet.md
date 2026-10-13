---
title: "Follow One Connection Across the Internet"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-090-follow-one-connection-across-the-internet.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "One connection ties together DHCP, DNS, local routing, neighbor discovery, NAT, Internet routing, TCP, TLS, and edge infrastructure. Following it end to end turns the Internet from one cloud into inspectable state transitions."
eyebrow: "Open Systems Course · Lesson 90 of 180"
---

We have spent twenty lessons taking networks apart.

Now put the path back together.

Consider a constructed example:

A laptop on a small IPv4 LAN opens:

```text
https://service.example/
```

The public service is fronted by an edge reverse proxy. The laptop's network uses DHCP and IPv4 NAT.

No single real provider is being described. The addresses below use documentation ranges. The purpose is to connect mechanisms.

## 0. State exists before the click

Before the user opens the service, the laptop may already have:

```text
address:       192.168.1.20/24
default route: 192.168.1.1
DNS resolver:  192.168.1.53
```

That state might have come from DHCP.

The resolver can already contain cached answers.

The router can already contain NAT/connection-tracking state for other flows.

The operating system has routing and neighbor caches.

The browser can have connection pools and application caches.

"Start the request" does not mean "start from an empty system."

## 1. The application begins with a name

The URL contains:

```text
service.example
```

not an IP route.

The application asks the host's resolver path for address information.

Conceptually:

```text
browser
  ↓
system resolver / stub
  ↓
configured recursive resolver
```

If the answer is cached, the resolver may reply without walking the DNS hierarchy.

Assume the result is:

```text
198.51.100.80
```

DNS has now produced address data.

It has not opened a connection.

## 2. The host selects a route

The kernel performs a route lookup for the destination.

Because `198.51.100.80` is not on the local subnet, the default route selects:

```text
next hop: 192.168.1.1
```

The IP destination remains the remote edge address.

The local link destination is the gateway.

This is the distinction from lesson 80:

```text
destination IP  = remote endpoint
destination MAC = local next hop
```

on the first Ethernet link.

## 3. The host resolves the next-hop link address

If the ARP/neighbor cache lacks the gateway's MAC address, the host can use ARP on this IPv4 LAN.

After resolution, the first frame can be modeled as:

```text
Ethernet destination = gateway MAC
IPv4 destination     = 198.51.100.80
TCP destination      = 443
```

Different layers identify different things.

The switch forwards the frame locally.

The gateway receives it because the Ethernet destination is local to that link.

## 4. NAT creates another representation of the flow

Assume the laptop opens TCP from:

```text
192.168.1.20:51000
        →
198.51.100.80:443
```

The router translates the source to:

```text
203.0.113.25:62044
        →
198.51.100.80:443
```

and remembers the mapping.

The private tuple and public tuple now represent one logical outbound connection on different sides of the translator.

The remote edge will not see `192.168.1.20` as the Internet source of this TCP flow.

## 5. Routers forward toward the advertised prefix

The packet enters the provider network.

Routers forward according to installed forwarding state.

Across administrative domains, BGP advertisements and policy contribute to how reachability to the destination prefix is learned and selected.

The packet does not carry a list saying:

```text
visit AS A, then AS B, then AS C
```

Each router makes a forwarding decision based on local state.

At each routed hop, the IPv4 TTL is decremented according to IP forwarding rules. Link-layer framing changes as the packet moves onto new links.

The destination IP can remain `198.51.100.80` while Ethernet or other link-layer headers are replaced hop by hop.

NAT is the deliberate exception in this constructed path that changes the IP/port representation.

## 6. TCP establishes transport state

The client sends a SYN.

The edge replies with SYN-ACK.

The client sends ACK.

Conceptually:

```text
client                    edge

SYN      ------------------->
         <------------------- SYN-ACK
ACK      ------------------->
```

TCP state now exists at both endpoints.

That proves a transport connection was established.

It does not yet prove the TLS service identity.

## 7. TLS establishes protected application transport

The client sends a TLS ClientHello for the service.

The TLS 1.3 handshake negotiates parameters and establishes shared keying material.

In a certificate-based public service, the edge presents authentication evidence.

The client checks:

```text
certificate path
      +
local trust anchors
      +
service identity for service.example
```

If those checks and the handshake succeed, the connection gains TLS traffic keys and protected application data can flow.

The TLS endpoint in this example is the edge.

The browser has not authenticated the private origin directly.

## 8. The edge becomes a new client toward the origin

The edge receives the protected client connection, processes the application request, and decides how to satisfy it.

It might serve cached content.

If it needs the origin, it creates or reuses another connection:

```text
client
  ↓ connection A
edge
  ↓ connection B
origin
```

Connection B has its own:

- DNS or service-discovery state;
- route;
- source and destination addresses;
- transport state;
- TLS state if TLS is used;
- timeouts.

An origin failure can therefore occur after the user's client connection is already completely healthy through TLS.

## 9. The application protocol finally gets its turn

After transport and TLS are available, application messages can be exchanged.

For HTTPS, that means HTTP semantics above the TLS channel.

We stop at that boundary in this module.

Lesson 91 begins the Web Systems module and asks what HTTP actually is, how requests and responses are represented, and what browsers and servers do with them.

The important point here is ordering:

```text
a successful application request depends on
many lower-layer contracts,
but is not equivalent to any one of them
```

## 10. The reply follows state back

The response travels through the established connections.

For the client-facing leg:

```text
edge
  ↓ TCP/TLS records
Internet routing
  ↓
public NAT address and mapped port
  ↓ translation
192.168.1.20:51000
  ↓
client socket
  ↓
application
```

The NAT recognizes the returning tuple and mapping state.

Routers forward toward the client's public address according to their own routing state.

The local router rewrites the packet back toward the internal endpoint.

The final Ethernet frame on the LAN is addressed to the laptop's local MAC address.

One response crosses several address spaces and state machines.

## Which fields change?

A useful summary:

**Link-layer addresses**

Change from link to link. They identify local next-hop delivery, not global Internet endpoints.

**IP addresses**

Usually identify the routed endpoints across ordinary routers. They can be changed by NAT in this example.

**TTL / Hop Limit**

Changes as routing hops forward the packet.

**TCP ports**

Identify transport endpoints. NAT can rewrite them.

**TCP sequence and acknowledgement state**

Evolves throughout the connection according to the byte-stream state.

**TLS ciphertext**

Carries protected application data after key establishment. Routers forward it without understanding the plaintext application semantics.

**Application data**

Is interpreted at application endpoints and participating intermediaries that terminate the application/TLS layer.

Keeping these scopes separate prevents many debugging mistakes.

## Observe one connection on your own system

Choose a service you operate or a public service you are permitted to access normally.

Before the request:

```bash
resolvectl status
ip address
ip route
```

Resolve:

```bash
dig example.com A
dig example.com AAAA
```

Inspect route selection:

```bash
ip route get <resolved-address>
```

Observe transport and TLS:

```bash
curl -v https://example.com/
```

While connecting, inspect local sockets:

```bash
ss -tnp
```

On your own host or lab network, a packet capture can connect the model to frames and packets:

```bash
sudo tcpdump -ni <interface> host <resolved-address>
```

Do not capture traffic you are not authorized to inspect.

## Build an evidence notebook

For one request, record:

```text
time
hostname
DNS answer + TTL
selected destination address
local source address
next hop
TCP source/destination ports
TCP outcome
TLS version
certificate service identity
application response status
known proxy/CDN boundary
```

If you control the gateway, add the NAT mapping.

If you control the edge, add the origin connection.

If you control the origin, add server-side socket and application logs.

The same request becomes visible from multiple boundaries.

## Break one layer at a time

In an isolated environment you control:

1. use a nonexistent DNS name;
2. restore DNS but remove the route;
3. restore the route but stop the TCP listener;
4. restore the listener but present a mismatched test certificate;
5. restore TLS but stop the reverse proxy's origin;
6. restore the origin and return a deliberate application error.

Record the client symptom at each stage.

The visible phrase "site does not work" remains similar.

The evidence changes completely.

## The module to carry forward

Networking is not a cloud between two programs.

It is a stack of stateful systems:

```text
configuration
naming
local-link delivery
routing
translation
inter-domain reachability
transport
cryptographic identity and protection
intermediaries
application semantics
```

A systems engineer learns to move through those layers without confusing one contract for another.

That is the real purpose of packet tracing, DNS tools, route inspection, socket state, TLS diagnostics, and proxy logs.

The tools are not the skill.

The skill is knowing **what each observation proves**.

Module 10 begins above this path with Web Systems: HTTP, browsers, APIs, servers, sessions, and backends.
