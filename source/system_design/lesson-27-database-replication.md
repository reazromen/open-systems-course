# Lesson 27 — Database Replication

**Course:** System Design — From the Ground Up  
**Module 6 — Distributed Data**

## Learning Objectives
- Explain primary-replica replication.
- Distinguish replication from backup.
- Understand replication lag and read-after-write behavior.

## Core Concept
Replication copies database changes to other database nodes. In a primary-replica design, writes usually go to the primary and changes are copied to replicas. Replicas can serve read traffic or support recovery, but copying changes takes time and configuration determines failover behavior.

## Worked Example
A user changes their profile name. The write succeeds on the primary, but a read routed immediately to a lagging replica returns the old name. For that user's next read, route to the primary or use a consistency strategy that waits until the replica has applied the write.

## Common Pitfall
Replication is not a backup. Accidental deletion or corrupted data may replicate too. Maintain independent, tested backups.

## Knowledge Check
1. What is replication lag?
   - **Answer:** The delay between a change being committed on one node and becoming visible on another.
2. Does having a replica automatically guarantee safe automatic failover?
   - **Answer:** No. Promotion, health detection, fencing, client routing, and data-loss tolerance must be designed.

## Practice Hint
Draw a primary and two replicas. Add arrows for change propagation and label where writes and reads go.

## Self-Check
Can you explain a stale read, and why replication and backups solve different problems?

## Next Lesson

Lesson 28
