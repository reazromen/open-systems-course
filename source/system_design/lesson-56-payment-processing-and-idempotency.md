# Lesson 56: Payment Processing and Idempotency

Payment systems must handle uncertainty safely. A timeout does not prove a payment failed: a provider may have completed it while the response was lost.

## Explicit payment states

Store internal payment ID, order ID, amount, currency, provider reference, status, and timestamps. Model created, pending, authorized, captured, failed, cancelled, and refunded states.

## Stable idempotency keys

Use a stable key for one logical payment operation. Retrying with the same key should return the same logical result where the provider supports it. Do not reuse the key for a different operation or changed parameters.

## Callbacks and reconciliation

Verify webhook signatures and process event IDs idempotently; providers may retry or deliver events out of order. Periodically compare internal records with provider reports to detect missing or conflicting state.

## Authorization and refunds

Some flows authorize before capture; others capture immediately. Refunds are separate financial operations. Define ownership of each transition and preserve an audit trail.

## Protect sensitive data

Avoid storing raw card data unless equipped and authorized to do so. Prefer provider-hosted fields or tokenization. Monitor duplicate attempts, webhook lag, reconciliation mismatches, and declines.

## Learning Objectives

- Model payment authorization, capture, failure, refund, and reconciliation states.

- Use stable idempotency keys for retry-safe requests.

- Handle webhooks, sensitive data, and ambiguous outcomes.

## Worked Example

A payment request times out after being sent to the provider.

**Reasoning:** Retry with the same idempotency key when provider semantics support it, process signed webhooks idempotently, and reconcile unresolved operations against provider records. Keep payment states explicit rather than equating timeout with failure.

## Check Your Understanding

What is the purpose of a stable idempotency key?

- A. To make each retry a brand-new payment.

- B. To let repeated attempts for the same logical operation be recognized as one operation.

- C. To replace authentication.

**Answer and explanation:** B — the key helps prevent duplicate effects for the same logical request when requests are retried.

## Common Pitfall

Generating a new idempotency key on every retry, which defeats deduplication.

## Practice Hint

Describe the lifecycle from request creation through provider response, webhook, retry, and reconciliation.

## Self-Check

Can you explain how retries and webhooks avoid duplicate payment effects?

## Key Takeaways

Timeouts create uncertainty. Stable idempotency keys, explicit states, authenticated callbacks, and reconciliation protect financial workflows.

## Practice Exercise

A payment request times out after being sent. Describe safe retry, webhook, and reconciliation steps without assuming the payment failed.
