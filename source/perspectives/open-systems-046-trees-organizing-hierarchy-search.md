---
title: "Trees: Organizing Hierarchies and Search"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-046-trees-organizing-hierarchy-search.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Trees model parent-child structure and can support efficient ordered search when their shape is controlled. Filesystems, indexes, parsers, and routing structures all exploit tree-like organization."
eyebrow: "Open Systems Course · Lesson 46 of 180"
---

Some data is not naturally flat.

A filesystem has directories inside directories.

An organization has teams inside divisions.

A parser has expressions containing subexpressions.

A database index needs ordered branching.

These relationships create trees.

## A tree starts with nodes and edges

A rooted tree has a root.

Nodes can have children.

Every non-root node has one parent in the basic model.

Example:

    root
    ├── A
    │   ├── C
    │   └── D
    └── B

The path from root to D is:

    root -> A -> D

That structural language is more important than one implementation.

## Binary search trees add an ordering invariant

A binary search tree can enforce:

    left subtree < node < right subtree

for keys under a chosen ordering rule.

Lookup compares the desired key and chooses one branch.

If the tree remains balanced, each decision can discard a large fraction of possibilities.

That can give logarithmic-height search.

But the word balanced matters.

## A bad tree becomes a list

Insert already sorted keys into a naive binary search tree:

    1
           2
               3
                   4

The tree has degenerated.

Search becomes linear.

Balanced-tree designs such as AVL or red-black trees maintain shape constraints to keep height controlled.

MIT's algorithms courses treat balanced binary search trees as a distinct topic for exactly this reason.

The data structure's invariant creates its performance guarantee.

## Trees support ordered operations

Hash tables are excellent for direct key lookup.

Trees can also support:

- sorted traversal;
- minimum/maximum;
- predecessor/successor;
- range queries.

If you need all keys between 100 and 200, ordering matters.

This is why databases often use B-tree-family indexes rather than simple hash tables for general ordered indexing.

Different query patterns choose different structures.

## High branching factor fits storage systems

Binary trees have at most two children per node.

Storage indexes often use much larger branching factors.

Why?

A disk or SSD access can fetch a block containing many keys and child pointers.

A B-tree-like structure can reduce the number of storage accesses needed to reach a record.

Hardware characteristics shape data structures.

The same abstract search problem receives a storage-aware implementation.

## Syntax trees represent programs

Consider:

    a + b * c

A parser can represent structure as:

        +
       /       a   *
         /         b   c

Multiplication is nested beneath addition according to precedence.

This tree gives compilers a structural representation of source meaning.

Trees are therefore not only containers for user data.

They are internal representations of programs.

## Filesystems are tree-like but not always pure trees

Directory paths look hierarchical:

    /home/user/project/file

But hard links, mount points, symbolic links, and special filesystem features complicate the pure-tree model.

This is a useful warning.

A tree can be a helpful abstraction even when the real system contains graph-like relationships.

Know where the model stops being exact.

## Exercise: choose hash or tree

Requirement A:

Given user ID, retrieve exact user.

Hash table is a strong candidate.

Requirement B:

Return all timestamps between 10:00 and 10:05 in sorted order.

Ordered tree/index is a strong candidate.

Requirement C:

Represent a nested JSON document.

Tree-like representation is natural.

The structure follows the operations and relationships.

## The lesson to carry forward

Trees organize hierarchical and ordered relationships.

Their usefulness depends on invariants such as ordering and balance.

A shape that looks like a tree is not enough to guarantee good search.

When choosing a tree, ask:

What ordering or hierarchy must it preserve?

What operations must be efficient?

What keeps the shape healthy?
