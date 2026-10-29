---
title: "Hash Tables: Finding by Key"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-045-hash-tables-finding-by-key.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Hash tables turn keys into candidate storage locations, giving average constant-time lookup under useful assumptions while paying for collisions, resizing, memory overhead, and hash quality."
eyebrow: "Open Systems Course · Lesson 45 of 180"
---

You have one million users.

Given:

    user_id = 845291

you want the matching record quickly.

Scanning every user is wasteful.

A hash table attacks the problem by transforming the key into an index or bucket.

## Hash function creates a placement hint

Conceptually:

    hash(key) -> integer

Then map that integer into table capacity:

    bucket = hash(key) mod N

Now the lookup jumps toward one candidate region instead of scanning everything.

The hash does not need to preserve the original meaning of the key.

It needs useful distribution properties for the table design.

## Different keys can collide

A finite table receives many possible keys.

Two keys can map to the same bucket.

That is a collision.

A correct hash table must handle it.

Common families include:

- separate chaining;
- open addressing.

MIT's algorithms material treats hashing, chaining, open addressing, and table resizing as separate design topics.

The collision policy is part of the implementation.

## Average constant time has assumptions

Hash tables are famous for:

    lookup O(1) average

That statement assumes things such as:

- appropriate load factor;
- reasonable hash distribution;
- suitable collision handling.

Worst-case behaviour can degrade dramatically.

Security-sensitive systems also consider adversarial keys that deliberately create collisions.

Complexity claims are models, not guarantees detached from inputs.

## Load factor changes behaviour

Load factor roughly compares stored entries with available table capacity.

As a table becomes crowded, collisions generally become more frequent depending on scheme.

Implementations resize the table to preserve performance.

Resizing costs time because entries may need reorganization.

Like dynamic arrays, hash tables often use amortized reasoning.

Most inserts can be cheap.

Occasional resize is expensive.

## Hash table order is not the point

A hash table is designed for key-based lookup, not sorted traversal.

Some language implementations preserve insertion order as an additional property.

Do not assume every hash table does.

If you need ordered range queries, a tree or sorted structure may be more appropriate.

Choose based on operations.

## Hashing for tables is not cryptographic hashing

A hash-table function wants fast distribution.

A cryptographic hash has security properties such as resistance to finding collisions or preimages under defined threat models.

They are related by name and mathematical idea but serve different contracts.

Do not use a casual table hash as a password-storage scheme or cryptographic integrity primitive.

Security requirements need security algorithms.

## Keys need stable equality semantics

If key equality changes while an entry sits in the table, lookup can break.

Mutable objects therefore require care as hash keys.

Many languages restrict hashable keys to objects with stable hash/equality behaviour.

The data-structure invariant depends on the key contract.

## Exercise: build a tiny table

Capacity:

    5

Hash:

    key mod 5

Insert:

    12 -> bucket 2
    7  -> bucket 2

Collision.

Now choose chaining:

    bucket 2: [12, 7]

Lookup 7:

- compute bucket 2;
- search bucket contents.

You have built a miniature hash table.

Then insert many keys ending in 2 or 7.

Performance degrades.

Hash quality matters.

## The lesson to carry forward

Hash tables are excellent when the workload says:

Given this key, find the associated value.

Their speed comes from direct placement hints rather than sorted order.

The price is collision handling, extra capacity, resizing, and reliance on hash behaviour.

"Use a dictionary" is not just syntax.

It is a data-structure decision.

## Interactive companion exercise

Explore expected hash-table lookup and its worst-case caveat in the [data-structure explorer](../prototypes/interactive-system-design.html#data-structure-title). Collision behavior is described but not simulated.
