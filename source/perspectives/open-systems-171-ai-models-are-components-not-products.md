---
title: "AI Models Are Components, Not Products"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-171-ai-models-are-components-not-products.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 12
excerpt: "A model maps inputs to outputs under learned parameters. Production AI systems add data pipelines, prompts, retrieval, tools, policies, state, evaluation, observability, security, and user experience around that model."
eyebrow: "Open Systems Course · Lesson 171 of 180"
---

An AI model can generate text.

That does not make it a product.

A production system still needs:

input handling;
context;
identity;
retrieval;
tool access;
state;
policy;
evaluation;
observability;
failure handling;
cost control;
user experience.

The model is one component in a larger architecture.

## A model implements a learned function

At inference time, a trained model receives an input representation and computes outputs from learned parameters.

For a language model, that often means predicting probability distributions over the next token repeatedly.

The impressive behavior emerges from the learned representation and scale.

The operational system still has to decide when, why, and under what authority the model is called.

## Training and inference are different systems

Training updates model parameters.

Inference uses fixed parameters to produce outputs.

Training requires datasets, optimization, checkpoints, and large compute pipelines.

Inference requires model loading, tokenization, batching, memory management, latency control, and serving.

A team using a hosted model API may never operate training infrastructure.

It still operates an inference-dependent application.

## The model does not know your current system state automatically

A model may have learned general patterns from training.

It does not automatically know:

today's database contents;
the user's account;
current fleet status;
new documents;
live metrics.

Those must be provided through context, retrieval, tools, or connected systems.

“Model intelligence” and “application state” are different sources.

## Model output is probabilistic

For many generative models, output depends on probability distributions and decoding strategy.

Repeated calls can differ.

That makes model output unlike a deterministic database lookup.

Applications should decide where variability is acceptable.

For tasks requiring exact invariants, use deterministic validation or conventional code around the model.

## Context is temporary working state

A model can receive:

system instructions;
user messages;
retrieved documents;
tool results;
structured data.

This context affects the current inference.

It is not automatically durable application memory.

Durable memory requires an external state store and explicit retrieval policy.

## AI architecture starts with the job

Before choosing a model, ask:

What decision or transformation is needed?
What evidence must support it?
What latency is acceptable?
What error is unacceptable?
What data may be sent to the model?
What deterministic checks can verify the result?

Model selection follows the system requirement.

## Smaller models can be better components

A larger model can be more capable.

A smaller model can be:

faster;
cheaper;
easier to run locally;
more predictable for narrow classification;
less data-exposing if deployed on-device.

The best component depends on workload.

“Largest model available” is not an architecture principle.

## AI systems still use ordinary infrastructure

Behind a model endpoint are familiar systems:

DNS;
TLS;
HTTP or RPC;
load balancing;
queues;
GPUs/accelerators;
caches;
databases;
logs;
metrics.

Everything from the previous 17 modules still applies.

AI is not an escape from systems engineering.

## Practical exercise

Choose one hypothetical AI feature: support-ticket classification.

Draw two designs.

Design A:
send ticket text directly to a model and store answer.

Design B:
validate input, redact secrets, call model, validate structured category, enforce allowed labels, record confidence/evidence, route uncertain cases to human review.

Compare failure modes.

The difference between them is system design, not model size.

## The lesson to carry forward

A model is a probabilistic computational component inside a larger deterministic and stateful system.

The next lesson opens the model input representation: tokens, embeddings, and vector spaces.
