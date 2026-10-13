---
title: "Memory, State, and Resumable AI Workflows"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-177-memory-state-and-resumable-ai-workflows.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "AI memory is application state stored outside the model. Conversation summaries, user preferences, workflow checkpoints, tool results, and long-term records need schemas, permissions, retention, conflict handling, and deletion."
eyebrow: "Open Systems Course · Lesson 177 of 180"
---

A model does not remember because it is intelligent.

An application remembers because it stores state and provides it again later.

That distinction matters for correctness, privacy, and architecture.

## Conversation history is one memory form

An application can include prior messages in each inference request.

As history grows, token cost and context pressure increase.

Systems can:

truncate;
summarize;
retrieve relevant turns;
store structured facts.

Each strategy loses or transforms information differently.

## Summaries are derived state

If a model summarizes 100 messages into one paragraph, that paragraph is not the original history.

It is a lossy derived representation.

Keep source history when audit or exact reconstruction matters.

Version summaries so they can be regenerated under new policies.

## Structured memory is easier to validate

Instead of storing:

“User kind of prefers morning meetings unless Tuesday...”

store fields when the domain supports them:

preferred_meeting_window;
timezone;
exceptions;
source;
updated_at.

Structured state can be validated and updated deterministically.

Free-form semantic memory is useful for fuzzier preferences.

Use each for what it does well.

## Memory needs provenance

A remembered claim should ideally know where it came from:

user explicitly stated;
inferred by model;
imported from system;
observed tool result.

These have different trust levels.

An inference should not silently become permanent fact.

## Workflow state is different from user memory

An agent booking travel can have:

step=awaiting_payment;
selected_flight_id;
reservation_hold_expiry;
completed_tool_calls.

That is workflow state.

It should be stored durably if the process must survive restart.

Treating it as conversation text makes recovery fragile.

## Checkpoints make long work resumable

After each side-effecting step, persist:

current state;
completed operation IDs;
next allowed actions.

If the process crashes, resume from the checkpoint.

Do not replay every tool call blindly from the start.

This is the same idempotency and durable workflow logic from distributed systems.

## Memory needs access control

A model serving tenant A should not retrieve tenant B's remembered data.

Apply authorization before retrieval.

Memory stores are databases.

All the lessons about tenant boundaries, encryption, retention, backup, and deletion apply.

## Forgetting is a feature

Some data should expire.

Some users can request deletion.

Some workflow data becomes irrelevant after completion.

Define retention by category.

“Store everything forever because context may help” is expensive and creates privacy risk.

## Conflicts need policy

A user says their preferred language is English.

Later they say Bangla.

Which value is current?

Use timestamps, explicit user corrections, or domain rules.

Do not average contradictory preferences.

Memory is mutable state.

## Practical exercise

Design memory for an AI scheduling assistant.

Separate tables or objects for:

conversation history;
structured user preferences;
calendar-derived facts;
workflow state;
audit log.

For each field define:

source;
retention;
who can read;
who can modify;
deletion behavior.

The schema will reveal that “memory” is several different systems.

## The lesson to carry forward

AI memory is external application state with normal data-system responsibilities.

The next lesson asks how to know whether the system is actually good: evaluation, datasets, regression tests, online metrics, and observability.
