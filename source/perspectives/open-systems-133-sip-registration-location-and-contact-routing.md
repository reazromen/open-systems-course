---
title: "SIP Registration, Location, and Contact Routing"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-133-sip-registration-location-and-contact-routing.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "SIP registration maps a stable address-of-record to one or more temporary contacts. Registrars, location services, expiry, NAT, and outbound flows determine where an INVITE can actually be delivered."
eyebrow: "Open Systems Course · Lesson 133 of 180"
---

Extension 3005 is not an IP address.

It is an identity inside a telephony namespace.

To receive calls, the system needs a current route from that identity to a reachable endpoint.

SIP registration creates that dynamic mapping.

## Address-of-record and Contact are different

A user might be known as:

sip:3005@example.com.

That is an address-of-record.

The endpoint can register a Contact representing where it can currently receive SIP traffic.

The registrar stores the binding with an expiry.

Conceptually:

AOR → Contact + expiry + path information.

The stable identity stays the same while the endpoint moves between Wi-Fi networks, cellular networks, or addresses.

## REGISTER updates location state

A SIP user agent sends REGISTER to a registrar.

The registrar authenticates the request according to policy and updates the binding.

A successful 200 OK confirms the registration operation.

It does not prove that inbound calls will reach the endpoint through every NAT/firewall path.

Registration is control-plane state.

Reachability is an additional property.

## Expiry keeps stale bindings from living forever

Bindings have lifetimes.

The endpoint refreshes before expiry.

If the device disappears and stops refreshing, the binding eventually expires.

Too-long expiry leaves stale routing state.

Too-short expiry increases signaling load and battery/network usage.

Mobile endpoints often need additional mechanisms to keep NAT mappings and transport flows usable.

## Multiple Contacts enable forking

One AOR can have multiple registered Contacts.

A user can have:

desk phone;
mobile softphone;
web client.

A proxy can fork an INVITE toward several contacts.

Then several early dialogs can exist before one branch answers.

Forking is why call state can be more complex than one INVITE and one destination.

## NAT changes the apparent Contact problem

An endpoint behind NAT may place a private address in Contact or SDP.

That address can be unusable from the public network.

SIP deployments therefore use mechanisms such as received/rport behavior, persistent outbound connections, SBC rewriting, or topology-aware routing.

RFC 5626 defines SIP Outbound for maintaining flows from user agents through edge proxies.

## Transport lifetime matters

A SIP client using TCP or TLS can maintain a long-lived outbound connection.

The server can route inbound requests back over that established flow.

This is valuable behind NAT where unsolicited inbound connections cannot reach the device directly.

Registration state and flow state are therefore connected.

## Registrar and proxy can be separate

One component can accept REGISTER and update a location database.

Another proxy can receive INVITE, query that database, and route toward current contacts.

A PBX product can combine both roles in one process.

Architecture should still distinguish the functions.

## Practical inspection

On a PBX you administer, register one endpoint.

Inspect:

AOR;
Contact URI;
source IP/port;
transport;
expiry;
user-agent;
path/outbound flow if available.

Disconnect the endpoint without unregistering and watch how long the binding remains.

Then reconnect from a different network and observe how the binding changes.

## The lesson to carry forward

Registration turns stable SIP identity into temporary reachability state.

The next lesson follows an outbound INVITE and shows how SDP offer/answer negotiates the media session.
