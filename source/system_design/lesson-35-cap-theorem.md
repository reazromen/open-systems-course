# Lesson 35 — The CAP Theorem

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Systems**

## Learning Objectives
- Define consistency, availability, and partition tolerance in the CAP model.
- Explain why network partitions force a trade-off between consistency and availability.
- Recognize why CP and AP are useful shorthand rather than complete descriptions of a database.

## Core Concept
The CAP theorem says that when a network partition prevents distributed nodes from communicating reliably, a system cannot guarantee both a single strongly consistent view of data and a successful response from every non-failed node for every request. Partition tolerance is not an optional feature in a real distributed system: networks can lose, delay, or isolate messages. The practical design decision is what the system should do while communication is broken.

## What C, A, and P Mean
- **Consistency:** completed operations appear in a single, up-to-date order, commonly described using linearizability.
- **Availability:** each request reaching a non-failed node receives a non-error response, even if the response cannot include the newest update.
- **Partition tolerance:** the system continues to operate despite communication failures between parts of the system.

These definitions are specific to CAP. Consistency here does not simply mean “the data follows database rules,” and availability is not the same as a service's overall uptime percentage.

## Worked Example
Imagine two inventory replicas, one in Dhaka and one in Singapore. Both show one item left. A network partition separates them, and a customer buys the item through Dhaka. The Singapore replica cannot learn about that purchase. If it accepts another purchase immediately, the system may sell an item it no longer has. If it refuses or delays the second purchase until it can confirm the state, it protects consistency but does not serve every request successfully during the partition.

## CP and AP Are Simplifications
A **CP-style** choice preserves strong consistency by refusing or delaying some operations during a partition. An **AP-style** choice continues responding on both sides, potentially returning stale data or accepting updates that must later be reconciled. These are descriptions of behavior under a failure condition, not permanent labels that fully describe every operation in a product. Many systems make different choices for reads, writes, and different data types.

## Common Pitfall
Do not say that a system must always choose only two of consistency, availability, and partition tolerance under normal conditions. CAP focuses on the trade-off when a partition occurs. Latency, durability, replication lag, and recovery are related design concerns, but they are not interchangeable with CAP's three terms.

## Knowledge Check
1. Two replicas cannot communicate. One rejects a write until it can safely coordinate with the other. Which property is it prioritizing?
   - **Answer:** Strong consistency, at the cost of availability for that operation during the partition.
2. Why is “AP database” an incomplete description?
   - **Answer:** A product can provide different guarantees for different operations and configurations. The label does not explain its exact read, write, conflict, or recovery behavior.

## Practice Hint
Draw two replicas with a broken network link. Trace one write under two policies: (a) reject or wait, and (b) accept locally and reconcile later. Mark what the client sees and what risks remain.

## Self-Check
Can you explain CAP without saying “pick any two,” and can you identify which user operation should fail safely rather than risk violating a business invariant?

## Next Lesson
Lesson 36 — Eventual Consistency and Distributed Transactions
