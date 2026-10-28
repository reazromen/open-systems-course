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

## Key Takeaways

Persist before acknowledging durable acceptance. Separate history from live delivery, make retries idempotent, and treat presence as an estimate.

## Practice Exercise

Draw the client, WebSocket gateway, message API, durable store, queue, and offline delivery path. Explain what happens if a recipient is offline.
