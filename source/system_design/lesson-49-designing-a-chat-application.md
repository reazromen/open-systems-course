# Lesson 49: Designing a Chat Application

A chat system must deliver messages quickly, preserve history, and handle offline devices. Separate durable message storage from live connection management and delivery.

## Requirements first

Clarify one-to-one and group chats, ordering, read receipts, attachments, offline delivery, and multi-device support. Decide which features are essential and define delivery guarantees.

## Message flow

A client sends a message to an authenticated API or WebSocket gateway. Validate membership, assign a stable ID, persist the message, and only then acknowledge durable acceptance. An event stream can distribute it to recipients.

## Live connections and presence

WebSockets support bidirectional messaging. Gateways maintain client connections while a presence service tracks approximate availability using heartbeats and expiry; a network failure may not close cleanly.

## Offline delivery and ordering

Store history for offline recipients. Use conversation-scoped sequence numbers if ordering matters. Stable client message IDs and idempotent processing prevent retries from creating duplicates.

## Scaling and safety

Partition data by conversation or access pattern, guard against hot groups, enforce per-user limits, and monitor delivery delay, connection counts, queue age, and failed writes.

## Learning Objectives

- Define functional and non-functional requirements for a chat system.

- Explain persistent messages, live delivery, presence, and offline delivery.

- Design retry-safe messaging and realistic ordering guarantees.

## Worked Example

A user sends a message while the recipient is offline. The sender's API authenticates the request, assigns a stable message ID, persists it, and acknowledges acceptance. A delivery worker later notifies the recipient when they reconnect.

**Reasoning:** Persist before acknowledging durable acceptance; use WebSockets for live delivery, durable storage for history, and retry-safe delivery with client deduplication. Do not equate an open socket with successful message delivery.

## Check Your Understanding

What should the system do before acknowledging a message as durably accepted?

- A. Only send it over an open WebSocket.

- B. Persist the message or otherwise meet the stated durability contract.

- C. Wait until the recipient reads it.

**Answer and explanation:** B — the acknowledgment should match the promised durability guarantee; live transport alone is not durable storage.

## Common Pitfall

Assuming WebSocket delivery guarantees persistence or exactly-once delivery.

## Practice Hint

Draw send, persist, acknowledge, deliver, and read-receipt steps separately; specify message IDs and ordering scope.

## Self-Check

Can you explain how a message is stored, retried, and deduplicated when a recipient is offline?

## Key Takeaways

Persist before acknowledging durable acceptance. Separate history from live delivery, make retries idempotent, and treat presence as an estimate.

## Practice Exercise

Draw the client, WebSocket gateway, message API, durable store, queue, and offline delivery path. Explain what happens if a recipient is offline.
