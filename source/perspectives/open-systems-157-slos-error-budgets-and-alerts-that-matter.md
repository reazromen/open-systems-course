---
title: "SLOs, Error Budgets, and Alerts That Matter"
date: '2026-10-07'
draft: false
language: en
url: /posts/open-systems-157-slos-error-budgets-and-alerts-that-matter.html
topic: systems-thinking
tags:
- architecture
featured: false
read_time: 13
excerpt: "Monitoring becomes operationally useful when it measures user-visible reliability. SLIs quantify behavior, SLOs define targets, error budgets quantify tolerated failure, and alerts should trigger on actionable risk."
eyebrow: "Open Systems Course · Lesson 157 of 180"
---

A dashboard can have 500 panels and still fail to answer:

are users receiving the service we promised?

Service Level Indicators, Objectives, and error budgets connect telemetry to reliability.

## An SLI is a measured behavior

Examples:

successful requests / valid requests;
requests under 300 ms / valid requests;
successful call setups / attempted calls;
telemetry samples ingested within five minutes / expected samples.

The denominator matters.

If health-check traffic is included, reliability can look better than user traffic.

## An SLO is a target

Example:

99.9 percent of valid API requests succeed over 30 days.

The target is a product/engineering decision.

It should reflect user need and cost.

A meaningless 100 percent objective can force enormous complexity while still missing the failure users care about.

## Error budget is allowed unreliability

If the SLO is 99.9 percent, the remaining 0.1 percent is the error budget.

The budget can guide decisions:

ship faster while budget is healthy;
slow risky changes when burn is high;
focus reliability work when repeated incidents consume the budget.

This makes reliability a managed resource.

## Availability should be measured at the right boundary

Process uptime is not user availability.

A process can be running while every request returns 500.

Measure success where the user experiences it.

For telephony, “SIP service process running” is weaker than successful call setup and acceptable media.

For IoT, broker uptime is weaker than end-to-end telemetry freshness.

## Alert on symptoms when possible

CPU high can be interesting.

Users failing is urgent.

Symptom alerts include:

error-rate SLO burn;
latency burn;
call setup failures;
queue lag causing missed freshness target.

Resource alerts are useful when they predict imminent symptom.

Avoid waking humans for every internal metric crossing a threshold.

## Burn-rate alerts detect fast and slow failures

An SLO can be consumed quickly by a severe outage or slowly by chronic small failures.

Multi-window burn-rate alerting can detect both.

A fast-burn alert uses short windows for urgent outages.

A slow-burn alert uses longer windows for persistent degradation.

Google SRE literature develops this approach.

## Alerts need ownership and action

Every paging alert should answer:

who owns this?
what user risk does it represent?
what first diagnostic step exists?
when is it safe to ignore?
what automated recovery already happened?

An alert with no action becomes noise.

## Practical exercise

Choose one service.

Define one SLI in exact numerator/denominator form.

Define a 30-day SLO.

Then list every current alert and ask whether it predicts or measures violation of that objective.

Do not delete useful capacity alerts blindly.

Classify them as page, ticket, dashboard, or recording rule.

## The lesson to carry forward

SLOs make reliability measurable from the user's perspective.

The next lesson moves into the human system around failures: incident response, timelines, communication, and learning.
