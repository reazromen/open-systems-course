---
title: "Inference Serving: Batching, KV Cache, and Streaming"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-173-inference-serving-batching-kv-cache-and-streaming.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "Model inference is a serving system. Tokenization, batching, accelerator memory, KV-cache allocation, scheduling, decoding, and streaming determine throughput and latency beyond the model's mathematical architecture."
eyebrow: "Open Systems Course · Lesson 173 of 180"
---

A user submits a prompt.

The response appears one token at a time.

Between those two events is a specialized serving system.

## Tokenization happens before model compute

Input text becomes token IDs.

The server validates limits and often builds a request structure containing:

model;
input tokens;
generation parameters;
stop conditions;
metadata.

Large prompts increase prefill compute and memory.

Input size is therefore a latency and capacity dimension.

## Prefill and decode behave differently

During prefill, the model processes the input sequence.

During decode, it generates new tokens iteratively.

The resource profile differs:

prefill can be compute-heavy;
decode repeatedly reuses prior attention state.

This distinction is useful when diagnosing time-to-first-token versus tokens-per-second.

## KV cache stores attention history

Autoregressive transformer serving commonly caches key/value states from previous tokens so each generated token does not recompute the entire sequence from scratch.

KV cache consumes accelerator memory proportional to context and concurrency.

That creates a capacity problem:

longer context;
more concurrent requests;
larger model

can exhaust memory even if model weights fit.

## Batching improves accelerator utilization

GPUs and other accelerators work efficiently on batches.

Static batching waits to collect requests.

Continuous batching can admit and retire sequences dynamically while generation proceeds.

Batching increases throughput but can affect per-request latency.

Schedulers balance fairness, memory, and utilization.

## Queueing creates tail latency

If the accelerator is saturated, requests wait before inference.

The model can be fast while user latency is slow because queue delay dominates.

Monitor separately:

queue time;
prefill time;
time to first token;
decode rate;
total duration.

One “model latency” metric hides the serving bottleneck.

## Streaming changes user perception

A streaming response can send generated tokens before the entire output is complete.

This improves perceived latency.

It does not reduce total computation automatically.

The client now has partial output state and needs handling for cancellation, connection loss, and tool-call boundaries.

## Quantization trades representation precision for capacity

Quantization represents weights or activations using lower precision.

This can reduce memory and improve throughput on suitable hardware.

Quality and performance effects depend on model, quantization method, kernels, and workload.

Do not assume every lower-bit model has the same accuracy or speed.

Measure on the target hardware.

## Speculative decoding spends extra model work to reduce sequential latency

Some serving systems use a smaller draft model or alternative predictor to propose several tokens that a larger model verifies.

When proposals are accepted, multiple output tokens can be advanced with fewer expensive sequential steps.

Performance depends on acceptance rate and hardware.

This is a systems optimization around autoregressive dependency.

## Admission control protects the service

One user sending an enormous context can consume disproportionate memory.

Production systems need limits:

maximum input tokens;
maximum output tokens;
concurrency;
per-tenant quotas;
timeouts;
cancellation.

Without admission control, a few requests can degrade everyone.

## Practical exercise

Using a local or authorized inference server, record:

input token count;
queue time;
time to first token;
output token count;
total duration.

Repeat with short and long prompts.

Then run several concurrent requests.

Observe when queueing begins.

Do not publish the numbers as universal model benchmarks; label hardware, model, quantization, and server version.

## The lesson to carry forward

Inference performance is produced by the serving stack as much as the model.

The next lesson asks what context the model should receive and how deterministic code should constrain the output.
