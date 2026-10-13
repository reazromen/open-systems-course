---
title: "Evaluation, Regression Tests, and AI Observability"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-178-evaluation-regression-tests-and-ai-observability.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 14
excerpt: "AI quality cannot be inferred from a few impressive chats. Evaluation needs representative datasets, explicit rubrics, deterministic checks where possible, model/judge calibration, production metrics, and regression testing across model and prompt changes."
eyebrow: "Open Systems Course · Lesson 178 of 180"
---

A model gives one excellent answer.

That proves almost nothing about system reliability.

AI evaluation needs a dataset and a definition of success.

## Start with task-specific criteria

For extraction:

field accuracy;
schema validity;
missing-field rate.

For retrieval:

recall at k;
ranking quality;
citation correctness.

For support answers:

factual correctness;
policy compliance;
resolution usefulness;
escalation correctness.

Avoid one generic “quality score” when the task has several failure types.

## Build an evaluation set from real cases

Synthetic examples are useful.

Real historical cases capture messy inputs:

typos;
long documents;
ambiguous requests;
edge cases;
rare languages;
policy conflicts.

Remove or protect sensitive data appropriately.

Split cases so test examples do not leak into prompt tuning.

## Deterministic checks are valuable

If output must be valid JSON, check it with a parser.

If category must be one of five values, enforce the enum.

If a cited document ID does not exist, fail the citation.

Do not ask another model to judge properties that code can verify exactly.

## Human evaluation is still necessary

Some properties are subjective:

helpfulness;
clarity;
tone;
reasoning quality.

Use clear rubrics and multiple reviewers for important evaluations.

Measure reviewer disagreement.

A vague “looks good” label creates noisy data.

## Model-as-judge is a tool, not ground truth

A model can evaluate other outputs at scale.

It can also have biases, inconsistency, positional preferences, or shared blind spots.

Calibrate model judgments against human-labeled examples.

Use it for triage and scalable signals, not unquestioned truth.

## Regression tests protect changes

Changing:

model;
prompt;
retrieval;
tool descriptions;
temperature;
schema;
context policy

can improve one case and break another.

Run the evaluation suite before rollout.

Compare by category, not only global average.

A 2 percent aggregate gain can hide a catastrophic drop in one safety-critical slice.

## Online metrics reveal production distribution

Offline eval cannot predict every real input.

Monitor:

tool failure rate;
structured-output invalid rate;
retrieval miss indicators;
user correction rate;
escalation rate;
latency;
token usage;
cost;
safety-policy triggers.

Do not log sensitive prompts blindly.

Observability should respect privacy.

## Traces help explain AI latency

An AI request can include:

retrieval;
reranking;
model queue;
prefill;
generation;
tool calls;
second model call.

Trace each stage.

If user latency is 12 seconds, identify where time went.

The model may only account for half.

## Version everything

An evaluation result should record:

model version;
prompt version;
retrieval index;
tool schema;
dataset version;
evaluator version.

Without versioning, comparisons are not reproducible.

## Practical exercise

Create 50 test cases for one AI feature.

Define three exact metrics and two human-rated dimensions.

Run current system.

Change one variable only.

Run again.

Inspect both aggregate and worst-case regressions.

The goal is to make improvement measurable rather than anecdotal.

## The lesson to carry forward

Evaluation converts AI behavior into evidence.

The next lesson adds the operational constraints around trustworthy deployment: safety, privacy, reliability, and cost.
