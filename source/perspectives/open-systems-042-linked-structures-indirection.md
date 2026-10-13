---
title: "Linked Structures and Indirection"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-042-linked-structures-indirection.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 10
excerpt: "Linked structures trade contiguous layout for explicit connections between nodes. That can make local insertion easy while making indexing, memory overhead, and cache locality worse."
eyebrow: "Open Systems Course · Lesson 42 of 180"
---

An array puts neighbours near each other.

A linked structure does not require that.

Each node can contain data plus a reference to another node.

For a singly linked list:

    [A | next] -> [B | next] -> [C | next] -> null

The structure is defined by links, not physical adjacency.

## Indirection changes access

Want item 2 in an array?

Compute its index.

Want item 2 in a linked list?

Start at the head.

Follow next.

Follow next.

The structure has no direct positional formula unless additional indexing is added.

This makes random indexed access linear in list length in the basic model.

## Insertion can be local

Suppose you already have a reference to node B and want X after it.

Change:

    B.next = X
    X.next = old B.next

No large contiguous block needs shifting.

That sounds ideal.

But "insertion O(1)" hides an assumption:

You already have the insertion location.

If you first search from the head to find B, total operation may still be linear.

Complexity statements require the complete operation.

## Memory overhead appears in every node

An array of integers can be compact.

A linked node may store:

- value;
- next pointer;
- allocator metadata;
- alignment padding.

A doubly linked node adds a previous pointer.

For small payloads, metadata can be a large fraction of memory use.

Data structure choice affects not only time but memory footprint.

## Cache locality is usually worse

Linked nodes can be scattered across the heap.

Following next may jump to another cache line.

The CPU cannot always benefit from spatial locality as effectively as a contiguous traversal.

This is why textbook operation counts do not fully predict real performance.

Hardware matters.

A linked list can have theoretically attractive insertion properties and still lose to an array-like structure on many practical workloads.

Measure.

## Links create ownership questions

Who frees nodes?

Can two structures reference the same node?

What happens if a node is removed while another reference still exists?

Low-level languages make these questions explicit and dangerous.

Managed languages handle object lifetime differently but logical ownership can still be confusing.

Data structures are state graphs, and state graphs need lifecycle rules.

## Lists are one case of a broader idea

Trees use links.

Graphs use links or adjacency structures.

Object models use references.

Filesystem directories conceptually link names to objects.

Pointers and references let software build structures whose logical relationships differ from physical memory layout.

Indirection is one of computing's most powerful ideas.

It is also a common source of cache misses and memory bugs.

## Exercise: reverse the trade-off

Workload A:

- iterate 10 million numbers repeatedly;
- rarely insert.

Workload B:

- maintain small nodes;
- frequently insert/remove at known positions;
- rarely index by number.

Which structure would you test first?

Do not answer "array always" or "linked list always."

State the operations and hardware considerations.

That is the habit.

## The lesson to carry forward

Linked structures replace contiguity with explicit relationships.

They can make local structural changes cheap.

They make positional access, metadata overhead, ownership, and locality more complicated.

Every data structure moves cost somewhere.

Your job is to move it toward the operation your workload can afford.
