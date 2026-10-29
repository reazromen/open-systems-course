---
title: "Follow One Packet Across a LAN"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-080-follow-one-packet-across-lan.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "One local TCP connection ties together application sockets, route lookup, ARP or Neighbor Discovery, link frames, switching, checksums, interrupts, kernel buffers, and the receiving process."
eyebrow: "Open Systems Course · Lesson 80 of 180"
---

Host A:

    192.168.1.10/24

Host B:

    192.168.1.20/24

Application A connects to TCP port 8080 on B.

Both hosts are on the same Ethernet LAN.

Follow the first packet.

## 1. Application requests a connection

Program A creates a TCP socket and asks the kernel to connect to:

    192.168.1.20:8080

The kernel creates transport state.

The application does not need to build Ethernet frames itself.

## 2. Route lookup says the destination is local

Host A has:

    192.168.1.10/24

Host B shares the same /24 prefix.

The routing table says the destination is directly reachable through the local interface.

The next hop is B itself rather than a gateway.

## 3. A needs B's link-layer address

If no neighbor entry exists, A sends an ARP request asking which local interface owns 192.168.1.20.

B replies with its MAC address.

A caches that mapping.

Now the network-layer destination has a link-layer next-hop address.

## 4. TCP creates a SYN

TCP prepares a segment containing source and destination ports, sequence state, SYN flag, checksum information, and options.

The segment becomes IP payload.

TCP is establishing transport state before application bytes are exchanged.

## 5. IP creates the packet

IPv4 adds fields such as source address, destination address, protocol number, TTL, and length.

Destination:

    192.168.1.20

Because B is on-link, the packet is passed toward the local link directly.

## 6. The link layer creates a frame

Conceptually:

    destination MAC = B
    source MAC      = A
    payload         = IP packet

The NIC sends the encoded frame over the physical medium.

The exact electrical or optical signaling depends on the link technology.

## 7. The switch forwards the frame

A Layer-2 switch examines the destination MAC and its forwarding state.

If it knows B's location, it forwards to the corresponding port.

If the destination is unknown, it may flood within the relevant VLAN according to Ethernet switching behaviour.

The switch is making a link-layer forwarding decision.

It is not performing an IP route lookup for ordinary switched traffic.

## 8. B receives the frame

B's network interface receives the frame.

Hardware, DMA, driver, interrupt/polling mechanisms, and kernel queues move the data into the network stack.

The link-layer header is processed.

The IP packet moves upward.

## 9. B's IP stack accepts the destination

The destination address belongs to B.

The IP protocol field identifies TCP.

The TCP segment moves into B's TCP implementation.

TCP finds whether a listening socket exists for destination port 8080.

## 10. The server participates

If a server is listening, B responds with SYN-ACK.

A replies ACK.

The TCP connection becomes established according to the TCP state machines at both endpoints.

The application can later accept the connection and exchange bytes.

If nothing is listening, B may send a TCP reset instead.

Same IP reachability.

Different transport endpoint state.

## What changes when the server is remote?

Suppose B is outside A's subnet.

Route lookup chooses a gateway.

ARP resolves the gateway MAC, not the remote server's MAC.

The first Ethernet frame looks conceptually like:

    destination MAC = local router
    destination IP  = remote server

The router removes the local link frame, chooses another next hop, and creates a new outgoing frame.

IP destination can remain the remote endpoint while MAC addresses change at every Ethernet hop.

That distinction is foundational.

## Observe the path safely

On a lab network or machine you are authorized to inspect, run a local server and capture your own traffic.

For example, a simple HTTP server can listen on a test port while a packet analyzer records ARP and TCP events.

The goal is to identify:

- neighbor resolution;
- SYN;
- SYN-ACK;
- ACK;
- application request;
- application response;
- connection close.

Do not capture traffic on networks you do not own or administer.

## Build an evidence ladder

If the connection fails:

No ARP reply?

Investigate local-link reachability.

ARP works, SYN leaves, no response?

Investigate host/path/firewall state.

SYN-ACK returns, handshake completes, then HTTP fails?

Transport works; move upward.

Server sends HTTP 500?

Network delivery succeeded far enough for application code to respond.

Each observation narrows the system.

## The lesson to carry forward

A local connection crosses:

    application
      -> socket
      -> TCP
      -> route lookup
      -> ARP
      -> IP
      -> link frame
      -> switch
      -> NIC
      -> kernel
      -> listening application

One packet is enough to connect the concepts from the entire networking module.

Module 9 now extends the path beyond the LAN into DNS, DHCP, NAT, TLS, Internet routing, CDNs, and proxies.

## Interactive companion exercise

Follow one payload end to end in the [network path explorer](../prototypes/interactive-system-design.html#network-title), comparing a same-subnet path with a routed path.
