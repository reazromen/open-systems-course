# Lesson 55: Designing an E-commerce System

E-commerce connects browsing, inventory, carts, checkout, payments, and fulfillment. Each workflow has different consistency needs, so every data domain needs a clear source of truth.

## Map the journey

List product discovery, cart, checkout, order confirmation, payment, and fulfillment. Browsing can tolerate cached data; stock reservation and payment require stronger correctness.

## Separate domains

Catalog data changes slowly and can be cached. A cart changes frequently. Inventory needs atomic reservation or conditional updates to avoid overselling, especially during promotions.

## Coordinate checkout

Create a pending order, validate price and stock, reserve inventory, and initiate payment with an idempotency key. Use explicit states or a saga to coordinate steps and release reservations after failure.

## Make order state explicit

Model transitions such as pending, confirmed, paid, packed, shipped, cancelled, and refunded. Enforce valid transitions and keep an audit trail instead of relying on one boolean.

## Scale and operate

Use search indexes for discovery but revalidate authoritative price and stock at checkout. Monitor conversion, reservation conflicts, payment errors, queue age, and fulfillment delays.

## Key Takeaways

Give catalog, cart, inventory, payment, and orders clear responsibilities. Use reservations, explicit states, idempotency, and reconciliation.

## Practice Exercise

Trace checkout through validation, reservation, payment, confirmation, and fulfillment. What if payment succeeds but the confirmation response is lost?
