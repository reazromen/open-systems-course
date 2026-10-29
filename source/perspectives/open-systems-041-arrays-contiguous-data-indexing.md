---
title: "Arrays: Contiguous Data and Indexing"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-041-arrays-contiguous-data-indexing.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 10
excerpt: "Arrays organize ordered elements so indexed access can be direct and cache-friendly. Their strengths come from layout, and their weaknesses appear when size and insertion patterns change."
eyebrow: "Open Systems Course · Lesson 41 of 180"
---

You have one temperature reading.

A variable is enough.

You have one million readings in order.

Now the organization of data matters.

An array is one of the simplest and most important data structures: an ordered sequence of elements accessible by position.

The interesting part is not square-bracket syntax.

It is layout.

## Indexing converts position into address

Imagine fixed-size elements stored consecutively.

If each element occupies four bytes and the array begins at address B, then element i can be located conceptually as:

    address = B + i × 4

That arithmetic gives direct indexed access.

No need to scan earlier elements to find item 900,000.

This is why arrays support constant-time positional access in the standard model.

## Contiguity helps caches

Read:

    array[0]
    array[1]
    array[2]
    array[3]

Nearby elements often occupy nearby memory.

Cache lines fetch blocks of neighbouring bytes.

Sequential traversal can therefore reuse data already brought into cache.

This is one reason arrays perform well in many numeric and systems workloads.

Data structure and hardware architecture meet.

## Fixed-size arrays have limits

In low-level languages, a basic array may have fixed length.

Need more capacity?

A dynamic-array implementation can allocate a larger block and copy elements.

Languages expose names such as vector, list, ArrayList, or slice-backed structures depending on their model.

Appending can be efficient on average when capacity grows geometrically, even though occasional resizing is expensive.

This introduces amortized analysis: rare expensive operations can be spread across many cheap ones.

We will not treat "append is O(1)" as magic. It is a statement about a particular implementation and analysis model.

## Inserting near the front moves data

Suppose an array contains:

    A B C D E

Insert X at index 1:

    A X B C D E

If the representation is contiguous, B through E may need to move.

The operation is structurally different from reading item 1.

This is the central data-structure lesson:

Different operations have different costs.

Do not ask "is array fast?"

Ask:

Fast for what operation under what workload?

## Capacity and length are different

A dynamic array might reserve space for 16 elements while currently holding 10.

Length:

    10

Capacity:

    16

That extra space allows several appends without reallocating.

Memory use therefore exceeds the exact payload.

Data structures trade capacity, speed, and implementation complexity.

## Arrays need element-size rules

A C array of fixed-width integers is very different from a Python list.

CPython lists are dynamic arrays of references to Python objects, not a flat packed sequence of arbitrary Python object contents.

The source syntax:

    items

does not tell you the physical representation.

Know the language/runtime implementation before making memory-performance claims.

## Multidimensional arrays expose layout

A matrix may be stored row-major or column-major.

Traversal order can therefore change cache locality.

Numerical libraries care deeply about layout because operations touch huge volumes of data.

The mathematical matrix is an abstraction.

The linear memory arrangement determines much of performance.

## Bounds are a correctness boundary

Access index 100 in a ten-element array.

Safe languages usually check and report an error.

Low-level languages may leave out automatic bounds enforcement for raw arrays, making invalid access a potential memory-safety bug.

Performance, safety, and control interact at the language boundary.

Do not assume one array model applies everywhere.

## Exercise: choose an array workload

You need to store one hour of sensor readings sampled once per second.

That is 3,600 values.

Operations:

- append newest;
- scan in chronological order;
- access reading by index;
- occasionally compute average.

An array-like structure is a natural starting point.

Now add requirement:

Keep only newest 3,600 forever while adding one each second.

Shifting the whole array each time would be wasteful.

A ring buffer may fit better.

Requirements choose structures.

## The lesson to carry forward

Arrays are powerful because contiguous or indexable organization gives efficient positional access and often strong locality.

Their limitations appear in resizing and insertion/removal patterns.

Never learn a data structure as a definition only.

Learn:

- representation;
- supported operations;
- cost;
- memory behaviour;
- workload fit.

## Interactive companion exercise

Compare indexed reads, dynamic-array resizing, and front insertion in the [data-structure operation explorer](../prototypes/interactive-system-design.html#data-structure-title). The reported steps are simplified complexity examples, not timing benchmarks.
