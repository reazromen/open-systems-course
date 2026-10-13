---
title: "AI Safety, Privacy, Reliability, and Cost"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-179-ai-safety-privacy-reliability-and-cost.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "Production AI needs explicit boundaries for unsafe actions, sensitive data, hallucination, prompt injection, availability, latency, and spend. Guardrails are layered system controls, not one classifier in front of a model."
eyebrow: "Open Systems Course · Lesson 179 of 180"
---

An AI feature can be useful and still be unsafe, unreliable, or economically impossible to operate.

Production design needs four simultaneous questions:

Can it harm?
Can it leak?
Can it fail?
Can we afford it?

## Safety should follow capability

A text summarizer has limited direct authority.

An agent that can transfer money or control machinery has much higher consequence.

Safety controls should scale with capability:

read-only tools;
write scopes;
confirmation;
rate limits;
human approval;
sandboxing;
hard business rules.

The model's confidence is not a substitute for authorization.

## Prompt injection is a trust-boundary failure

Retrieved documents, web pages, emails, and tool outputs can contain malicious instructions.

Treat them as untrusted data.

Do not let text from an email redefine which tools the agent may call.

Keep policy in deterministic application logic.

## Hallucination needs task-specific mitigation

A model can produce plausible unsupported claims.

Mitigations include:

retrieval with evidence;
constrained output;
deterministic verification;
abstention;
human review;
tool lookups;
narrow task design.

No single prompt eliminates hallucination.

High-stakes decisions need stronger evidence paths.

## Privacy begins before inference

Ask:

Does the model need this data?

Redact or minimize unnecessary fields before sending.

Separate tenant data.

Define retention.

Know whether prompts/tool results are stored by infrastructure.

Sensitive data should not be included merely because context space is available.

## Reliability requires fallbacks

Model endpoint can time out.

Quota can be exhausted.

Structured output can fail.

Tool call can fail.

Design:

retry policy;
alternate model where appropriate;
deterministic fallback;
queueing;
human escalation;
graceful degradation.

Do not make a critical non-AI function unavailable because a generative model is down unless the product truly requires it.

## Cost is a workload property

AI cost can depend on:

input tokens;
output tokens;
model choice;
retrieval;
reranking;
tool calls;
concurrency;
GPU utilization.

A prompt that includes an entire 200-page manual for every question may work technically and fail economically.

Measure cost per successful task, not cost per API call alone.

## Caching can reduce model work

Deterministic or semantically repeated requests can sometimes reuse:

retrieval results;
embeddings;
tool data;
model outputs under safe conditions.

Caching AI outputs raises freshness and privacy questions.

Do not cache personalized answers across users without a correct key and authorization boundary.

## Rate limits protect both safety and budget

Per-user and per-tenant quotas limit abuse and unexpected spend.

Tool actions can have stricter limits than text generation.

A runaway agent loop should hit:

step limit;
deadline;
token budget;
tool budget.

Bounded work is an availability feature.

## Human escalation is a valid system outcome

An AI system should be able to say:

uncertain;
insufficient evidence;
requires privileged approval;
send to human.

Escalation is not failure.

It is an explicit path for cases outside the automation envelope.

## Practical exercise

Take an AI agent that can update customer records.

List:

unsafe actions;
sensitive fields;
external untrusted inputs;
maximum tool steps;
per-user budget;
required confirmations;
fallback when model unavailable;
audit fields.

Then inject malicious instructions into a retrieved document and verify the deterministic policy still blocks unauthorized writes.

## The lesson to carry forward

Trustworthy AI comes from layered system controls around a probabilistic model.

The final lesson combines the entire course into one architecture project.
