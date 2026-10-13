---
title: "How DNS Resolution Actually Works"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-082-how-dns-resolution-actually-works.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A recursive resolver can answer from cache or follow DNS delegations through the hierarchy. Understanding referrals, authoritative answers, TTLs, and negative caching makes DNS failures much smaller."
eyebrow: "Open Systems Course · Lesson 82 of 180"
---

A DNS lookup often appears to be one request and one reply.

The work behind that reply may have happened earlier, may be satisfied entirely from cache, or may require a resolver to follow the DNS hierarchy.

The first rule is therefore:

**Do not assume that every application lookup causes a query to a root server.**

Most do not.

## Recursion and iteration are different jobs

A normal host commonly sends a query to a recursive resolver and asks it to obtain the final answer.

That relationship looks like:

```text
stub resolver
      ↓ recursive query
recursive resolver
      ↓
final answer or error
```

RFC 9499 describes recursive mode as the mode in which a server answers from local cache or sends other queries to obtain the final answer rather than merely returning a referral.

When a resolver follows referrals through DNS servers, the conceptual path can look like:

```text
recursive resolver
      ↓
root zone server
      ↓ referral
top-level-domain server
      ↓ referral
authoritative server for the child zone
      ↓ answer
recursive resolver cache
      ↓
stub resolver
```

That is a model of a cache miss, not a packet trace of every DNS lookup.

## Start with the cache

Suppose the resolver is asked for:

```text
www.example.com. A
```

Before it performs external resolution, it can check whether it already has usable cached data.

If a valid cached answer exists, it can reply immediately.

It might also have cached pieces of the path: for example, which servers are authoritative for `.com` or for `example.com`. A partial cache can let it start closer to the destination instead of repeating the entire hierarchy.

This is why two queries for the same name can have very different latency without anything being wrong.

## Delegation connects zones

DNS is hierarchical, but the hierarchy is divided into zones.

A parent zone can delegate responsibility for a child zone using NS records.

Conceptually:

```text
root
  ↓ delegates .com
.com
  ↓ delegates example.com
example.com
  ↓ contains authoritative data
```

A referral tells the resolver which name servers it should ask next.

Sometimes the resolver also needs an address for one of those name servers. DNS can include address information called **glue** where it is needed to make a delegation usable without creating a circular dependency.

The exact rules matter to DNS operators, but the systems lesson is simpler: resolution is a graph of dependencies. Even discovering the server that knows an answer can itself require DNS data.

## An authoritative answer is a narrower claim

An authoritative server answers from the zone data it serves.

That does not mean it knows every name on the Internet.

It knows the zones for which it is authoritative and can provide referrals for delegated children when appropriate.

Likewise, receiving an authoritative DNS answer for an address does not prove that the address currently hosts a healthy service. DNS authority is authority over naming data, not over the runtime state of the destination application.

Keep the evidence boundary narrow.

## CNAME can extend the resolution path

A queried name can be an alias.

Constructed example:

```text
app.example.       CNAME  edge.example.net.
edge.example.net.  A      192.0.2.80
```

The resolver has to obtain the address data associated with the canonical target.

That target can live in another zone with another authority.

So "one name lookup" at the application boundary can depend on several DNS names and several zones.

RFC 1034 and RFC 1035 describe the core DNS resolution model and protocol data structures.

## Negative answers are cached too

Caching is not only for successful answers.

DNS can cache knowledge that a requested name does not exist or that the requested record type has no data.

RFC 2308 defines negative caching behavior.

This matters operationally.

Suppose you query a name before creating it in your zone. The resolver receives a definitive negative answer and caches it. You then create the record immediately.

The authoritative server may now contain the record while the recursive resolver still has a valid negative cached result.

From one viewpoint:

```text
authoritative zone: record exists
```

From another:

```text
recursive cache: earlier negative answer still valid
```

Those observations can coexist.

## NXDOMAIN and no data are not identical

At a high level:

- **NXDOMAIN** means the queried domain name does not exist in DNS;
- a **no-data** response means the name exists but no record of the requested type is available in the answer.

That distinction matters for caching and diagnosis.

If an A query has no data but an AAAA record exists, saying "the domain does not exist" would be wrong.

When debugging DNS, always preserve:

```text
query name + query type + response code + returned sections
```

Do not reduce all failures to "DNS error."

## TTL is remaining permission to reuse data

A TTL tells a cache how long a resource record may be retained.

When you inspect a cached reply, the displayed TTL may be lower than the value configured at the authoritative source because time has already passed since the resolver cached it.

That gives you useful evidence.

If repeated queries show a decreasing TTL, you are probably observing cached state.

When the cache expires, a later query can cause fresh resolution.

## Observe with dig

Use a public test domain or a domain you control.

A normal query through your configured resolver:

```bash
dig example.com A
```

Ask a specific resolver you are authorized to query:

```bash
dig @192.0.2.53 example.com A
```

The address above is documentation space; replace it only with a resolver you are allowed to use.

Inspect:

- status;
- flags;
- answer;
- authority section;
- additional section;
- TTL;
- responding server.

A tool such as `drill` can provide similar evidence.

## Understand what +trace actually proves

`dig +trace` is useful, but its name can cause a bad mental model.

It does not ask your normal recursive resolver to print the exact historical path it followed.

Instead, it performs iterative-style queries from the machine running `dig`, beginning from root information and following delegations.

Use it to study the DNS hierarchy:

```bash
dig +trace example.com
```

Do not present its output as a packet-for-packet trace of some other resolver's internal work.

## Build a DNS failure ladder

If an application fails to resolve a name, ask in this order:

```text
Does the local stub know which resolver to use?
        ↓
Can the host reach that resolver?
        ↓
Does the resolver answer from cache?
        ↓
Can it reach the authoritative path if needed?
        ↓
Is the delegation correct?
        ↓
Does the authoritative zone contain the requested data?
        ↓
Is a cached positive or negative answer still valid?
```

That is more useful than repeatedly clearing caches.

Cache flushing destroys evidence and can make a transient symptom disappear before you understand it.

## Break it safely

On a DNS zone you control, create a short-lived test record.

1. Query it through your normal resolver.
2. Query the authoritative server directly.
3. Change the test value.
4. Query both again without flushing anything.
5. Record TTLs and timestamps.
6. Wait for the relevant cache lifetime to expire and repeat.

Then create a new test name only after first querying it while it does not exist. Observe how a cached negative answer changes the experiment.

This turns "DNS propagation" from a vague phrase into observable distributed cache state.

## The lesson to carry forward

DNS resolution is not one global database read.

It is a distributed process involving caches, delegations, referrals, authoritative data, and time.

A recursive resolver hides much of that work from the client, which is useful. Troubleshooting sometimes requires revealing the hidden boundaries again.

The next lesson moves earlier in a host's network life: before DNS can be useful, the machine often needs local configuration such as an address, a route, and a resolver. DHCP is one way IPv4 hosts obtain that configuration.
