---
title: "IoT Connectivity: Wi-Fi, DHCP, DNS, TLS, and Reconnect"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-123-iot-connectivity-wifi-dhcp-dns-tls-and-reconnect.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "For an IoT device, 'connected to Wi-Fi' is only one layer. Production connectivity spans association, addressing, DNS, routing, TLS, service authentication, keepalives, and reconnect policy."
eyebrow: "Open Systems Course · Lesson 123 of 180"
---

An IoT device prints:

Wi-Fi connected.

That message is useful and dangerously incomplete.

The application may still be unable to resolve its service, reach the Internet, complete TLS, authenticate, or recover from a roaming or router event.

Production connectivity is a stack of states.

## Association is only the local link

For Wi-Fi, the device first discovers and associates with an access point and completes the relevant security exchange.

At this point it may have link-layer connectivity to the AP.

It may not yet have an IPv4 address, IPv6 configuration, DNS resolver, default route, or working path beyond the LAN.

Separate:

Wi-Fi link state;
IP configuration state;
Internet/service reachability state.

## DHCP gives configuration, not Internet truth

In a typical IPv4 network, DHCP can provide:

- IP address;
- subnet information;
- default gateway;
- DNS servers;
- lease time.

A successful DHCP lease proves that local configuration was obtained.

It does not prove that the gateway has Internet access or that a particular service is reachable.

The same distinction from Module 9 applies inside embedded firmware.

## DNS should not be hard-coded away

It can be tempting to embed one server IP address to avoid DNS failures.

That creates a new failure mode: service endpoints, CDN addresses, failover targets, and provider infrastructure can change.

Using DNS lets the service control address mapping.

Firmware should instead have:

- resolver timeout;
- retry/backoff;
- cache behavior compatible with TTLs;
- useful diagnostics.

Do not confuse DNS failure with TLS failure or TCP timeout.

## TLS is usually the service trust boundary

For Internet-connected devices, TLS protects confidentiality and integrity and authenticates the server according to certificate validation.

A device needs a trustworthy clock strategy because certificate validity is time-dependent.

Some embedded systems boot without accurate wall-clock time. They must obtain or establish time securely enough before strict certificate validation can succeed, or use a design that does not weaken verification permanently.

“Disable certificate checks until NTP works” can create a bootstrapping security hole.

## Time synchronization is infrastructure

Network time can come from NTP or another managed time source.

Time matters for:

- certificate validation;
- telemetry timestamps;
- log correlation;
- token expiry;
- scheduled operations.

RFC 5905 defines NTPv4.

For low-cost devices, oscillator drift can be significant, so resynchronization policy matters.

## Reconnect needs backoff

When a router or cloud service is down, every device should not retry at maximum speed.

A fleet of 100,000 devices reconnecting once per second can become its own denial-of-service event.

A better strategy uses:

- exponential backoff;
- random jitter;
- maximum delay;
- state reset after sustained success.

Jitter prevents devices from synchronizing on the same retry boundary.

## Connectivity should be event-driven

Firmware often receives events such as:

link up;
link down;
address acquired;
address lost;
DNS result;
TLS connected;
application authenticated.

Treat these as state transitions.

Avoid one Boolean called online.

A device can be:

Wi-Fi associated but no IP;
IP configured but DNS failing;
TCP connected but TLS rejected;
TLS established but MQTT unauthorized.

A richer state model makes both user interfaces and logs truthful.

## Keepalives detect different failures

TCP keepalive, MQTT keepalive, application heartbeat, and periodic telemetry are not the same mechanism.

They detect different conditions at different layers.

For example, MQTT keepalive checks liveness between MQTT peers at the application protocol level.

An application heartbeat can additionally prove that business processing is alive.

Choose the layer you actually need to monitor.

## Offline is normal, not exceptional

Phones move.

Routers reboot.

Access points change channel.

ISPs fail.

Power is interrupted.

An IoT product that treats every disconnect as an exceptional crash will be unreliable.

Connectivity should be a recoverable state machine.

Local control should continue when cloud access is temporarily unavailable if the product permits it.

## Practical experiment

On a development device you control, instrument timestamps for:

Wi-Fi association;
IP acquisition;
DNS resolution;
TLS connection;
application connection.

Then reboot the router or disable the access point briefly.

Observe the order of disconnect and reconnect events.

Add exponential backoff with jitter and log only state changes rather than one message per retry loop.

The goal is to see connectivity as layered state.

## The lesson to carry forward

A device is not online merely because its radio joined an AP.

The next lesson adds a common application protocol above that connection: MQTT and publish/subscribe communication.
