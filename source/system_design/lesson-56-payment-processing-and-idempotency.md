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

## Key Takeaways

Timeouts create uncertainty. Stable idempotency keys, explicit states, authenticated callbacks, and reconciliation protect financial workflows.

## Practice Exercise

A payment request times out after being sent. Describe safe retry, webhook, and reconciliation steps without assuming the payment failed.
