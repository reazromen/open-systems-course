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

## Key Takeaways

Use an asynchronous workflow with explicit states, deduplication, preference checks, and accurate distinctions between acceptance, delivery, and engagement.

## Practice Exercise

A provider request times out after it may have accepted a message. Show how IDs, retries, and delivery states reduce duplicate or lost notifications.
