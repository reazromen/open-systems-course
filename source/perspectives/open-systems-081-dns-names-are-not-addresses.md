---
title: "DNS: Names Are Not Addresses"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-081-dns-names-are-not-addresses.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "DNS maps names to structured data such as addresses, but naming and routing are separate systems. A correct DNS answer is only one step toward a working connection."
eyebrow: "Open Systems Course · Lesson 81 of 180"
---

Typing a name such as `example.com` feels like choosing a destination.

The network does not route packets by that name.

IP forwarding works with IP addresses. DNS is a separate distributed naming system that helps software discover information associated with names. That distinction matters because a DNS lookup can succeed while the connection still fails, and a connection to an IP address can succeed even when a particular DNS name is broken.

A useful first model is:

```text
name
  ↓
DNS resolution
  ↓
one or more addresses
  ↓
route lookup
  ↓
transport connection or datagram
  ↓
application protocol
```

Each arrow is a different contract.

## A name is not an address

Consider the constructed example:

```text
service.example
```

A DNS answer might associate that name with:

```text
192.0.2.40
2001:db8::40
```

Those are documentation addresses, not real service endpoints.

The name is an identifier in the DNS namespace. The IPv4 and IPv6 addresses are data returned for particular record types. Routing decisions happen later, after the host has an address to send toward.

This separation is useful. A service can change addresses without changing the name users type. One name can have multiple addresses. Different record types can carry different kinds of information.

DNS is therefore not an Internet phone book in the literal sense. It is a distributed database with a hierarchical naming structure and typed records.

## The resolver path has several roles

On a typical host, an application does not begin by contacting a root DNS server.

It usually asks the operating system's resolver interface for an answer. The local component is often called a **stub resolver**. It sends the question to a configured recursive resolver.

Conceptually:

```text
application
    ↓
stub resolver
    ↓
recursive resolver
    ↓
cache or DNS hierarchy
```

RFC 9499 defines current DNS terminology, including stub resolvers, recursive mode, recursive resolvers, and authoritative servers.

The recursive resolver may already know the answer from its cache. If so, the lookup can stop there. If not, the resolver may perform the work needed to discover the answer from authoritative DNS data.

The authoritative server has local knowledge of a zone for which it is configured to answer. It is not the same role as a recursive resolver, even though one software package can technically support multiple roles.

## Records have types

DNS does not return a generic "destination."

It returns resource records.

Three common types are:

- **A** — an IPv4 address;
- **AAAA** — an IPv6 address;
- **CNAME** — an alias pointing from one DNS name to another canonical name.

RFC 1035 defines the original DNS protocol and the A and CNAME record types. IPv6 address records are defined by RFC 3596.

Suppose a query for `app.example` returns a CNAME:

```text
app.example.  CNAME  edge.example.net.
```

Resolution then has another name to resolve before an address is available.

That is another reason "DNS maps names to IP addresses" is only a beginner's shortcut. Sometimes it does. Sometimes the answer is a delegation, an alias, mail-routing information, a service-related record, a negative answer, or another kind of DNS data.

## TTL creates cached state

DNS records carry a time-to-live value, usually called TTL.

A resolver can cache an answer for a limited period rather than repeating the entire resolution process for every application request. That reduces latency and load on the DNS hierarchy.

Caching also means DNS has distributed state over time.

If an authoritative record changes at 12:00, every resolver on Earth does not instantly forget its previous cached answer. Some caches may still have a valid older answer until its remaining TTL expires. Other resolvers may have no cached answer and learn the new value immediately.

So a DNS change is not a synchronized global transaction.

The useful mental model is:

```text
authoritative data
      ↓
resolver caches with independent remaining lifetimes
      ↓
clients asking at different times
```

This is why "the DNS record has been changed" and "every client will now receive the new answer" are different claims.

## DNS success proves less than people think

Imagine:

```text
$ getent ahosts service.example
192.0.2.40 ...
```

A returned address proves that name resolution produced an answer through the resolver path used by that command.

It does **not** prove:

- that your routing table has a usable path;
- that packets reach the destination;
- that a firewall permits the transport;
- that a TCP listener exists;
- that a TLS certificate matches the service name;
- that the application is healthy.

Troubleshooting should keep those boundaries separate.

A useful evidence ladder is:

```text
Can I resolve the name?
        ↓
Can I route toward the address?
        ↓
Can I establish the transport?
        ↓
Can I establish TLS if required?
        ↓
Does the application protocol succeed?
```

"DNS works" is one rung.

## Multiple answers are normal

A name can return more than one A or AAAA record.

That does not mean every client will necessarily use the same address or try them in the same order. Address selection and connection behavior are host and application concerns layered above DNS data.

Likewise, a service may deliberately change answers based on geography, load-balancing policy, or other infrastructure decisions. DNS gives the client data. It does not by itself describe the complete service-selection algorithm.

Do not turn a DNS answer into a stronger statement than the protocol actually made.

## Inspect your own resolver path

On a Linux machine, start with configuration rather than packet capture.

Depending on the distribution, useful commands include:

```bash
resolvectl status
cat /etc/resolv.conf
getent ahosts example.com
```

Then inspect DNS directly with a tool such as `dig` or `drill`:

```bash
dig example.com A
dig example.com AAAA
dig example.com CNAME
```

Look for:

- the queried name;
- record type;
- returned records;
- TTL values;
- which resolver answered.

Do not assume `/etc/resolv.conf` always contains the final upstream resolver. On systems using a local caching or management service, it may point to a local stub.

The point of the exercise is not to memorize command output. It is to connect the application-visible name to the resolver component that produced the address data.

## Break the model safely

Use a test name or system you control.

Record a DNS answer and its TTL. Change the authoritative record in your own DNS zone, then compare results from:

- the authoritative server;
- your normal recursive resolver;
- another resolver you are authorized to query.

You may see different answers for a period because caches have different state.

That difference is evidence, not randomness.

Do not flush production caches or modify shared DNS merely for the exercise.

## The lesson to carry forward

DNS gives names a distributed resolution system.

Routing gives packets a path.

Transport gives applications communication endpoints and properties.

TLS can add authenticated encryption.

The application protocol gives exchanged data meaning.

Those systems cooperate, but none of them should be used as evidence for all the others.

When a user says, "the site does not open," the engineering question is not "is the network broken?"

It is:

**At which contract did the path stop being true?**

The next lesson follows DNS resolution itself, including recursion, referrals, delegation, caching, and negative answers.
