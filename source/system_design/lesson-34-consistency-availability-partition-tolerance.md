# Lesson 34 — Consistency, Availability, and Network Partitions

**Course:** System Design — From the Ground Up  
**Module 7 — Distributed Systems**

## Learning Objectives
- Define consistency and availability in distributed services.
- Explain a network partition.
- Recognize that distributed design involves explicit trade-offs.

## Core Concept
Consistency can mean different things in different contexts; in distributed data systems it often concerns whether reads observe writes according to a defined guarantee. Availability concerns whether requests receive a non-error response. A network partition prevents some nodes from communicating. During a partition, a system may have to limit some operations to preserve its chosen correctness guarantees.

## Worked Example
Two regions temporarily lose communication. A globally unique username must not be assigned to two users. The service may reject or delay some registrations until it can safely coordinate, rather than accepting conflicting writes in both regions.

## Common Pitfall
Using “consistent” as a synonym for “the database is healthy.” State the actual guarantee—such as read-after-write or linearizability—and the failure conditions under which it applies.

## Knowledge Check
1. What is a network partition?
   - **Answer:** A communication failure that divides nodes into groups unable to reliably communicate with each other.
2. Why might a system reject writes during a partition?
   - **Answer:** To preserve a correctness guarantee that cannot safely be maintained by accepting independent conflicting writes.

## Practice Hint
Choose a username service and a view counter. Decide which operations may tolerate stale results and which require coordination.

## Self-Check
Can you state the consistency guarantee your example needs and what behavior users see during a partition?

## Next Lesson

Lesson 35
