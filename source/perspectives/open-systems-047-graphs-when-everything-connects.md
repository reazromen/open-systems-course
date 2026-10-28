---
title: "Graphs: When Everything Connects"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-047-graphs-when-everything-connects.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 11
excerpt: "Graphs model arbitrary relationships: routers and links, users and follows, services and dependencies, cities and roads. Once cycles and multiple paths exist, tree intuition is not enough."
eyebrow: "Open Systems Course · Lesson 47 of 180"
---

A road network is not a tree.

You can often reach one city through several routes.

A social network is not a tree.

People have many relationships.

A microservice dependency map may contain cycles.

When relationships become many-to-many, graphs give us the right model.

## Vertices and edges

A graph contains vertices, or nodes, and edges connecting them.

Example:

    A -- B
    |  / |
    | /  |
    C -- D

Edges may be:

- directed or undirected;
- weighted or unweighted;
- labeled;
- one-way or bidirectional.

The model depends on the domain.

A network route has different semantics from a social follow.

Do not confuse identical drawing shapes with identical meaning.

## Representation changes cost

Two common representations:

Adjacency list:

    A: B, C
    B: A, C, D
    C: A, B, D

Adjacency matrix:

A table indicating whether every pair is connected.

Adjacency lists are compact for sparse graphs.

Matrices can make edge-existence checks direct but use space proportional to the square of vertex count.

The correct representation follows graph density and operations.

## Breadth-first search explores by distance in edges

Starting at A, breadth-first search visits nearest unvisited neighbours before moving farther.

In an unweighted graph, BFS can find shortest paths measured by edge count.

It uses a queue.

The data structures from earlier lessons combine into algorithms.

## Depth-first search follows one path deeply

Depth-first search explores along a branch before backtracking.

It can use recursion or an explicit stack.

DFS helps with:

- reachability;
- cycle detection;
- topological reasoning;
- connected components.

Again, stack ordering changes exploration behaviour.

## Weights change shortest path

Suppose roads have distances.

Fewest edges does not mean shortest distance.

A path with three short edges may beat one giant edge.

Now algorithms such as Dijkstra's or Bellman-Ford become relevant under different assumptions.

MIT 6.006 treats BFS, DFS, weighted shortest paths, Bellman-Ford, and Dijkstra separately because problem constraints determine which algorithm applies.

## Cycles change failure reasoning

Service A calls B.

B calls C.

C calls A.

You have a cycle.

Startup ordering, retries, dependency failure, and ownership become harder.

Drawing the system as a graph can reveal cycles that prose hides.

Architecture diagrams are not decoration when they expose dependency structure.

## Network routing is graph reasoning

Routers and links form a changing graph.

Routing protocols distribute information used to choose paths.

Weights, policies, failures, and reachability all influence forwarding.

The Internet module will make this concrete.

For now, notice that graph algorithms are not classroom puzzles.

They are embedded in infrastructure.

## Exercise: dependency graph

Create nodes:

    web
    auth
    database
    email
    queue

Add directed edges where one component depends on another.

Now remove database.

Which nodes lose useful function?

Add a cycle.

What does startup look like?

A graph turns architecture into something you can analyze.

## The lesson to carry forward

Graphs model relationships when nodes can connect arbitrarily.

Their power comes from making paths, cycles, reachability, and connectivity explicit.

When the real question is "how are these things connected?" you are probably already thinking in graphs, whether or not you use the word.

## Interactive companion exercise

Switch the [graph traversal explorer](../prototypes/interactive-system-design.html#graph-title) between BFS and DFS and inspect the visited order and frontier at each step.
