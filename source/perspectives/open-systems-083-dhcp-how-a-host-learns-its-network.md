---
title: "DHCP: How a Host Learns Its Network"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-083-dhcp-how-a-host-learns-its-network.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "An IPv4 host can begin without a usable address and obtain a lease plus network parameters through DHCP. The lease, route, DNS configuration, and actual reachability remain separate pieces of evidence."
eyebrow: "Open Systems Course · Lesson 83 of 180"
---

A newly connected IPv4 host has a bootstrapping problem.

To communicate normally, it needs network configuration. But obtaining that configuration may itself require network communication.

DHCP is one solution to that problem.

It can provide an IPv4 address and other parameters without requiring someone to type them into every host manually.

The important idea is not the four-letter mnemonic.

It is how a machine with incomplete network state acquires enough state to participate in the network.

## What the host needs

A useful IPv4 configuration often includes several independent facts:

```text
interface address
subnet mask or prefix
default router
DNS resolver addresses
lease lifetime
possibly other site-specific options
```

An address alone is not a complete network configuration.

A host can have a valid local address but no default route. It can have a route but broken DNS configuration. It can have all three and still be blocked by a firewall farther along the path.

DHCP distributes configuration. It does not prove that every dependency described by that configuration is healthy.

## The DORA model

For an IPv4 client starting without a remembered usable lease, the familiar sequence is:

```text
DHCPDISCOVER
     ↓
DHCPOFFER
     ↓
DHCPREQUEST
     ↓
DHCPACK
```

This is often remembered as **DORA**.

RFC 2131 defines these DHCP messages and the client-server interaction.

The mnemonic is useful, but do not turn it into a law saying every DHCP exchange always contains exactly those four packets in exactly that situation. Renewal, reboot, rebinding, rejection, and other states use different parts of the protocol.

Treat DORA as a model for initial IPv4 allocation.

## Discovery begins with incomplete knowledge

At the start, the client may not yet have a usable IPv4 address and may not know the DHCP server's address.

That is why DHCP includes broadcast-based discovery behavior on the local network.

A DHCP relay can forward client messages to a server on another network, so the DHCP server does not have to live on every physical subnet.

This creates another useful boundary:

```text
client link
   ↓
relay, if used
   ↓
DHCP server
```

If discovery packets leave the client but no offer returns, the failure could be local link policy, relay configuration, server availability, address-pool exhaustion, or filtering. "DHCP is down" is not yet a diagnosis.

## The offer is not the final commitment

A server can answer a discovery with an offer containing an available address and configuration parameters.

The client then sends DHCPREQUEST to indicate the selected offer or to perform other request/renewal behavior defined by the protocol.

DHCPACK confirms the parameters and committed network address for the successful allocation case.

The distinction matters because seeing DHCPOFFER in a packet capture does not prove that the client completed configuration.

Evidence should follow the state transition:

```text
discover seen
offer seen
request seen
ack seen
address installed
route installed
resolver configuration installed
```

Every line proves something different.

## DHCP options carry much of the useful configuration

DHCP is extensible through options.

RFC 2132 defines many IPv4 DHCP options, including a router option and a Domain Name Server option.

A client can therefore learn, for example:

```text
address:        192.0.2.100
mask:           255.255.255.0
router:         192.0.2.1
DNS resolver:   192.0.2.53
lease:          finite lifetime
```

These are documentation addresses.

The server is describing configuration to the client. The client and operating system still need to install and use that configuration correctly.

## A lease is time-bounded state

DHCP address assignment is normally leased rather than treated as permanent ownership.

The client has state associated with:

- the assigned address;
- the server;
- the lease lifetime;
- renewal and rebinding behavior.

Before the lease expires, the client can attempt to renew it. If the original server cannot be reached, later rebinding behavior can allow broader attempts to maintain valid configuration as defined by the protocol.

That is why a machine can continue working for some time after a DHCP server becomes unavailable.

Existing clients may still have valid leases while new clients fail immediately.

Operationally:

```text
DHCP server unreachable
≠
all configured clients instantly lose networking
```

Time is part of the system.

## DHCP does not own every network fact

A successful DHCP exchange can provide a default-router address.

It does not prove the router forwards traffic.

It can provide a DNS resolver address.

It does not prove the resolver answers correctly.

It can provide an IP address.

It does not prove the address is free from every implementation or configuration mistake beyond the mechanisms in use.

Configuration and service health are different layers.

## IPv6 bootstrapping is not just DHCPv4 with larger addresses

Do not copy the IPv4 DORA model onto IPv6.

IPv6 hosts create link-local addressing and use Neighbor Discovery and Router Advertisements as part of basic operation. Stateless Address Autoconfiguration, or SLAAC, can allow a host to form addresses from information advertised by routers.

DHCPv6 is a separate protocol defined by RFC 8415. It can provide configuration parameters and can perform stateful address or prefix assignment. It can operate alongside or instead of parts of stateless configuration depending on the network design.

So the correct high-level statement is:

**DHCP is one family of configuration mechanisms, not a universal prerequisite for IP networking.**

## Inspect the resulting state first

On a Linux system you own or administer, inspect what the machine actually installed:

```bash
ip address
ip route
resolvectl status
```

If NetworkManager is in use, this can also help:

```bash
nmcli device show
```

Look for the relationship among:

- interface;
- assigned address and prefix;
- default route;
- DNS resolver;
- lease-related information exposed by your network manager.

Do not start by restarting networking. First preserve the state that explains what the machine believes.

## Observe DHCP safely

On your own lab network, a packet analyzer can make the bootstrap sequence visible.

For example, on an interface you are authorized to capture:

```bash
sudo tcpdump -ni <interface> 'udp port 67 or udp port 68'
```

Then reconnect a test client or renew a lease using the supported controls for that machine.

Identify:

```text
DISCOVER
OFFER
REQUEST
ACK
```

If the sequence differs, explain why rather than forcing the evidence into the mnemonic.

Do not disrupt a shared production network merely to produce a capture.

## Build a failure ladder

When a client says "connected but no Internet," separate configuration from reachability:

```text
Does the link exist?
      ↓
Did DHCP complete?
      ↓
Is an address installed?
      ↓
Is the expected route installed?
      ↓
Can the default router be reached?
      ↓
Is a DNS resolver configured?
      ↓
Can that resolver be reached?
      ↓
Can remote IP paths be reached?
```

This prevents a DNS failure from being misdiagnosed as DHCP, or a missing route from being blamed on "Wi-Fi."

## The lesson to carry forward

DHCP turns network configuration into leased distributed state.

A server can offer parameters. A client can accept them. The operating system can install them. Routers and DNS services can then succeed or fail independently.

The next lesson follows another stateful boundary commonly encountered after a host is configured: address and port translation at a NAT.

## Interactive companion exercise

Use the [DHCP timeline](../prototypes/interactive-system-design.html#protocol-title) to follow the DORA exchange: Discover, Offer, Request, and Acknowledge.
