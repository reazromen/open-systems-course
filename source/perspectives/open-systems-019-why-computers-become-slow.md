---
title: "Why Computers Become Slow"
date: '2026-10-06'
draft: false
language: en
url: /posts/open-systems-019-why-computers-become-slow.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Slow is not a component. It is an observed delay. CPU saturation, memory pressure, storage latency, network waits, locks, queues, thermal limits, and software work can all produce the same complaint."
eyebrow: "Open Systems Course · Lesson 19 of 180"
---

"My computer is slow" sounds like a diagnosis.

It is actually an observation.

The user expected an action to finish sooner.

That delay could originate in CPU work, memory pressure, storage, networking, synchronization, another service, a device, or the application's own design.

The first performance skill is refusing to equate a symptom with one resource.

## Start with the critical path

Suppose opening a report takes ten seconds.

The user-visible path might be:

    click
      -> application logic
      -> DNS
      -> network connection
      -> API
      -> database query
      -> response
      -> parsing
      -> rendering

Total time is shaped by the work that lies on the critical path.

A CPU can be mostly idle while the application waits nine seconds for a remote service.

Buying a faster CPU would barely help.

Performance starts with the end-to-end path.

## CPU-bound

A workload is CPU-bound when useful progress is primarily limited by processor execution capacity.

Examples can include:

- video encoding;
- compression;
- cryptographic work;
- scientific computation;
- software compilation.

Evidence might include sustained CPU utilization and profiling that identifies expensive execution paths.

But even high CPU usage needs interpretation.

A busy CPU may be doing necessary work.

Or repeating work because of a bug.

Or spinning on contention.

Usage is evidence, not a verdict.

## Memory-bound

A processor may spend time waiting for data.

Poor cache locality can increase memory stalls.

A workload may exceed available memory bandwidth.

Memory capacity pressure may trigger reclaim or paging.

These are different problems.

"Needs more RAM" is only one possible memory diagnosis.

Sometimes the machine has plenty of capacity but the workload's access pattern fails to use caches effectively.

Sometimes a container has a smaller memory limit than the host.

Measure the right boundary.

## Storage-bound

A database may issue many small random I/O operations.

A backup may saturate a storage device.

A filesystem may wait on durable writes.

An SSD may enter garbage-collection or thermal conditions that alter latency.

A storage path can therefore make an application slow even when CPU and RAM look comfortable.

Measure latency, queue depth, throughput, and workload pattern—not just storage capacity.

A disk being "only 50% full" says very little about current I/O performance.

## Network-bound

A remote operation includes propagation, routing, queueing, transport behaviour, encryption, and server processing.

A user may say:

"the website is slow."

Possible reasons include:

- DNS delay;
- packet loss;
- high round-trip time;
- congested link;
- overloaded remote service;
- slow database behind the service;
- large assets;
- browser rendering.

Network performance is an end-to-end property.

A speed-test result does not prove one application path is healthy.

## Lock-bound and queue-bound

A machine can have spare CPU and still make work wait.

Imagine one shared lock protecting a critical resource.

Twenty threads arrive.

One enters.

Nineteen wait.

Adding more threads can make the situation worse.

Queues create a related effect.

If work arrives faster than it can be processed, queue length grows and latency rises.

Little's Law later gives us a formal relationship among throughput, latency, and work in the system, but the intuition is enough for now:

If arrival rate persistently exceeds service rate, waiting accumulates.

## Thermal and power limits matter

Modern processors dynamically change frequency and power behaviour.

A laptop may run a heavy workload quickly for a short burst and then reduce frequency as temperature or power limits are reached.

Two benchmark runs can differ because the machine starts from different thermal states.

Battery mode can change policies.

Cooling problems can change sustained performance.

Clock frequency is therefore a dynamic system variable, not a permanent sticker value.

## Background work changes the experiment

Antivirus scanning.

Search indexing.

Package updates.

Cloud synchronization.

Browser tabs.

Containers.

A machine is usually running many things.

If you measure an application without observing competing work, you can attribute shared-resource contention to the wrong component.

This is why repeatable performance experiments control conditions.

## Percentages hide latency distributions

Suppose an API averages 100 ms.

That sounds fine.

But what if:

- 90% complete in 20 ms;
- 9% complete in 200 ms;
- 1% take 8 seconds?

The mean hides the experience of the slowest requests.

Production systems often examine percentiles such as p50, p95, p99, along with distributions and traces.

The correct metric depends on the user experience and workload.

Performance is not one number.

## Optimization begins after measurement

A dangerous workflow:

    app feels slow
    -> guess CPU
    -> rewrite code
    -> no improvement

A better workflow:

    define slow operation
    -> measure end-to-end latency
    -> break into stages
    -> identify dominant wait/work
    -> form hypothesis
    -> change one thing
    -> measure again

That is performance engineering.

The method is more important than any one optimization trick.

## Exercise: build a waiting budget

Pick an action that feels slow.

Create a table:

    stage                 time
    input handling         ?
    local computation      ?
    network                ?
    server                 ?
    database               ?
    rendering              ?

You may not know the values yet.

That is the point.

The blank cells tell you what observability is missing.

A useful system lets you replace question marks with evidence.

## The lesson to carry forward

Computers become slow for many reasons because applications depend on many resources.

CPU, cache, RAM, storage, network, locks, queues, thermal policy, and remote dependencies can all dominate at different times.

"Slow" is a symptom.

Performance engineering asks:

**Where did the time go?**

That question leads naturally to profiling, tracing, metrics, packet capture, and observability later in the course.
