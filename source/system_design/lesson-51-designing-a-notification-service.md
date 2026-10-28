# Lesson 51: Designing a Notification Service

A notification service delivers events through in-app, email, SMS, or push channels. Separate the event that happened from the decision about whether, when, and how to notify someone.

## Separate events and delivery

A product emits an event; the notification service consumes it, checks preferences, renders content, and schedules delivery. Queues buffer bursts and isolate provider slowness.

## Preferences and templates

Store channel preferences, quiet hours, locale, and verified destinations. Use versioned templates. Distinguish essential transactional messages from optional notifications and respect consent.

## Retry safely

A provider may accept a message even if the response times out. Use stable notification IDs, provider idempotency where supported, bounded backoff, and a dead-letter queue for persistent failures.

## Prioritize and limit

Separate urgent security notices from low-priority updates. Apply per-user and per-channel limits and isolate provider outages so they do not exhaust every worker.

## Observe the lifecycle

Track queued, attempted, provider-accepted, delivered when measurable, bounced, and failed states. Provider acceptance is not proof a person read a message. Monitor queue age, cost, and throttling.

## Learning Objectives

- Separate notification events from provider delivery.

- Design retry-safe delivery states, preferences, and templates.

- Monitor outcomes without exposing sensitive notification content.

## Worked Example

A push provider times out after possibly accepting a request. The service cannot safely assume it failed.

**Reasoning:** Persist a delivery attempt and provider correlation ID, retry according to provider semantics, and reconcile callbacks or status queries. Use stable event IDs and deduplication where supported; exactly-once external delivery may not be achievable.

## Check Your Understanding

Why is a timeout not proof that a notification was not sent?

- A. The provider may have accepted it but the response was lost.

- B. Timeouts happen only when DNS fails.

- C. A retry always cancels the first request.

**Answer and explanation:** A — the request outcome may be unknown; model that state and reconcile instead of blindly duplicating sends.

## Common Pitfall

Retrying every ambiguous result without idempotency or deduplication, which can send duplicate notifications.

## Practice Hint

Model queued, attempted, accepted, delivered, failed, and unknown states and define transitions.

## Self-Check

Can you explain how you would handle an ambiguous provider timeout?

## Key Takeaways

Use an asynchronous workflow with explicit states, deduplication, preference checks, and accurate distinctions between acceptance, delivery, and engagement.

## Practice Exercise

A provider request times out after it may have accepted a message. Show how IDs, retries, and delivery states reduce duplicate or lost notifications.
