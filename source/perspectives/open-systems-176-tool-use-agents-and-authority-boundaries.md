---
title: "Tool Use, Agents, and Authority Boundaries"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-176-tool-use-agents-and-authority-boundaries.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 15
excerpt: "When a model can call tools, it becomes part of a control loop that can read or change external systems. Tool schemas, authorization, confirmation, idempotency, sandboxing, and audit matter more than the model's wording."
eyebrow: "Open Systems Course · Lesson 176 of 180"
---

A chatbot that writes text is one risk profile.

A system that can:

send email;
deploy code;
delete files;
move money;
reboot devices;
place calls

is a control system.

The model's output can become an action.

## A tool call should be typed

Instead of letting the model generate arbitrary shell commands, expose narrow operations:

restart_service(service_id);
create_ticket(title, body);
get_device_status(device_id).

Typed schemas reduce ambiguity.

They also create a place for deterministic validation.

## The model should not own authorization

Suppose the model asks:

delete_customer(customer_id=42).

The application must check whether the authenticated user is allowed to delete customer 42.

“The model decided it was okay” is not authorization.

Tool execution should run under the user's or workload's actual permissions.

## Read tools and write tools have different risk

Search documentation is lower risk than production deletion.

Classify tools by side effect.

High-risk actions can require:

explicit confirmation;
approval;
two-person control;
dry-run;
narrow scopes;
strong audit.

Do not apply one confirmation rule to every tool.

## Idempotency still matters

An agent can retry a tool call after timeout.

If create_invoice runs twice, duplicate business state can result.

Tool APIs need the same idempotency design as any distributed API.

Agent architecture does not remove network ambiguity.

## Tool results are untrusted data

A web page, email, file, or database row can contain text telling the model to ignore policy and take another action.

That is prompt injection through tool output.

Treat external content as data.

Restrict which tools can be called after reading untrusted content.

Enforce policy outside the model.

## Planning can be separated from execution

One safer architecture:

model proposes plan;
deterministic policy checks plan;
human approves high-risk steps;
executor performs one step;
result returns;
state is updated.

This creates inspection boundaries.

A fully autonomous loop has fewer checkpoints and therefore needs stronger sandboxing and limits.

## Sandboxing limits blast radius

Code-execution tools should run with:

filesystem isolation;
network restrictions;
resource limits;
short-lived credentials;
ephemeral environments;
audit.

Never give a general-purpose model unrestricted root access merely because it is convenient.

Capability should match task.

## Agents need stop conditions

A loop that keeps trying can:

spend unlimited tokens;
repeat side effects;
hammer failing services;
fill queues.

Define:

maximum steps;
deadline;
cost budget;
retry limit;
terminal states.

Agents are distributed workflows and need workflow controls.

## Audit should connect human intent to tool effect

Record:

user request;
authenticated identity;
model/tool version;
proposed action;
policy decision;
approval;
tool parameters;
result;
external IDs.

Do not store secrets unnecessarily.

The audit trail should answer why an action happened.

## Practical exercise

Design a support agent with three tools:

read_ticket;
search_docs;
issue_refund.

Make refund require a deterministic amount limit and user confirmation.

Then test:

duplicate refund attempt;
tool timeout after success;
malicious instructions inside ticket text;
unauthorized tenant;
agent exceeding step budget.

The important behavior is the tool boundary, not how conversational the model sounds.

## The lesson to carry forward

Tool-using AI is a control plane.

The next lesson gives that control plane state across time: memory, workflows, checkpoints, and resumable execution.
