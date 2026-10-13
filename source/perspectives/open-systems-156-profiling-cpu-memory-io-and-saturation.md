---
title: "Profiling: CPU, Memory, I/O, and Saturation"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-156-profiling-cpu-memory-io-and-saturation.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "A host can be busy for very different reasons. Profiling attributes resource consumption to code paths and waiting states so high CPU, memory pressure, lock contention, disk latency, and scheduler delay are not conflated."
eyebrow: "Open Systems Course · Lesson 156 of 180"
---

CPU is 95 percent.

Is that bad?

Maybe.

A CPU-bound worker can be healthy at 95 percent.

A latency-sensitive service with a saturated run queue may be unhealthy at 70 percent.

Resource numbers need workload context.

## Utilization and saturation differ

Utilization asks how busy a resource is.

Saturation asks whether work is waiting because the resource has no capacity.

For CPU, saturation can appear as runnable tasks waiting.

For disk, it can appear as I/O queueing.

For a connection pool, it can appear as requests waiting for a slot.

Saturation often predicts latency better than utilization alone.

## CPU profiling attributes execution

A sampling profiler periodically records where CPU is executing.

Aggregated samples show hot functions and call stacks.

Flame graphs visualize stack distributions.

A hot function means CPU time is spent there.

It does not automatically mean the function is wrong.

Maybe that is the intended workload.

Compare with expectations and baseline.

## Off-CPU time matters too

A slow request may spend little CPU.

It can be waiting on:

mutex;
disk;
network;
condition variable;
scheduler;
database connection pool.

Off-CPU profiling and tracing can reveal these waits.

If you profile only on-CPU execution, waiting systems can look mysteriously idle.

## Memory pressure has several forms

RSS shows resident process memory.

Heap profiles can show allocation ownership.

The kernel also uses memory for page cache, slabs, buffers, and networking.

A process can leak objects.

A host can also be healthy while using most RAM for reclaimable cache.

Do not diagnose memory from one “used percent” value.

## GC creates latency behavior

Managed runtimes allocate and reclaim memory through garbage collection.

GC pauses or concurrent collector CPU can affect latency.

Useful evidence includes:

allocation rate;
heap size;
pause duration;
collection frequency.

Increasing heap can reduce collection frequency while increasing memory footprint and sometimes pause cost.

Measure rather than guessing.

## Disk latency propagates upward

A slow filesystem operation can stall:

database fsync;
log writer;
container runtime;
application file access.

Block-device metrics and I/O traces can identify queueing and latency.

The application symptom may be HTTP timeout.

The root resource is storage.

## Lock contention looks like low useful CPU

Many threads can exist while one lock serializes progress.

Symptoms:

high context switching;
many blocked threads;
low throughput;
one critical section.

Thread dumps, mutex profiling, and scheduler traces can expose the bottleneck.

Parallel code is not necessarily parallel execution.

## eBPF provides powerful kernel-level observation

On Linux, eBPF-based tools can observe syscalls, scheduling, networking, block I/O, and application probes with relatively low overhead when used carefully.

Tools such as bpftrace and BCC make kernel instrumentation accessible.

Production use still requires permissions, overhead awareness, and precise probes.

## Practical exercise

Take one local workload.

Profile it under:

CPU-heavy mode;
sleep/I/O-heavy mode;
lock-contention mode.

Compare:

CPU utilization;
run queue;
wall-clock latency;
on-CPU profile;
blocked/wait state.

The same slow response can have completely different resource signatures.

## The lesson to carry forward

Profiling attributes cost and waiting to concrete code and resources.

The next lesson asks how to turn all this telemetry into user-centered reliability targets and alerts.
